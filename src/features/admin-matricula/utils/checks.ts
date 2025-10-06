import type { Matricula } from '../store/slice';

export function documentosCompletos(m: Matricula | null | undefined) {
  if (!m) return false;
  const req: (keyof Matricula['documentos'])[] = [
    'copiaReg','certMedico','certEstudios','carnetVacunas','fotos3',
    'certEPS','certLaboral','retiroSimat','contratosPagare','pagoMatriculaYCupo'
  ];
  return req.every(k => !!m.documentos[k]);
}
