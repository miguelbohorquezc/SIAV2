import type { FC } from 'react';

type Props = { step: number; total: number; onPrev: () => void; onNext: () => void; nextDisabled?: boolean; isLast?: boolean };

const StepsNav: FC<Props> = ({ step, total, onPrev, onNext, nextDisabled, isLast }) => (
  <div className="level mt-5">
    <div className="level-left">
      <button className="button" onClick={onPrev} disabled={step<=1}>Anterior</button>
    </div>
    <div className="level-item">
      <progress className="progress  is-primary" value={step} max={total} style={{minWidth: 240}} />
    </div>
    <div className="level-right">
      <button className={`button ${isLast ? 'is-primary' : 'is-primary has-text-white'}`} onClick={onNext} disabled={!!nextDisabled}>
        {isLast ? 'Enviar' : 'Siguiente'}
      </button>
    </div>
  </div>
);

export default StepsNav;
