import type { Estado } from '../types';

export default function EstadoBadge({ estado }: { estado: Estado }) {
  const map: Record<Estado, string> = {
    en_espera: 'is-warning is-light',
    en_revision: 'is-info has-text-white',
    admitido: 'is-success has-text-white',
    no_admitido: 'is-danger has-text-white',
  };
  const label: Record<Estado, string> = {
    en_espera: 'En espera',
    en_revision: 'En revisión',
    admitido: 'Admitido',
    no_admitido: 'No admitido',
  };
  return <span className={`tag ${map[estado]}`}>{label[estado]}</span>;
}
