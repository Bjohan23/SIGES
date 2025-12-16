# SIGES Backend

Sistema de Gestión Social Backend - API construida con Node.js, Express, TypeScript y Prisma siguiendo los principios de Clean Architecture y SOLID.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [API Endpoints](#api-endpoints)
- [Documentación](#documentación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)
- [Testing](#testing)
- [Despliegue](#despliegue)

## ✨ Características

- **Arquitectura Limpia**: Separación clara de responsabilidades con Controllers, Services y Repositories
- **TypeScript**: Tipado estático para mayor robustez del código
- **Prisma ORM**: Base de datos type-safe con migraciones automáticas
- **Autenticación JWT**: Tokens de acceso y refresh tokens con configuración de seguridad
- **Autorización basada en Roles**: Sistema flexible de permisos
- **Validación de Datos**: Validación robusta de inputs
- **Manejo de Errores**: Manejo centralizado de errores con logging
- **Auditoría**: Registro automático de acciones del sistema
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS Configurable**: Configuración de orígenes permitidos
- **API Documentation**: Documentación automática con Swagger/OpenAPI
- **Logging Completo**: Sistema de logging con Winston
- **Environment Variables**: Configuración segura por entorno

## 🏗️ Arquitectura

El proyecto sigue una arquitectura limpia con las siguientes capas:

```
src/
├── controllers/     # Manejo de requests y responses
├── services/        # Lógica de negocio
├── repositories/    # Acceso a datos
├── middleware/      # Middleware de Express
├── routes/          # Definición de rutas
├── utils/           # Utilidades compartidas
├── interfaces/      # Definiciones de interfaces
├── config/          # Configuración de la aplicación
└── types/           # Tipos personalizados
```

## 🛠️ Tecnologías

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Superset de JavaScript con tipado
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **bcryptjs** - Hashing de contraseñas
- **Winston** - Logging
- **Jest** - Testing framework
- **ESLint** - Linting
- **Prettier** - Formato de código

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 13.0
- Git

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd SIGES/backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con las configuraciones correspondientes
   ```

4. **Configurar la base de datos**
   ```bash
   # Asegurarse que PostgreSQL está corriendo
   # Crear la base de datos "sigues"
   createdb sigues
   ```

5. **Generar Prisma Client**
   ```bash
   npm run prisma:generate
   ```

6. **Ejecutar migraciones**
   ```bash
   npm run prisma:migrate
   ```

7. **Seedear la base de datos (opcional)**
   ```bash
   npm run prisma:seed
   ```

8. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## ⚙️ Configuración

### Variables de Entorno

Copiar `.env.example` a `.env` y configurar las siguientes variables:

```env
# Base de Datos
DATABASE_URL="postgresql://username:password@localhost:5432/sigues"

# JWT
JWT_SECRET="tu-secreto-super-seguro"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_SECRET="tu-secreto-de-refresh-super-seguro"
JWT_REFRESH_EXPIRES_IN="7d"

# Servidor
PORT=3001
NODE_ENV="development"
LOG_LEVEL="debug"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# Seguridad
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor en modo desarrollo
npm run build        # Compilar TypeScript
npm run start        # Iniciar servidor en producción

# Prisma
npm run prisma:generate   # Generar Prisma Client
npm run prisma:migrate    # Ejecutar migraciones
npm run prisma:studio     # Abrir Prisma Studio
npm run prisma:seed       # Seedear base de datos

# Testing
npm test            # Ejecutar tests
npm run test:watch  # Ejecutar tests en modo watch
npm run test:debug  # Ejecutar tests en modo debug

# Calidad de código
npm run lint        # Ejecutar ESLint
npm run lint:fix    # Arreglar automáticamente problemas de ESLint

# Docker
npm run docker:build # Construir imagen Docker
npm run docker:run   # Ejecutar contenedor Docker
```

## 🔌 API Endpoints

### Autenticación

- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/refresh` - Refrescar token
- `GET /auth/profile` - Obtener perfil de usuario
- `POST /auth/change-password` - Cambiar contraseña
- `POST /auth/validate` - Validar token

### Sistema

- `GET /health` - Health check
- `GET /version` - Información de versión
- `GET /api-docs` - Documentación Swagger (si está habilitada)

## 📚 Documentación

La documentación de la API está disponible automáticamente en:
- **Development**: http://localhost:3001/api-docs
- **Production**: Configurable vía `SWAGGER_PATH`

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           # Configuración de la aplicación
│   │   └── database.ts   # Configuración de Prisma
│   ├── controllers/      # Controladores de la API
│   │   ├── BaseController.ts
│   │   └── AuthController.ts
│   ├── interfaces/       # Definiciones TypeScript
│   │   ├── IController.ts
│   │   ├── IRepository.ts
│   │   └── IService.ts
│   ├── middleware/       # Middleware de Express
│   │   ├── auth.ts
│   │   ├── audit.ts
│   │   ├── error.ts
│   │   ├── rateLimit.ts
│   │   └── security.ts
│   ├── repositories/     # Repositorios de datos
│   │   ├── BaseRepository.ts
│   │   ├── AuthRepository.ts
│   │   ├── FichaSocialRepository.ts
│   │   └── EntrevistaRepository.ts
│   ├── routes/           # Definición de rutas
│   │   ├── index.ts
│   │   └── auth.routes.ts
│   ├── services/         # Lógica de negocio
│   │   ├── BaseService.ts
│   │   └── AuthService.ts
│   ├── utils/            # Utilidades
│   │   ├── errors.ts
│   │   ├── logger.ts
│   │   └── validation.ts
│   ├── server.ts         # Configuración del servidor
│   └── index.ts          # Punto de entrada
├── prisma/
│   ├── schema.prisma     # Esquema de base de datos
│   ├── migrations/       # Migraciones de base de datos
│   └── seed.ts           # Seed de datos iniciales
├── tests/                # Archivos de prueba
├── logs/                 # Archivos de log
└── dist/                 # Código compilado
```

## 🔒 Seguridad

### Características de Seguridad Implementadas

1. **Autenticación JWT con tokens de acceso y refresh**
2. **Hashing de contraseñas con bcrypt**
3. **Rate limiting por IP y endpoint**
4. **CORS configurado**
5. **Headers de seguridad con Helmet**
6. **Validación de inputs**
7. **Sanitización de datos**
8. **Auditoría de acciones**
9. **Detección de requests sospechosas**
10. **Protección contra XSS y SQL Injection**

### Mejores Prácticas

- Variables de entorno para datos sensibles
- Principio de mínimo privilegio
- Logs de auditoría
- Manejo seguro de errores
- Validación exhaustiva de inputs

## 🧪 Testing

El proyecto incluye configuración para testing con Jest:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 🚀 Despliegue

### Despliegue en Producción

1. **Construir el proyecto**
   ```bash
   npm run build
   ```

2. **Configurar variables de entorno de producción**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL="postgresql://..."
   export JWT_SECRET="..."
   # ... otras variables
   ```

3. **Ejecutar migraciones**
   ```bash
   npx prisma migrate deploy
   ```

4. **Iniciar el servidor**
   ```bash
   npm start
   ```

### Docker

```bash
# Construir imagen
npm run docker:build

# Ejecutar contenedor
npm run docker:run
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.