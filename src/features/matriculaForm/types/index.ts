export type TipoId = 'RC'|'TI'|'PA';

export type Verificacion = { tipoId: TipoId; numeroId: string };

export type PersonaBasica = {
  nombres: string;
  apellidos: string;
  numeroIdentificacion?: string;
  email?: string;
  telefono?: string;
  empresa?: string;
  cargo?: string;
  direccion?: string;
  ciudad?: string;
  fechaNacimiento?: string; // YYYY-MM-DD
};

export type Estudiante = {
  gradoAspira: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string; // YYYY-MM-DD
  sexo?: string;
  religion?: string;
  edadAnios?: string;
  edadMeses?: string;
  direccion?: string;
  barrio?: string;
  ciudad?: string;
  telefono?: string;
  colegioAnterior?: string;
  ultimoGrado?: string;
  lugarNacimiento?: string;
};

export type Responsable = {
  quienAsumeCostos: string;
  seComprometePrimeros10Dias: boolean;
};

export type Terms = { acepta: boolean; version?: number };

export type FeatureFlag = {
  enabled: boolean;
  anio: number;
  termsVersion: number;
  ventana?: { start?: any; end?: any } | null;
};

export type MatriculaDoc = {
  __schemaVersion: number;
  anio: number;
  estado: 'borrador'|'en_revision'|'pendiente_documentos'|'confirmada'|'rechazada';
  verificacion: Verificacion;
  estudiante: Estudiante;
  madre: Required<Pick<PersonaBasica,'nombres'|'apellidos'|'numeroIdentificacion'|'telefono' | 'ciudad'>> & Partial<PersonaBasica>;
  padre: Required<Pick<PersonaBasica,'nombres'|'apellidos'|'numeroIdentificacion'|'telefono' | 'ciudad'>> & Partial<PersonaBasica>;
  responsable: Responsable;
  terms: Required<Terms>;
  publico: true;
  createdAt: any;
  updatedAt: any;
  updatedByRole: 'PUBLICO'|'SECRETARIA';
  fuente: 'web';
};
