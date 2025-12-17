"use client";

// app/fichas-sociales/[id]/editar/page.tsx
// Página para editar una Ficha Social existente - Formulario Multipestañas igual al de creación

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FichaSocialService } from "@/services/FichaSocialService";
import { fichaSocialAlerts } from "@/components/FichaSocialAlert";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import ErrorAlert from "@/components/ErrorAlert";
import type { FichaSocial } from "@/types";

// Importar componentes de pestañas personalizados para edición
import DatosEstudianteTab from "@/components/ficha-social-form/edit/DatosEstudianteTab";
import ComposicionFamiliarTab from "@/components/ficha-social-form/edit/ComposicionFamiliarTab";
import SituacionEconomicaTab from "@/components/ficha-social-form/edit/SituacionEconomicaTab";
import ViviendaSaludTab from "@/components/ficha-social-form/edit/ViviendaSaludTab";
import DeclaracionJuradaTab from "@/components/ficha-social-form/edit/DeclaracionJuradaTab";
import { FormContextWrapper } from "@/components/ficha-social-form/FormContextWrapper";

const STEPS = [
  { id: 0, name: "Datos del Estudiante", component: DatosEstudianteTab },
  { id: 1, name: "Composición Familiar", component: ComposicionFamiliarTab },
  { id: 2, name: "Situación Económica", component: SituacionEconomicaTab },
  { id: 3, name: "Vivienda y Salud", component: ViviendaSaludTab },
  { id: 4, name: "Declaración Jurada", component: DeclaracionJuradaTab },
];

// Estado del formulario para edición
interface FormState {
  apellido_paterno: string;
  apellido_materno: string;
  nombres: string;
  edad?: number;
  sexo: "M" | "F";
  fecha_nacimiento: string;
  nacionalidad: string;
  dni?: string;
  carne_extranjeria?: string;
  grado?: string;
  seccion?: string;
  nivel_educativo?: string;
  estado_civil: string;
  num_hijos: number;
  domicilio_actual: string;
  distrito: string;
  composicion_familiar: any;
  datos_economicos: any;
  datos_vivienda: any;
  datos_salud: any;
  declaracion_jurada: any;
}

// Función para mapear datos de la API al formato del formulario
function mapFichaToFormData(ficha: FichaSocial): FormState {
  return {
    apellido_paterno: ficha.apellido_paterno || '',
    apellido_materno: ficha.apellido_materno || '',
    nombres: ficha.nombres || '',
    edad: ficha.edad || undefined,
    sexo: ficha.sexo as "M" | "F" || "M",
    fecha_nacimiento: ficha.fecha_nacimiento ? new Date(ficha.fecha_nacimiento).toISOString().split('T')[0] : '',
    nacionalidad: ficha.nacionalidad || 'Peruana',
    dni: ficha.dni || '',
    carne_extranjeria: ficha.carne_extranjeria || '',
    grado: ficha.grado || '',
    seccion: ficha.seccion || '',
    nivel_educativo: ficha.nivel_educativo || '',
    estado_civil: ficha.estado_civil || 'SOLTERO',
    num_hijos: ficha.num_hijos || 0,
    domicilio_actual: ficha.domicilio_actual || '',
    distrito: ficha.distrito || '',
    composicion_familiar: ficha.composicion_familiar || {
      padre: {
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        edad: undefined,
        ocupacion: '',
        centro_laboral: '',
        celular: ''
      },
      madre: {
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        edad: undefined,
        ocupacion: '',
        centro_laboral: '',
        celular: ''
      }
    },
    datos_economicos: ficha.datos_economicos || {
      ingresos: {
        trabajador: 0,
        conyuge: 0,
        otros: 0
      },
      egresos: {
        servicios_basicos: {
          luz: 0,
          agua: 0,
          cable: 0,
          internet: 0,
          telefono: 0
        },
        gastos_familiares: {
          alimentacion: 0,
          educacion: 0,
          transporte: 0,
          vestimenta: 0,
          salud: 0
        },
        deudas_seguros: {
          seguros: 0,
          prestamos: 0
        }
      }
    },
    datos_vivienda: ficha.datos_vivienda || {
      tipo_vivienda: '',
      material: [],
      tenencia: [],
      servicios: [],
      ubicacion: [],
      problemas_sociales: []
    },
    datos_salud: ficha.datos_salud || {
      tipo_seguro: '',
      grupo_sanguineo: '',
      alergias: {
        tiene: false,
        especificar: ''
      },
      enfermedades: {
        tiene: false,
        especificar: ''
      },
      discapacidad: {
        tiene: false,
        tipo: '',
        grado: ''
      },
      medicamentos: []
    },
    declaracion_jurada: ficha.declaracion_jurada || {
      nombre_firmante: '',
      acepta_terminos: false,
      fecha_firma: '',
      firma_digital: ''
    }
  };
}

