// [ANCLA:TYPES_ASPIRANTES_V1]
/**
 * Tipos de dominio para Aspirantes (público web).
 * Mantienen 1:1 los ids/keys que usa la UI y el hook.
 */

export type AspirantePadreOMadre = {
  nombresApellidos: string;
  numeroIdentificacion: string;
  telefono: string;
  direccion: string;
  barrio: string;
  email: string;
  empresa: string;
  profesion: string;
};

export type AspiranteRecomendador = {
  nombresApellidos: string;
  telefono: string;
  parentesco: string;
};

/**
 * Estructura principal del formulario.
 * Nota: este mismo shape se persiste en Firestore (más metacampos).
 */
export type AspiranteDTO = {
  // Paso 1
  nIdentificacion:string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string; // ISO yyyy-mm-dd
  lugarNacimiento: string;
  sexo: "M" | "F";
  edadAnios: string;
  edadMeses: string;
  direccionResidencia: string;
  barrioAspirante: string;
  telefonoCasa: string;
  religion: string;
  colegioProcedencia: string;
  ultimoGrado: string;

  // Paso 2 y 3
  padre: AspirantePadreOMadre;
  madre: AspirantePadreOMadre;

  // Paso 4
  recomendador: AspiranteRecomendador;
  familiaresEnColegio: string;

  // Paso 5
  aceptaTerminos: boolean;
};

/**
 * Alias de dominio para la UI (Resumen).
 * Es equivalente al DTO; lo dejamos explícito para posibles extensiones futuras.
 */
export type Aspirante = AspiranteDTO;
