import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthRepository } from '@/repositories/AuthRepository';
import { AuthenticationError, AuthorizationError, ValidationError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { IAuthService } from '@/interfaces/IService';
import { Usuario } from '@prisma/client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserPayload {
  sub: string;
  email: string;
  nombres: string;
  apellidos: string;
  roleId: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export class AuthService implements IAuthService<Usuario, string> {
  private authRepository: AuthRepository;
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtRefreshExpiresIn: string;
  private readonly bcryptRounds: number;

  constructor() {
    this.authRepository = new AuthRepository();

    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  }

  async authenticate(credentials: LoginCredentials): Promise<{ token: string; user: any }> {
    try {
      const { email, password } = credentials;

      // Validate input
      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
      }

      // Find user with role and permissions
      const user = await this.authRepository.findUserWithRoleByEmail(email);
      if (!user) {
        await this.authRepository.recordLoginAttempt(email, false);
        throw new AuthenticationError('Invalid credentials');
      }

      // Check if user is active
      if (!user.activo) {
        await this.authRepository.recordLoginAttempt(email, false);
        throw new AuthenticationError('User account is inactive');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        await this.authRepository.recordLoginAttempt(email, false);
        throw new AuthenticationError('Invalid credentials');
      }

      // Extract permissions from role
      const permissions = user.rol.modulos.map(rm => rm.modulo.codigo);

      // Create JWT payload
      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        roleId: user.rol_id,
        permissions,
      };

      // Generate access token
      const token = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
        issuer: 'siges-backend',
        audience: 'siges-frontend',
      });

      // Generate refresh token
      const refreshToken = jwt.sign(
        { sub: user.id, type: 'refresh' },
        this.jwtRefreshSecret,
        { expiresIn: this.jwtRefreshExpiresIn }
      );

      // Store refresh token (simplified - in production, use a separate table)
      await this.authRepository.createRefreshToken(
        user.id,
        refreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      );

      // Update last login
      await this.authRepository.updateLastLogin(user.id);

      // Record successful login
      await this.authRepository.recordLoginAttempt(email, true);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      logger.info('User authenticated successfully', {
        userId: user.id,
        email: user.email,
        roleId: user.rol_id,
      });

      return {
        token,
        user: {
          ...userWithoutPassword,
          permissions,
        },
      };
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof ValidationError) {
        throw error;
      }
      logger.error('Authentication failed:', error);
      throw new AuthenticationError('Authentication failed');
    }
  }

  async validateToken(token: string): Promise<UserPayload> {
    try {
      if (!token) {
        throw new AuthenticationError('Token is required');
      }

      // Remove Bearer prefix if present
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

      const decoded = jwt.verify(cleanToken, this.jwtSecret, {
        issuer: 'siges-backend',
        audience: 'siges-frontend',
      }) as UserPayload;

      // Verify user still exists and is active
      const user = await this.authRepository.findById(decoded.sub);
      if (!user || !user.activo) {
        throw new AuthenticationError('User not found or inactive');
      }

      return decoded;
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expired');
      }
      if (error instanceof AuthenticationError) {
        throw error;
      }
      logger.error('Token validation failed:', error);
      throw new AuthenticationError('Token validation failed');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      if (!refreshToken) {
        throw new AuthenticationError('Refresh token is required');
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as any;

      if (decoded.type !== 'refresh') {
        throw new AuthenticationError('Invalid refresh token type');
      }

      // Find user with role and permissions
      const user = await this.authRepository.findUserWithRoleById(decoded.sub);
      if (!user || !user.activo) {
        throw new AuthenticationError('User not found or inactive');
      }

      // Extract permissions from role
      const permissions = user.rol.modulos.map(rm => rm.modulo.codigo);

      // Create new JWT payload
      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        roleId: user.rol_id,
        permissions,
      };

      // Generate new access token
      const newToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
        issuer: 'siges-backend',
        audience: 'siges-frontend',
      });

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        { sub: user.id, type: 'refresh' },
        this.jwtRefreshSecret,
        { expiresIn: this.jwtRefreshExpiresIn }
      );

      // Invalidate old refresh token and create new one
      await this.authRepository.invalidateRefreshToken(user.id);
      await this.authRepository.createRefreshToken(
        user.id,
        newRefreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      );

      logger.info('Token refreshed successfully', {
        userId: user.id,
        email: user.email,
      });

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      logger.error('Token refresh failed:', error);
      throw new AuthenticationError('Token refresh failed');
    }
  }

  async logout(token: string): Promise<void> {
    try {
      if (!token) {
        return;
      }

      // Extract user ID from token
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      const decoded = jwt.decode(cleanToken) as any;

      if (decoded && decoded.sub) {
        // Invalidate all refresh tokens for the user
        await this.authRepository.invalidateRefreshToken(decoded.sub);

        logger.info('User logged out successfully', {
          userId: decoded.sub,
        });
      }
    } catch (error) {
      logger.error('Logout failed:', error);
      // Don't throw error during logout
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      if (!password || password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long');
      }

      // Password strength validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      if (!passwordRegex.test(password)) {
        throw new ValidationError(
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        );
      }

      return await bcrypt.hash(password, this.bcryptRounds);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error('Password hashing failed:', error);
      throw new AuthenticationError('Password processing failed');
    }
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      logger.error('Password verification failed:', error);
      return false;
    }
  }

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    try {
      return await this.authRepository.checkUserPermission(userId, permission);
    } catch (error) {
      logger.error('Permission check failed:', error);
      return false;
    }
  }

  async create(
    data: Partial<Usuario> & {
      email: string;
      password: string;
      nombres: string;
      apellidos: string;
      rolId: string;
    }
  ): Promise<Usuario> {
    try {
      // Hash password
      const hashedPassword = await this.hashPassword(data.password!);

      // Create user
      const user = await this.authRepository.createUser({
        ...data,
        password: hashedPassword,
        rolId: data.rolId,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      logger.info('User created successfully', {
        userId: user.id,
        email: user.email,
        roleId: user.rol_id,
      });

      return userWithoutPassword as Usuario;
    } catch (error) {
      logger.error('User creation failed:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.authRepository.findById(id);
  }

  async findAll(query?: any): Promise<any> {
    // Implement if needed
    throw new Error('Method not implemented');
  }

  async update(id: string, data: Partial<Usuario>): Promise<Usuario | null> {
    return this.authRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.authRepository.delete(id);
  }
}