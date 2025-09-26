import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFeatureFlagThunk, submitMatriculaThunk } from '../store/thunks';
import { reset, setStep } from '../store/slice';
import { selectAnio, selectError, selectFlagEnabled, selectForm, selectStatus, selectStep, selectSubmissionResult } from '../store/selector';
import StepVerificacion from '../components/StepVerificacion';
import StepEstudiante from '../components/StepEstudiante';
import StepMadre from '../components/StepMadre';
import StepPadre from '../components/StepPadre';
import StepResponsable from '../components/StepResponsable';
import StepTerminos from '../components/StepTerminos';
import StepResumen from '../components/StepResumen';
import StepsNav from '../components/StepsNav';
import '@/features/MatriculaForm/styles/admisiones.light.css'
import logo from '@/assets/logo.svg';

const TOTAL = 7;

export default function MatriculaFormPage() {
  const dispatch = useDispatch<any>();
  const enabled = useSelector(selectFlagEnabled);
  const step = useSelector(selectStep);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const submitted = useSelector(selectSubmissionResult);
  const form = useSelector(selectForm);
  const anio = useSelector(selectAnio);
  const [honeypot, setHoneypot] = useState<string>('');

  useEffect(() => { (dispatch as any)(loadFeatureFlagThunk()); return () => { (dispatch as any)(reset()); }; }, [dispatch]);

  const canGoNext = useMemo(() => {
    switch (step) {
      case 1: return false; // Paso 1 SOLO valida/verifica; navegación controlada por onVerified
      case 2: return !!form.estudiante?.gradoAspira && !!form.estudiante?.nombres && !!form.estudiante?.apellidos && !!form.estudiante?.fechaNacimiento;
      case 3: return !!form.madre?.nombres && !!form.madre?.apellidos && /^\d{4,}$/.test(form.madre?.numeroIdentificacion || '') && /^\d{7,10}$/.test(form.madre?.telefono || '');
      case 4: return !!form.padre?.nombres && !!form.padre?.apellidos && /^\d{4,}$/.test(form.padre?.numeroIdentificacion || '') && /^\d{7,10}$/.test(form.padre?.telefono || '');
      case 5: return !!form.responsable?.quienAsumeCostos;
      case 6: return !!form.terms?.acepta;
      case 7: return true;
      default: return false;
    }
  }, [step, form]);

  if (enabled === false) {
    return (
      <section className="section has-text-black">
        <div className="container has-text-primary-invert">
          <h1 className="title">Formulario de matrícula cerrado</h1>
          <p className="subtitle">Actualmente no estamos recibiendo matrículas. Por favor, vuelva a intentarlo más adelante.</p>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Solicitud recibida</h1>
          <p className="subtitle">Secretaría se comunicará con usted.</p>
          <div className="notification is-primary">
            Radicado: <strong>{submitted}</strong>
          </div>
          <p>Guarde este código para seguimiento.</p>
        </div>
      </section>
    );
  }

  const submit = async () => {
    if (honeypot) return;
    await (dispatch as any)(submitMatriculaThunk());
  };

  return (
    <section className="section users-scope">
      <div className="container ">
        <div>
          <img src={logo} alt="logo" className='m-2' />
        </div>
        <h1 className="title has-text-black">Matrícula {anio ?? ''}</h1>
        <p className="subtitle has-text-black">Complete los pasos del formulario</p>

        {error && <div className="notification is-danger" role="alert">{error}</div>}

        <div style={{display:'none'}}>
          <label>Si ves este campo, no lo llenes<input value={honeypot} onChange={e=>setHoneypot(e.target.value)} /></label>
        </div>

        <div className="box">
          {step === 1 && <StepVerificacion onVerified={() => (dispatch as any)(setStep(2))} />}
          {step === 2 && <StepEstudiante />}
          {step === 3 && <StepMadre />}
          {step === 4 && <StepPadre />}
          {step === 5 && <StepResponsable />}
          {step === 6 && <StepTerminos />}
          {step === 7 && <StepResumen />}

          {/* Ocultar barra/progreso en verificación (paso 1) */}
          {step > 1 && (
            <StepsNav
              step={step}
              total={TOTAL}
              onPrev={() => (dispatch as any)(setStep((Math.max(1, (step as number) - 1)) as any))}
              onNext={() => (step === TOTAL ? submit() : (dispatch as any)(setStep((Math.min(TOTAL, (step as number) + 1)) as any)))}
              nextDisabled={!canGoNext || status==='loading'}
              isLast={step===TOTAL}
            />
          )}
        </div>

        {status==='loading' && <progress className="progress is-small is-primary has-background-light" max={100} />}
      </div>
    </section>
  );
}