export default function EditarFichaSocialPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);
  const [fichaId, setFichaId] = useState<string>("");
  const [fichaOriginal, setFichaOriginal] = useState<FichaSocial | null>(null);

  // Estado local para el formulario (simulando el contexto)
  const [formData, setFormData] = useState<FormState>({
    apellido_paterno: '',
    apellido_materno: '',
    nombres: '',
    edad: undefined,
    sexo: 'M',
    fecha_nacimiento: '',
    nacionalidad: 'Peruana',
    dni: '',
    carne_extranjeria: '',
    grado: '',
    seccion: '',
    nivel_educativo: '',
    estado_civil: 'SOLTERO',
    num_hijos: 0,
    domicilio_actual: '',
    distrito: '',
    composicion_familiar: {
      padre: {
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        edad: undefined,
        ocupacion: '',
        centro_laboral: '',
        celular: ''
      },
      madre: {
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        edad: undefined,
        ocupacion: '',
        centro_laboral: '',
        celular: ''
      }
    },
    datos_economicos: {
      ingresos: {
        trabajador: 0,
        conyuge: 0,
        otros: 0
      },
      egresos: {
        servicios_basicos: {
          luz: 0,
          agua: 0,
          cable: 0,
          internet: 0,
          telefono: 0
        },
        gastos_familiares: {
          alimentacion: 0,
          educacion: 0,
          transporte: 0,
          vestimenta: 0,
          salud: 0
        },
        deudas_seguros: {
          seguros: 0,
          prestamos: 0
        }
      }
    },
    datos_vivienda: {
      tipo_vivienda: '',
      material: [],
      tenencia: [],
      servicios: [],
      ubicacion: [],
      problemas_sociales: []
    },
    datos_salud: {
      tipo_seguro: '',
      grupo_sanguineo: '',
      alergias: {
        tiene: false,
        especificar: ''
      },
      enfermedades: {
        tiene: false,
        especificar: ''
      },
      discapacidad: {
        tiene: false,
        tipo: '',
        grado: ''
      },
      medicamentos: []
    },
    declaracion_jurada: {
      nombre_firmante: '',
      acepta_terminos: false,
      fecha_firma: '',
      firma_digital: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(0);

  // Cargar datos iniciales de la ficha
  useEffect(() => {
    const loadFicha = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        setInitialLoading(true);
        const ficha = await FichaSocialService.getFichaById(id);
        setFichaOriginal(ficha);
        setFichaId(id);

        // Cargar datos en el formulario
        const mappedData = mapFichaToFormData(ficha);
        setFormData(mappedData);
      } catch (err: any) {
        console.error("Error al cargar ficha:", err);
        setError(err.message || "Error al cargar la ficha social");
      } finally {
        setInitialLoading(false);
      }
    };

    loadFicha();
  }, [params?.id]);

  // Simular funciones del contexto
  const updateFormData = (newData: Partial<FormState>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const getProgress = () => {
    // Calcular progreso basado en los campos llenos
    let completedFields = 0;
    let totalFields = 32;

    // Validación simple del progreso
    if (formData.apellido_paterno) completedFields++;
    if (formData.apellido_materno) completedFields++;
    if (formData.nombres) completedFields++;
    if (formData.sexo) completedFields++;
    if (formData.fecha_nacimiento) completedFields++;
    if (formData.nacionalidad) completedFields++;
    if (formData.dni || formData.carne_extranjeria) completedFields++;
    if (formData.grado) completedFields++;
    if (formData.seccion) completedFields++;
    if (formData.domicilio_actual) completedFields++;
    if (formData.distrito) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const validateStep = (step: number) => {
    // Validación básica por paso
    switch (step) {
      case 0: // Datos del estudiante
        return formData.nombres &&
               (formData.apellido_paterno || formData.apellido_materno) &&
               formData.sexo &&
               formData.fecha_nacimiento &&
               formData.nacionalidad &&
               (formData.dni || formData.carne_extranjeria) &&
               formData.domicilio_actual &&
               formData.distrito;
      case 1: // Composición familiar
        return true; // Simplificado
      case 2: // Situación económica
        return true; // Simplificado
      case 3: // Vivienda y salud
        return true; // Simplificado
      case 4: // Declaración jurada
        return formData.declaracion_jurada?.nombre_firmante &&
               formData.declaracion_jurada?.acepta_terminos;
      default:
        return false;
    }
  };

  const canProceed = () => {
    return getProgress() >= 100;
  };

  const progress = getProgress();
  const CurrentTabComponent = STEPS[currentStep].component;

  const handleNext = () => {
    setShowValidationError(false);

    if (!validateStep(currentStep)) {
      setShowValidationError(true);
      setError("Por favor complete todos los campos obligatorios antes de continuar");
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setError("");
    }
  };

  const handlePrevious = () => {
    setShowValidationError(false);
    setError("");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setShowValidationError(false);
    setError("");

    if (!validateStep(currentStep)) {
      setShowValidationError(true);
      setError("Por favor complete todos los campos obligatorios");
      return;
    }

    if (!fichaId || !user) {
      setError("ID de ficha o usuario no disponible");
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para enviar
      const fichaData = {
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        nombres: formData.nombres,
        edad: formData.edad ?? undefined,
        sexo: formData.sexo as "M" | "F",
        fecha_nacimiento: formData.fecha_nacimiento,
        nacionalidad: formData.nacionalidad,
        dni: formData.dni || undefined,
        carne_extranjeria: formData.carne_extranjeria || undefined,
        grado: formData.grado,
        seccion: formData.seccion,
        nivel_educativo: formData.nivel_educativo || undefined,
        estado_civil: formData.estado_civil?.toUpperCase() as any,
        num_hijos: formData.num_hijos,
        domicilio_actual: formData.domicilio_actual,
        distrito: formData.distrito,
        composicion_familiar: formData.composicion_familiar,
        datos_economicos: formData.datos_economicos,
        datos_vivienda: formData.datos_vivienda,
        datos_salud: formData.datos_salud,
        declaracion_jurada: formData.declaracion_jurada,
      };

      const updatedFicha = await FichaSocialService.updateFicha(fichaId, fichaData, user.id);

      // Show success alert
      fichaSocialAlerts.success(
        updatedFicha,
        "Ficha social actualizada exitosamente",
        "La ficha social ha sido modificada correctamente en el sistema"
      );

      router.push(`/fichas-sociales/${fichaId}`);
    } catch (err: any) {
      console.error("Error al guardar:", err);
      setError(err.message || "Error al actualizar la ficha social");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !fichaOriginal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <Button onClick={() => router.push('/fichas-sociales')}>
            Volver al listado
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Editar Ficha Social
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {fichaOriginal?.nombres} {fichaOriginal?.apellidos || `${fichaOriginal?.apellido_paterno} ${fichaOriginal?.apellido_materno}`}.
            Modifique los datos necesarios. Progreso: {progress}%
          </p>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progreso del Formulario
            </span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Navegación de Pestañas */}
        <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-sm border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-2 px-4 overflow-x-auto">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    // Permitir navegar a pestañas anteriores sin validación
                    if (step.id < currentStep) {
                      setCurrentStep(step.id);
                      setError("");
                      setShowValidationError(false);
                    }
                  }}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                    ${
                      isActive
                        ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                        : isCompleted
                        ? "border-green-500 dark:border-green-400 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }
                    ${
                      step.id < currentStep
                        ? "cursor-pointer"
                        : step.id === currentStep
                        ? "cursor-default"
                        : "cursor-not-allowed"
                    }
                  `}
                  disabled={step.id > currentStep}
                >
                  <span
                    className={`
                    mr-2 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors
                    ${
                      isActive
                        ? "bg-blue-600 dark:bg-blue-500 text-white"
                        : isCompleted
                        ? "bg-green-500 dark:bg-green-600 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    }
                  `}
                  >
                    {isCompleted ? "✓" : step.id + 1}
                  </span>
                  {step.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenido de la Pestaña Actual */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-lg dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
          {error && showValidationError && (
            <div className="mb-6">
              <ErrorAlert message={error} />
            </div>
          )}

          {/* Pasar el formData usando el wrapper del contexto */}
          <FormContextWrapper formData={formData} onChange={updateFormData}>
            <CurrentTabComponent />
          </FormContextWrapper>
        </div>

        {/* Botones de Navegación */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 border border-transparent dark:border-gray-700">
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => router.push(`/fichas-sociales/${fichaId}`)}
              >
                Cancelar
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  Siguiente
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={loading || !canProceed()}
                  className={!canProceed() ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {loading
                    ? "Guardando..."
                    : canProceed()
                    ? "Guardar Cambios"
                    : `Completar Formulario (${progress}%)`}
                </Button>
              )}
            </div>
          </div>

          {/* Mensaje informativo si no está completo */}
          {currentStep === STEPS.length - 1 && !canProceed() && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                El formulario está al {progress}% completo. Por favor complete todos los campos
                obligatorios en todas las secciones antes de guardar.
              </p>
            </div>
          )}

          {/* Información de última actualización */}
          {fichaOriginal && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-md">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Última actualización:</strong> {new Date(fichaOriginal.updated_at).toLocaleString('es-PE')} por {fichaOriginal.actualizador?.nombres} {fichaOriginal.actualizador?.apellidos}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}