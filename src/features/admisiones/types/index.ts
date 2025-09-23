export type Estado = 'en_espera' | 'en_revision' | 'admitido' | 'no_admitido';

export interface ParentInfo {
  nombresApellidos: string;
  numeroIdentificacion: string;
  profesion: string;
  empresa: string;
  direccion: string;
  barrio: string;
  telefono: string;
  email: string;
}

export interface Recomendador {
  nombresApellidos: string;
  parentesco: string;
  telefono: string;
}

export interface Applicant {
  id: string;
  __schemaVersion: number;
  __source: string;
  aceptaTerminos: boolean;
  apellidos: string;
  barrioAspirante: string;
  colegioProcedencia: string;
  createdAt: number; // epoch ms
  direccionResidencia: string;
  edadAnios: string;
  edadMeses: string;
  estado: Estado;
  familiaresEnColegio: string;
  fechaNacimiento: string; // YYYY-MM-DD
  fuente: string;
  lugarNacimiento: string;
  madre: ParentInfo;
  nombresApellidos: string;
  numeroIdentificacion: string;
  nombres: string;
  padre: ParentInfo;
  publico: boolean;
  recomendador: Recomendador;
  religion: string;
  sexo: string;
  telefonoCasa: string;
  telefono: string;
  ultimoGrado: string;
  updatedAt: number;
  tags: string[];
  motivoNoAdmision: string | null;
  autorizadoMatricula: boolean;
  autorizadoBy: string | null;
  autorizadoAt: number | null;
}
