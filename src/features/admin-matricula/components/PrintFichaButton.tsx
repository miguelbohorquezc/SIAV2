import Ficha from '../printing/ficha.template';
import type { Matricula } from '../store/slice';
import { createRoot } from 'react-dom/client';

export default function PrintFichaButton({ data }: { data: Matricula }) {
  const onPrint = () => {
    const w = window.open('', '_blank', 'width=800,height=1000');
    if (!w) return;
    w.document.write('<!DOCTYPE html><html><head><title>Ficha</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"></head><body class="section"></body></html>');
    const root = createRoot(w.document.body as any);
    root.render(<Ficha data={data} />);
    setTimeout(() => w.print(), 300);
  };
  return (
    <button className="button is-link is-light" onClick={onPrint} aria-label="Imprimir ficha">
      Imprimir ficha
    </button>
  );
}
