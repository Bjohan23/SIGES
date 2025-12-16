import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { AuthService } from '@/services/AuthService';
import { AuthenticatedRequest } from '@/middleware/auth';
import { auditAction } from '@/middleware/audit';
import { authRateLimit } from '@/middleware/rateLimit';
import { AuthenticationError, ValidationError, ForbiddenError } from '@/utils/errors';
import { Validator, validateBody } from '@/utils/validation';

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  // Login endpoint handler
  loginHandler = this.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    this.logRequest(req, 'LOGIN');

    const startTime = Date.now();

    // Validate request body
    const validator = new Validator()
      .addRule({ field: 'email', required: true, type: 'email' })
      .addRule({ field: 'password', required: true, type: 'string', minLength: 1 });

    const { isValid, errors } = validator.validate(req.body);
    if (!isValid) {
      throw new ValidationError(JSON.stringify(errors));
    }

    const { email, password } = req.body;

    // Sanitize input
    const sanitizedData = this.sanitizeInput({ email, password });

    // Authenticate user
    const result = await this.authService.authenticate(sanitizedData);

    // Set refresh token in HTTP-only cookie (more secure)
    res.cookie('refreshToken', 'placeholder', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response with access token
    this.success(res, {
      token: result.token,
      user: result.user,
      expiresIn: 24 * 60 * 60, // 24 hours
      tokenType: 'Bearer',
    });

    const duration = Date.now() - startTime;
    this.logResponse(req, 200, duration);
  });

  // Refresh token endpoint handler
  refreshTokenHandler = this.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    this.logRequest(req, 'REFRESH_TOKEN');

    const startTime = Date.now();

    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AuthenticationError('Refresh token is required');
    }

    const result = await this.authService.refreshToken(refreshToken);

    // Update refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    this.success(res, {
      token: result.token,
      expiresIn: 24 * 60 * 60, // 24 hours
      tokenType: 'Bearer',
    });

    const duration = Date.now() - startTime;
    this.logResponse(req, 200, duration);
  });

  // Logout endpoint handler
  logoutHandler = this.asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    this.logRequest(req, 'LOGOUT');

    const startTime = Date.now();

    const token = req.headers.authorization;
    await this.authService.logout(token!);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    this.success(res, { message: 'Logged out successfully' });

    const duration = Date.now() - startTime;
    this.logResponse(req, 200, duration);
  });

  // Get current user profile handler
  getProfileHandler = this.asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    this.logRequest(req, 'GET_PROFILE');

    const startTime = Date.now();

    const userId = req.user?.id;
    if (!userId) {
      throw new AuthenticationError('User not authenticated');
    }

    const user = await this.authService.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user as any;

    this.success(res, {
      user: {
        ...userWithoutPassword,
        permissions: req.user?.permissions || [],
      },
    });

    const duration = Date.now() - startTime;
    this.logResponse(req, 200, duration);
  });

  // Change password handler
  changePasswordHandler = this.asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    this.logRequest(req, 'CHANGE_PASSWORD');

    const startTime = Date.now();

    const userId = req.user?.id;
    if (!userId) {
      throw new AuthenticationError('User not authenticated');
    }

    // Validate request body
    const validator = new Validator()
      .addRule({ field: 'currentPassword', required: true, type: 'string', minLength: 1 })
      .addRule({ field: 'newPassword', required: true, type: 'string', minLength: 8 });

    const { isValid, errors } = validator.validate(req.body);
    if (!isValid) {
      throw new ValidationError(JSON.stringify(errors));
    }

    const { currentPassword, newPassword } = req.body;

    // Get current user data
    const user = await this.authService.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.authService.verifyPassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Check if new password is same as current
    const isSamePassword = await this.authService.verifyPassword(newPassword, user.password);
    if (isSamePassword) {
      throw new ValidationError('New password must be different from current password');
    }

    // Hash new password
    const hashedNewPassword = await this.authService.hashPassword(newPassword);

    // Update password
    await this.authService.update(userId, { password: hashedNewPassword });

    this.success(res, { message: 'Password changed successfully' });

    const duration = Date.now() - startTime;
    this.logResponse(req, 200, duration);
  });

  // Validate token handler (for frontend to check if token is still valid)
  validateTokenHandler = this.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    this.logRequest(req, 'VALIDATE_TOKEN');

    const startTime = Date.now();

    const token = req.headers.authorization;
    if (!token) {
      throw new AuthenticationError('Token is required');
    }

    const payload = await this.authService.validateToken(token);

    this.success(res, {
      valid: true,
      payload: {
        sub: payload.sub,
        email: payload.email,
        nombres: payload.nombres,
        apellidos: payload.apellidos,
        permissions: payload.permissions,
        exp: payload.exp,
      },
    });

    const duration = Date.now() - startTime;
    this.logResponse(req, 200, duration);
  });

  // Handle request method
  async handleRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    // This method is required by IController interface
    next();
  }
}