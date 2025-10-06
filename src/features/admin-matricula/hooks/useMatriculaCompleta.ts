import { useMemo } from 'react';
import type { Matricula } from '../store/slice';
import { documentosCompletos } from '../utils/checks';

export default function useMatriculaCompleta(m: Matricula | null | undefined) {
  return useMemo(() => documentosCompletos(m), [m]);
}
