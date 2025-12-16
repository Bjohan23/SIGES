
-- 1. Agregar campos para datos del estudiante
ALTER TABLE public.fichas_sociales
ADD COLUMN IF NOT EXISTS apellido_paterno character varying(100),
ADD COLUMN IF NOT EXISTS apellido_materno character varying(100),
ADD COLUMN IF NOT EXISTS grado character varying(50),
ADD COLUMN IF NOT EXISTS seccion character varying(10),
ADD COLUMN IF NOT EXISTS edad integer;

-- 2. Agregar campo para composición familiar
ALTER TABLE public.fichas_sociales
ADD COLUMN IF NOT EXISTS composicion_familiar jsonb DEFAULT '{
  "padre": {
    "apellido_paterno": "",
    "apellido_materno": "",
    "nombres": "",
    "edad": null,
    "ocupacion": "",
    "centro_laboral": "",
    "celular": ""
  },
  "madre": {
    "apellido_paterno": "",
    "apellido_materno": "",
    "nombres": "",
    "edad": null,
    "ocupacion": "",
    "centro_laboral": "",
    "celular": ""
  }
}'::jsonb;

-- 3. Crear índices para nuevos campos
CREATE INDEX IF NOT EXISTS idx_fichas_apellido_paterno ON public.fichas_sociales USING btree (apellido_paterno);
CREATE INDEX IF NOT EXISTS idx_fichas_apellido_materno ON public.fichas_sociales USING btree (apellido_materno);
CREATE INDEX IF NOT EXISTS idx_fichas_grado ON public.fichas_sociales USING btree (grado);

-- 4. Actualizar índice de búsqueda para incluir apellidos separados
DROP INDEX IF EXISTS idx_fichas_busqueda;
CREATE INDEX idx_fichas_busqueda ON public.fichas_sociales USING gin (
  to_tsvector(
    'spanish'::regconfig,
    COALESCE(apellido_paterno, '') || ' ' ||
    COALESCE(apellido_materno, '') || ' ' ||
    COALESCE(nombres, '')
  )
);

-- 5. Migrar datos existentes (si apellidos ya existe, dividirlo)
-- Este script asume que apellidos contiene "apellido_paterno apellido_materno"
UPDATE public.fichas_sociales
SET
  apellido_paterno = SPLIT_PART(apellidos, ' ', 1),
  apellido_materno = CASE
    WHEN ARRAY_LENGTH(STRING_TO_ARRAY(apellidos, ' '), 1) > 1
    THEN SPLIT_PART(apellidos, ' ', 2)
    ELSE ''
  END
WHERE apellido_paterno IS NULL;

-- 6. Hacer apellido_paterno obligatorio (después de migrar)
ALTER TABLE public.fichas_sociales
ALTER COLUMN apellido_paterno SET NOT NULL;

-- 7. Agregar constraints para edad
ALTER TABLE public.fichas_sociales
ADD CONSTRAINT fichas_sociales_edad_check
CHECK (edad IS NULL OR (edad >= 0 AND edad <= 120));

-- NOTA: El campo "apellidos" se mantiene por compatibilidad
-- pero se recomienda usar apellido_paterno y apellido_materno
