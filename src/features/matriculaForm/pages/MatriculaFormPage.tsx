import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFeatureFlagThunk, submitMatriculaThunk } from '../store/thunks';
import { reset, setStep, setError } from '../store/slice';
import {
  selectAnio,
  selectError,
  selectFlagEnabled,
  selectForm,
  selectStatus,
  selectStep,
  selectSubmissionResult,
} from '../store/selector';
import StepVerificacion from '../components/StepVerificacion';
import StepEstudiante from '../components/StepEstudiante';
import StepMadre from '../components/StepMadre';
import StepPadre from '../components/StepPadre';
import StepResponsable from '../components/StepResponsable';
import StepTerminos from '../components/StepTerminos';
import StepResumen from '../components/StepResumen';
import StepsNav from '../components/StepsNav';
import '@/features/MatriculaForm/styles/admisiones.light.css';
import logo from '@/assets/Logo-img.png';
import { LINKS } from '@/shared/constants/links';

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
  const [showErrors, setShowErrors] = useState(false);


  useEffect(() => {
    dispatch(loadFeatureFlagThunk());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Validaciones por paso (lógicas, no solo HTML)
  const canGoNext = useMemo(() => {
    switch (step) {
      case 1:
        // Paso 1 SOLO valida/verifica; navegación controlada por onVerified
        return false;
      case 2:
        return (
          !!form.estudiante?.gradoAspira &&
          !!form.estudiante?.nombres &&
          !!form.estudiante?.apellidos &&
          !!form.estudiante?.fechaNacimiento
        );
      case 3:
        return (
          !!form.madre?.nombres &&
          !!form.madre?.apellidos &&
          /^\d{4,}$/.test(form.madre?.numeroIdentificacion || '') &&
          /^\d{7,10}$/.test(form.madre?.telefono || '')
        );
      case 4:
        return (
          !!form.padre?.nombres &&
          !!form.padre?.apellidos &&
          /^\d{4,}$/.test(form.padre?.numeroIdentificacion || '') &&
          /^\d{7,10}$/.test(form.padre?.telefono || '')
        );
      case 5:
        return !!form.responsable?.quienAsumeCostos;
      case 6:
        return !!form.terms?.acepta;
      case 7:
        return true;
      default:
        return false;
    }
  }, [step, form]);

  if (enabled === false) {
    return (
      <section className="section has-text-black">
        <div className="container has-text-primary-invert">
          <h1 className="title">Formulario de matrícula cerrado</h1>
          <p className="subtitle">
            Actualmente no estamos recibiendo matrículas. Por favor, vuelva a intentarlo más adelante.
          </p>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="section">
        <div className="container">
          <figure className="image is-64x64">
            <img src={logo} alt="logo" className="m-2" />
          </figure>
          <h1 className="title has-text-black">Solicitud recibida</h1>
          <p className="subtitle has-text-black">
            Secretaría se comunicará con usted para continuar el proceso de matrícula.
          </p>
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
    await dispatch(submitMatriculaThunk());
  };

  // Navegación con feedback de errores
  const handleNext = () => {
  if (step === 1) return;

  if (!canGoNext) {
    setShowErrors(true);
    dispatch(setError(
      'Por favor complete todos los campos obligatorios del paso actual y corrija los campos marcados.'
    ));
    return;
  }

  setShowErrors(false);
  dispatch(setError(null));

  if (step === TOTAL) {
    void submit();
  } else {
    //@ts-ignore
    dispatch(setStep(step + 1));
  }
};

  const handlePrev = () => {
    dispatch(setError(null));
    dispatch(setStep(Math.max(1, (step as number) - 1) as any));
  };

  return (
    <section className="section users-scope">
      <div className="container ">
        <figure className="image is-64x64">
          <img src={logo} alt="logo" className="m-2" />
        </figure>
        <h1 className="title has-text-black">Matrícula {anio ?? ''}</h1>
        <p className="subtitle has-text-black">Complete los pasos del formulario</p>
        <article className="message is-danger mb-1">
          <div className="message-body has-text-black has-background-white">
            <i className="fa-solid fa-circle-info mr-1 has-text-danger"></i>
            Con el fin de avanzar en el proceso de matrícula, les solicitamos diligenciar con
            especial cuidado la matrícula del estudiante,{' '}
            <strong>verificando que la información ingresada sea correcta y completa. </strong>
            Una vez finalizado este paso, la Secretaría del colegio se comunicará con usted para
            finalizar los tramites de matrícula.
            <strong>
              {' '}
              Para iniciar el proceso verifique con el número de identidad del estudiante si se
              encuentra habilitado(a) para matricularse.
            </strong>
            <div className="buttons mt-2">
              <a
                href={LINKS.INSCRIPCION}
                target="_blank"
                rel="noopener noreferrer"
                className="button is-primary is-light"
              >
                <i className="fa-solid fa-file mr-2 has-text-white"></i>
                <p className="has-text-white">Ver instructivo y documentos</p>
              </a>
            </div>
          </div>
        </article>

        {error && (
          <div className="notification is-danger" role="alert">
            {error}
          </div>
        )}

        <div style={{ display: 'none' }}>
          <label>
            Si ves este campo, no lo llenes
            <input value={honeypot} onChange={e => setHoneypot(e.target.value)} />
          </label>
        </div>

        <div className="box">
          {step === 1 && <StepVerificacion onVerified={() => dispatch(setStep(2))} />}
          {step === 2 && <StepEstudiante />}
          {step === 3 && <StepMadre showErrors={showErrors}/>}
          {step === 4 && <StepPadre showErrors={showErrors}/>}
          {step === 5 && <StepResponsable />}
          {step === 6 && <StepTerminos />}
          {step === 7 && <StepResumen />}

          {/* Ocultar barra/progreso en verificación (paso 1) */}
          {step > 1 && (
            <StepsNav
              step={step}
              total={TOTAL}
              onPrev={handlePrev}
              onNext={handleNext}
              // solo bloqueamos por loading; la validación la maneja handleNext
              nextDisabled={status === 'loading'}
              isLast={step === TOTAL}
            />
          )}
        </div>

        {status === 'loading' && (
          <progress
            className="progress is-small is-primary has-background-white"
            max={100}
          />
        )}
      </div>
    </section>
  );
}
