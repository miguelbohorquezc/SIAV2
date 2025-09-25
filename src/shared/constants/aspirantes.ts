// [ANCLA:CONST_ASPIRANTES_V1]
/**
 * Constantes de dominio para Aspirantes
 * Anti-hardcode: centraliza nombres de colección, estados y flags.
 */
export const ASPIRANTES_COLLECTION = "applicants" as const;

export const ASPIRANTE_ESTADOS = {
  RECIBIDO: "recibido",
  // futuros: 'en_revision', 'admitido', 'rechazado'
} as const;

export const ASPIRANTE_FLAGS = {
  PUBLICO: true,
} as const;

export const ASPIRANTE_FUENTE = "web" as const;
