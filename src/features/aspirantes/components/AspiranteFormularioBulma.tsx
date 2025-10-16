// [ANCLA:NUEVO_COMPONENTE_ASPIRANTES_BULMA]
import React from "react";
import { useAspiranteFormulario } from "../hooks/useAspiranteFormulario";
import type { Aspirante } from "../types/aspirantes";
import '@/features/aspirantes/styles/aspirantes.light.css'

type Props = { isEnabled?: boolean; onGuardado?: (id: string) => void };

export default function AspiranteFormularioBulma({ isEnabled = true, onGuardado }: Props) {
  const {
    formulario,
    actualizarCampo,
    errores,
    enviando,
    enviar,
    paso,
    siguiente,
    anterior,
    setPaso,
    reiniciarParaHermano,
  } = useAspiranteFormulario();

  const [resumen, setResumen] = React.useState<{ id: string; datos: Aspirante } | null>(null);
  const [enviado, setEnviado] = React.useState(false);
  const [folio, setFolio] = React.useState<string | null>(null);
  const progreso = React.useMemo(() => ((paso - 1) / 4) * 100, [paso]);

  async function handleEnviar() {
    const res = await enviar();
    if (!res.ok) {
      if (res.step) setPaso(res.step);
      setTimeout(() => {
        if (res.firstError) {
          const el = document.getElementById(res.firstError);
          if (el && typeof (el as any).focus === "function") (el as any).focus();
          if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 0);
      return;
    }
    setResumen({ id: res.id, datos: { ...formulario } });
    setFolio(res.id);
    setEnviado(true);
    onGuardado?.(res.id);
  }

  let content: React.ReactNode;

  if (!isEnabled) {
    content = (
      <section className="notification is-warning is-light" aria-live="polite">
        <p className="title is-5">Formulario temporalmente inactivo</p>
        <p>El registro de aspirantes se abrirá pronto. Te informaremos cuando el formulario esté activo.</p>
        <p className="is-size-7 mt-2">Para más información contacta a la secretaría académica.</p>
      </section>
    );
  } else if (enviado) {
    content = (
      <section className="box has-background-success-light" role="status" aria-live="polite">
        <div className="has-text-centered mb-3" aria-hidden="true">
          <span className="icon is-large has-text-success">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="#ecfdf5"></circle>
              <path d="M8 12.5l2.5 2.5L16 9" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        <h2 className="title is-4 has-text-dark has-text-centered mb-2">¡Solicitud enviada!</h2>
        <p className="has-text-grey-dark has-text-centered mt-2">
          Hemos recibido la información de inscripción.
          <br />Secretaría académica se comunicará contigo con los pasos a seguir.
        </p>
        {folio && <p className="has-text-grey-dark has-text-centered mt-3"><b>Número de radicado:</b> {folio}</p>}

        <div className="mt-4 has-text-centered">
          <button
            className="button is-primary is-rounded"
            type="button"
            onClick={() => {
              setEnviado(false);
              setFolio(null);
              reiniciarParaHermano();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Registrar un hermano
          </button>
        </div>
      </section>
    );
  } else {
    content = (
      <>
        {/* Stepper simple + progreso */}
        <nav aria-label="Progreso" className="mb-3" role="navigation">
          <div className="is-flex is-align-items-center is-justify-content-center is-gap-2">
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <span
                  className={`tag is-medium is-rounded ${paso === i ? "is-info has-text-white" : "is-light"}`}
                  aria-current={paso === i ? "step" : "false"}
                >
                  {i}
                </span>
                {i < 4 && (
                  <span
                    className={`mx-2 is-hidden-touch ${paso > i ? "has-background-info" : "has-background-grey-lighter"}`}
                    style={{ height: 2, width: 48, display: "inline-block" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>
        <progress className="progress is-info is-small mb-5" value={progreso} max={100} aria-hidden="true" />

        {/* PASO 1 */}
        {paso === 1 && (
          <fieldset className="box p-5 has-background-white" aria-labelledby="t1">
          
            <div className="columns is-multiline">
              <div className="column is-full">
                <legend id="t1" className="title is-5">Datos de identificación del aspirante</legend>
              </div>
              <div className="column is-one-third"><Select id="TIdentificacion" label="Tipo de identificación" value={formulario.TIdentificacion} onChange={actualizarCampo} error={errores["TIdentificacion"]} options={[{ v: "RC", t: "RC" }, { v: "TI", t: "TI" }, { v: "CE", t: "CE" }, { v: "CC", t: "CC" }, { v: "PA", t: "PA" }]} /></div>
              <div className="column is-one-third"><Campo id="nIdentificacion" placeholder="Número de identificación" label="Número de identificación" value={formulario.nIdentificacion} onChange={actualizarCampo} type="number" error={errores["nIdentificacion"]}/></div>
              <div className="column is-one-third"><Select id="gradoAspira" label="Grado al que aspira" value={formulario.gradoAspira} onChange={actualizarCampo} error={errores["gradoAspira"]} options={[{ v: "Walkers", t: "Walkers" }, { v: "Nursery", t: "Nursery" }, { v: "Prekinder", t: "Prekinder" }, { v: "Kinder", t: "Kinder" }, { v: "Transition", t: "Transition" }, { v: "Primero", t: "Primero" }
                , { v: "Segundo", t: "Segundo" }, { v: "Tercero", t: "Tercero" }, { v: "Cuarto", t: "Cuarto" }, { v: "Quinto", t: "Quinto" }, { v: "Sexto", t: "Sexto" }, { v: "Septimo", t: "Septimo" }, { v: "Octavo", t: "Octavo" }, { v: "Noveno", t: "Noveno" }, { v: "Decimo", t: "Decimo" }, { v: "Once", t: "Once" }
              ]} /></div>
              <div className="column is-half"><Campo id="nombres" placeholder="Nombres completos" label="Nombres" value={formulario.nombres} onChange={actualizarCampo} error={errores["nombres"]}/></div>
              <div className="column is-half"><Campo id="apellidos" placeholder="Apellidos completos" label="Apellidos" value={formulario.apellidos} onChange={actualizarCampo} error={errores["apellidos"]}/></div>
              <div className="column is-half"><Campo id="fechaNacimiento" type="date" label="Fecha de nacimiento" value={formulario.fechaNacimiento} onChange={actualizarCampo} error={errores["fechaNacimiento"]}/></div>
              <div className="column is-half"><Campo id="lugarNacimiento" placeholder="Ciudad - País" label="Lugar de nacimiento" value={formulario.lugarNacimiento} onChange={actualizarCampo} error={errores["lugarNacimiento"]}/></div>
              <div className="column is-one-third"><Select id="sexo" label="Sexo" value={formulario.sexo} onChange={actualizarCampo} error={errores["sexo"]} options={[{ v: "M", t: "Masculino" }, { v: "F", t: "Femenino" }]} /></div>
              <div className="column is-one-third"><Campo id="edadAnios" placeholder="Número" type="number" label="Edad actual en (años)" value={formulario.edadAnios} onChange={actualizarCampo} error={errores["edadAnios"]}/></div>
              <div className="column is-one-third"><Campo id="edadMeses" placeholder="Número" type="number" label="y (meses)" value={formulario.edadMeses} onChange={actualizarCampo} error={errores["edadMeses"]}/></div>
              <div className="column is-full"><Campo id="direccionResidencia" placeholder="Dirección" label="Dirección de residencia" value={formulario.direccionResidencia} onChange={actualizarCampo} error={errores["direccionResidencia"]}/></div>
              <div className="column is-half"><Campo id="barrioAspirante" label="Barrio" placeholder="Barrio" value={formulario.barrioAspirante} onChange={actualizarCampo} error={errores["barrioAspirante"]}/></div>
              <div className="column is-half"><Campo id="telefonoCasa" placeholder="Número" label="Teléfono / Celular" value={formulario.telefonoCasa} onChange={actualizarCampo} error={errores["telefonoCasa"]} help="Incluye indicativo si aplica."/></div>
              <div className="column is-half"><Campo id="religion" placeholder="Creencia religiosa familiar" label="Religión" value={formulario.religion} onChange={actualizarCampo} error={errores["religion"]}/></div>
              <div className="column is-half"><Campo id="colegioProcedencia" label="Colegio de procedencia" placeholder="Dejar en blanco si no aplica" value={formulario.colegioProcedencia.toUpperCase()} onChange={actualizarCampo} error={errores["colegioProcedencia"]}/></div>
              <div className="column is-half"><Campo id="ultimoGrado" label="Último grado cursado" placeholder="Dejar en blanco si no aplica" value={formulario.ultimoGrado.toUpperCase()} onChange={actualizarCampo} error={errores["ultimoGrado"]}/></div>
            </div>

            <div className="is-flex is-justify-content-flex-end mt-2">
              <button className="button is-primary has-text-white" type="button" onClick={() => siguiente() && window.scrollTo({ top: 0, behavior: "smooth" })}>Siguiente</button>
            </div>
          </fieldset>
        )}

        {/* PASO 2 */}
        {paso === 2 && (
          <DatosPadreOMadre
            titulo="Datos del Padre" base="padre" valores={formulario.padre}
            errores={errores} onChange={actualizarCampo}
            onPrev={() => anterior()} onNext={() => siguiente() && window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        )}

        {/* PASO 3 */}
        {paso === 3 && (
          <DatosPadreOMadre
            titulo="Datos de la Madre" base="madre" valores={formulario.madre}
            errores={errores} onChange={actualizarCampo}
            onPrev={() => anterior()} onNext={() => siguiente() && window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        )}

        {/* PASO 4 */}
        {paso === 4 && (
          <fieldset className="box p-5 has-background-white" aria-labelledby="t4">
            <div className="columns is-multiline">
            <div className="column is-full">
              <legend id="t4" className="title is-5">Persona que recomendó el centro educativo</legend>    
            </div>
              <div className="column is-one-third"><Campo id="recomendador.nombresApellidos" placeholder="Nombres y apellido (opcional)" label="Nombres y apellidos" value={formulario.recomendador.nombresApellidos} onChange={actualizarCampo} error={errores["recomendador.nombresApellidos"]}/></div>
              <div className="column is-one-third"><Campo id="recomendador.telefono" placeholder="Teléfono (opcional)" label="Teléfono / celular" value={formulario.recomendador.telefono} onChange={actualizarCampo} error={errores["recomendador.telefono"]}/></div>
              <div className="column is-one-third"><Campo id="recomendador.parentesco" placeholder="Parentesco (opcional)" label="Parentesco" value={formulario.recomendador.parentesco} onChange={actualizarCampo} error={errores["recomendador.parentesco"]}/></div>
            </div>

            <fieldset className="box p-5 has-background-white mt-3">
              <legend className="has-text-weight-normal has-text-black"> Especificar </legend>
              <Campo id="familiaresEnColegio" placeholder="Nombres Apellido - Parentesco" label="¿Tiene familiares en el colegio? (nombres y parentesco) (opcional)" value={formulario.familiaresEnColegio} onChange={actualizarCampo} error={errores["familiaresEnColegio"]}/>
            </fieldset>

            <div className="is-flex is-justify-content-space-between mt-2">
              <button className="button is-light is-rounded" type="button" onClick={() => anterior()}>Atrás</button>
              <button className="button is-primary has-text-white" type="button" onClick={() => { setPaso(5); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Revisar y enviar</button>
            </div>
          </fieldset>
        )}

        {/* PASO 5 */}
        {paso === 5 && (
          <fieldset className="box p-5 has-background-white" id="resumen-inscripcion">
            <legend className="title is-5">Resumen de la inscripción</legend>
            <p className="notification is-info is-light">Verifica que los datos estén correctos. Puedes imprimir con <kbd>Ctrl</kbd>+<kbd>P</kbd>.</p>

            <div className="content box is-shadowless has-background-light p-4 mt-3">
              <Resumen datos={resumen?.datos ?? formulario} />
            </div>

            <div className="mt-4">
              <label className="label" htmlFor="aceptaTerminos">Términos y condiciones</label>
              <div className="is-flex is-align-items-center" style={{ gap: ".5rem" }}>
                <input
                  id="aceptaTerminos" type="checkbox"
                  checked={formulario.aceptaTerminos}
                  onChange={(e) => actualizarCampo("aceptaTerminos", e.target.checked as unknown as string)}
                  className="checkbox"
                  aria-invalid={!!errores["aceptaTerminos"]}
                  aria-describedby={errores["aceptaTerminos"] ? "aceptaTerminos-err" : undefined}
                />
                <span>
                  He leído y acepto los{" "}
                  <a href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="has-text-link">
                    Términos y condiciones
                  </a>.
                </span>
              </div>
              {errores["aceptaTerminos"] && <p id="aceptaTerminos-err" className="help is-danger">{errores["aceptaTerminos"]}</p>}
            </div>

            <div className="buttons mt-5 is-right">
              <button className="button is-light " type="button" onClick={() => setPaso(1)}>Editar</button>
              <button className="button is-light " type="button" onClick={() => window.print()}>Imprimir</button>
              <button className={`button is-primary  ${enviando ? "is-loading" : ""}`} type="button" disabled={enviando} onClick={handleEnviar}>
                {enviando ? "Enviando…" : "Confirmar y enviar"}
              </button>
            </div>
          </fieldset>
        )}
      </>
    );
  }

  return (
    <div className="m-5">
      <div className="container is-max-desktop">{content}</div>
    </div>
  );
}

/* ---------- Subcomponentes ---------- */
function Campo(props: { id: string; label: string; placeholder?: string; value: string; onChange: (id: string, v: string) => void; error?: string; type?: React.HTMLInputTypeAttribute; help?: string; }) {
  const { id, label, value, onChange, error, type = "text", help, placeholder } = props;
  return (
    <div className="field">
      <label htmlFor={id} className="label">{label}</label>
      <div className="control">
        <input id={id} name={id} className={`input ${error? "is-danger" : "is-danger"}`} type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(id, e.currentTarget.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      </div>
      {help && <p className="help">{help}</p>}
      {error && <p id={`${id}-err`} className="help is-danger">{error}</p>}
    </div>
  );
}

function Select(props: { id: string; label: string; value: string; onChange: (id: string, v: string) => void; error?: string; options: { v: string, t: string }[]; }) {
  const { id, label, value, onChange, error, options } = props;
  return (
    <div className="field">
      <label htmlFor={id} className="label">{label}</label>
      <div className="control">
        <div className={`select ${error ? "is-danger" : ""} `}>
          <select id={id} value={value} onChange={(e) => onchangeSafe(e, onChange, id)} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}>
            <option value="selecciona">Seleccione un tipo</option>
            {options.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
          </select>
        </div>
      </div>
      {error && <p id={`${id}-err`} className="help is-danger">{error}</p>}
    </div>
  );
}

function onchangeSafe(e: React.ChangeEvent<HTMLSelectElement>, onChange: (id: string, v: string) => void, id: string) {
  onChange(id, e.currentTarget.value);
}

function DatosPadreOMadre({ titulo, base, valores, errores, onChange, onPrev, onNext }: {
  titulo: string; base: "padre" | "madre"; valores: any; errores: Record<string, string>;
  onChange: (ruta: string, valor: string) => void; onPrev: () => void; onNext: () => void;
}) {
  const id = (k: string) => `${base}.${k}`;
  return (
    <fieldset className="box p-5 has-background-white" aria-labelledby={`${base}-ttl`}>
      <div className="columns is-multiline">
      <div className="column is-full">
        <legend id={`${base}-ttl`} className="title is-5 has-text-dark">{titulo}</legend>        
      </div>
        <div className="column is-one-third"><Campo id={id("nombresApellidos")} placeholder="Escriba sus nombres y apellidos" label="Nombres y apellidos" value={valores.nombresApellidos} onChange={onChange} error={errores[id("nombresApellidos")]}/></div>
        <div className="column is-one-third"><Campo id={id("numeroIdentificacion")} placeholder="Escriba su número de identificación" type="number" label="Número de identificación" value={valores.numeroIdentificacion} onChange={onChange} error={errores[id("numeroIdentificacion")]}/></div>
        <div className="column is-one-third"><Campo id={id("telefono")} placeholder="Teléfono" type="number" label="Teléfono" value={valores.telefono} onChange={onChange} error={errores[id("telefono")]}/></div>
        <div className="column is-one-third"><Campo id={id("direccion")} placeholder="Dirección" label="Dirección" value={valores.direccion} onChange={onChange} error={errores[id("direccion")]}/></div>
        <div className="column is-one-third"><Campo id={id("barrio")} placeholder="Barrio" label="Barrio" value={valores.barrio} onChange={onChange} error={errores[id("barrio")]}/></div>
        <div className="column is-one-third"><Campo id={id("email")} placeholder="Correo electrónico personal" label="Email" value={valores.email} onChange={onChange} error={errores[id("email")]}/></div>
        <div className="column is-one-third"><Campo id={id("empresa")} placeholder="empresa actual" label="Empresa donde trabaja" value={valores.empresa} onChange={onChange} error={errores[id("empresa")]}/></div>
        <div className="column is-one-third"><Campo id={id("profesion")} placeholder="Profesion" label="Profesión u oficio" value={valores.profesion} onChange={onChange} error={errores[id("profesion")]}/></div>
      </div>
      <div className="is-flex is-justify-content-space-between mt-2">
        <button className="button is-light" type="button" onClick={onPrev}>Atrás</button>
        <button className="button is-primary has-text-white" type="button" onClick={onNext}>Siguiente</button>
      </div>
    </fieldset>
  );
}

function Resumen({ datos }: { datos: Aspirante }) {
  return (
    <article className="content">
      <h3 className="title is-6 has-text-black">1) Aspirante</h3>
      <ul>
        <li><b>Nombre:</b> {datos.nombres} {datos.apellidos}</li>
        <li><b>Nacimiento:</b> {datos.fechaNacimiento} – {datos.lugarNacimiento}</li>
        <li><b>Sexo:</b> {datos.sexo === 'M' ? 'Masculino' : 'Femenino'}</li>
        <li><b>Edad:</b> {datos.edadAnios} años, {datos.edadMeses} meses</li>
        <li><b>Dirección:</b> {datos.direccionResidencia}, Barrio {datos.barrioAspirante}</li>
        <li><b>Teléfono:</b> {datos.telefonoCasa}</li>
        <li><b>Religión:</b> {datos.religion}</li>
        <li><b>Colegio de procedencia:</b> {datos.colegioProcedencia}</li>
        <li><b>Último grado:</b> {datos.ultimoGrado}</li>
      </ul>
      <h3 className="title is-6 has-text-black">2) Padre</h3>
      <ul>
        <li><b>Nombre:</b> {datos.padre.nombresApellidos}</li>
        <li><b>ID:</b> {datos.padre.numeroIdentificacion}</li>
        <li><b>Contacto:</b> {datos.padre.telefono} – {datos.padre.email}</li>
        <li><b>Dirección:</b> {datos.padre.direccion}, {datos.padre.barrio}</li>
        <li><b>Empresa y oficio:</b> {datos.padre.empresa} – {datos.padre.profesion}</li>
      </ul>
      <h3 className="title is-6 has-text-black">3) Madre</h3>
      <ul>
        <li><b>Nombre:</b> {datos.madre.nombresApellidos}</li>
        <li><b>ID:</b> {datos.madre.numeroIdentificacion}</li>
        <li><b>Contacto:</b> {datos.madre.telefono} – {datos.madre.email}</li>
        <li><b>Dirección:</b> {datos.madre.direccion}, {datos.madre.barrio}</li>
        <li><b>Empresa y oficio:</b> {datos.madre.empresa} – {datos.madre.profesion}</li>
      </ul>
      <h3 className="title is-6 has-text-black">4) Recomendador / Anexos</h3>
      <ul>
        <li><b>Recomendó:</b> {datos.recomendador.nombresApellidos} ({datos.recomendador.parentesco}) – {datos.recomendador.telefono}</li>
        <li><b>Familiares en el colegio:</b> {datos.familiaresEnColegio}</li>
      </ul>
    </article>
  );
}
