import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express';

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'fichas-sociales');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error, uploadPath);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `ficha-${uniqueSuffix}${ext}`);
  }
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

export const uploadImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por archivo
    files: 10 // máximo 10 archivos
  }
});

// Middleware para guardar imágenes temporalmente
export const handleImageUpload = uploadImages.array('images', 10);

// Middleware para hacer rollback de imágenes si hay error
export const rollbackImages = (uploadedImages: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Guardar referencia a las imágenes subidas
    req.uploadedImages = uploadedImages || [];

    // Interceptador de errores para rollback
    const originalJson = res.json;
    res.json = function(data) {
      // Si hay error, hacer rollback
      if (!data.success && req.uploadedImages && req.uploadedImages.length > 0) {
        Promise.all(
          req.uploadedImages.map(async (filePath: string) => {
            try {
              await fs.unlink(filePath);
              console.log(`Rolled back: ${filePath}`);
            } catch (error) {
              console.error(`Failed to rollback ${filePath}:`, error);
            }
          })
        ).catch(console.error);
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

// Middleware para procesar rutas de imágenes en el body
export const processImagePaths = (req: Request, res: Response, next: NextFunction) => {
  if (req.files && Array.isArray(req.files)) {
    const uploadedImages = (req.files as Express.Multer.File[]).map(file => file.path);

    // Agregar rutas de imágenes al body
    if (req.body.foto_estudiante) {
      req.body.foto_estudiante = uploadedImages.find(img =>
        img.includes('estudiante') || img.includes('profile')
      ) || null;
    }

    if (req.body.fotos_domicilio) {
      if (!req.body.fotos_domicilio) req.body.fotos_domicilio = [];
      req.body.fotos_domicilio = uploadedImages.filter(img =>
        img.includes('domicilio') || img.includes('home')
      );
    }

    if (req.body.fotos_vivienda) {
      if (!req.body.fotos_vivienda) req.body.fotos_vivienda = [];
      req.body.fotos_vivienda = uploadedImages.filter(img =>
        img.includes('vivienda') || img.includes('house')
      );
    }

    // Guardar referencia para rollback
    req.uploadedImages = uploadedImages;
  }

  next();
};

// Función para servir imágenes estáticas
export const serveImage = async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(process.cwd(), 'uploads', 'fichas-sociales', filename);

    // Verificar que el archivo exista
    await fs.access(imagePath);

    // Enviar el archivo
    res.sendFile(imagePath);
  } catch (error) {
    res.status(404).json({
      success: false,
      error: { message: 'Image not found', statusCode: 404 }
    });
  }
};