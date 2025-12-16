import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIGES Backend API',
      version: '1.0.0',
      description: 'Sistema de Gestión Social Backend API Documentation',
      contact: {
        name: 'API Support',
        email: 'support@siges.com',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Error message',
                },
                statusCode: {
                  type: 'integer',
                  description: 'HTTP status code',
                },
                isOperational: {
                  type: 'boolean',
                  description: 'Whether this is an expected operational error',
                },
              },
            },
            timestamp: {
              type: 'string',
              description: 'ISO timestamp of the error',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            timestamp: {
              type: 'string',
              description: 'ISO timestamp of the response',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'admin@siges.com',
            },
            password: {
              type: 'string',
              minLength: 1,
              description: 'User password',
              example: 'Admin123!',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT access token',
                },
                user: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'User ID',
                    },
                    email: {
                      type: 'string',
                      description: 'User email',
                    },
                    nombres: {
                      type: 'string',
                      description: 'User first name',
                    },
                    apellidos: {
                      type: 'string',
                      description: 'User last name',
                    },
                    rol: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        nombre: {
                          type: 'string',
                        },
                      },
                    },
                    permissions: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                      description: 'User permissions',
                    },
                  },
                },
                expiresIn: {
                  type: 'number',
                  description: 'Token expiration time in seconds',
                },
                tokenType: {
                  type: 'string',
                  example: 'Bearer',
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);

export const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SIGES Backend API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    docExpansion: 'none',
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
  },
};

export { swaggerUi };