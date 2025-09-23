import type { Estado } from '../types';

export default function EstadoBadge({ estado }: { estado: Estado }) {
  const map: Record<Estado, string> = {
    en_espera: 'is-warning is-light',
    en_revision: 'is-info',
    admitido: 'is-success',
    no_admitido: 'is-danger',
  };
  const label: Record<Estado, string> = {
    en_espera: 'En espera',
    en_revision: 'En revisión',
    admitido: 'Admitido',
    no_admitido: 'No admitido',
  };
  return <span className={`tag ${map[estado]}`}>{label[estado]}</span>;
}
