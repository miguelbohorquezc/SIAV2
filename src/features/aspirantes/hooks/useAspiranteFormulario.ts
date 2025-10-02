// [ANCLA:HOOK_ASPIRANTES_V1]
import * as React from "react";
import { createAspirante } from "../services/aspirantes.service";
import type { AspiranteDTO, AspirantePadreOMadre } from "../types/aspirantes";

export type EnviarResultOk = { ok: true; id: string };
export type EnviarResultErr = { ok: false; step?: number; firstError?: string; error?: string };
export type EnviarResult = EnviarResultOk | EnviarResultErr;

type Errores = Record<string, string>;

const vacioPadreOMadre: AspirantePadreOMadre = {
  nombresApellidos: "",
  numeroIdentificacion: "",
  telefono: "",
  direccion: "",
  barrio: "",
  email: "",
  empresa: "",
  profesion: "",
};

const initialForm: AspiranteDTO = {
  // Paso 1
  TIdentificacion: "",
  nIdentificacion: "",
  gradoAspira: "",
  nombres: "",
  apellidos: "",
  fechaNacimiento: "",
  lugarNacimiento: "",
  sexo: "M",
  edadAnios: "",
  edadMeses: "",
  direccionResidencia: "",
  barrioAspirante: "",
  telefonoCasa: "",
  religion: "",
  colegioProcedencia: "",
  ultimoGrado: "",
  // Paso 2 y 3
  padre: { ...vacioPadreOMadre },
  madre: { ...vacioPadreOMadre },
  // Paso 4
  recomendador: { nombresApellidos: "", telefono: "", parentesco: "" },
  familiaresEnColegio: "",
  // Paso 5
  aceptaTerminos: false,
};

export function useAspiranteFormulario() {
  const [formulario, setFormulario] = React.useState<AspiranteDTO>(initialForm);
  const [errores, setErrores] = React.useState<Errores>({});
  const [paso, setPaso] = React.useState<number>(1);
  const [enviando, setEnviando] = React.useState<boolean>(false);

  const actualizarCampo = React.useCallback((ruta: string, valor: any) => {
    setFormulario((prev) => setDeep(prev, ruta, valor));
    // limpiar error puntual al escribir
    setErrores((prev) => {
      const clone = { ...prev };
      delete clone[ruta];
      return clone;
    });
  }, []);

  const siguiente = React.useCallback(() => {
    const res = validarPaso(paso, formulario);
    setErrores(res.errores);
    if (res.ok) {
      setPaso((p) => Math.min(5, p + 1));
      return true;
    } else {
      if (res.step) setPaso(res.step);
      return false;
    }
  }, [paso, formulario]);

  const anterior = React.useCallback(() => setPaso((p) => Math.max(1, p - 1)), []);

  const reiniciarParaHermano = React.useCallback(() => {
    // Resetea SOLO datos del aspirante y adjuntos; conserva padre/madre/recomendador
    setFormulario((prev) => ({
      ...initialForm,
      padre: prev.padre,
      madre: prev.madre,
      recomendador: prev.recomendador,
    }));
    setErrores({});
    setPaso(1);
  }, []);

  const enviar = React.useCallback(async (): Promise<EnviarResult> => {
    // Validación global (todos los pasos)
    const v1 = validarPaso(1, formulario);
    const v2 = validarPaso(2, formulario);
    const v3 = validarPaso(3, formulario);
    const v4 = validarPaso(4, formulario);
    const v5 = validarPaso(5, formulario);

    const allErrors = { ...v1.errores, ...v2.errores, ...v3.errores, ...v4.errores, ...v5.errores };
    if (Object.keys(allErrors).length > 0) {
      const firstKey = Object.keys(allErrors)[0];
      const step = keyToStep(firstKey);
      setErrores(allErrors);
      return { ok: false, step, firstError: firstKey, error: "validation" };
    }

    setEnviando(true);
    const res = await createAspirante(formulario);
    setEnviando(false);

    if (!res.ok) {
      // Error remoto genérico: mantener al usuario en el paso 5
      return { ok: false, step: 5, error: res.error ?? "remote" };
    }
    return { ok: true, id: res.id };
  }, [formulario]);

  return {
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
  };
}

/* -------------------- Helpers -------------------- */

function setDeep<T extends Record<string, any>>(obj: T, path: string, value: any): T {
  const segs = path.split(".");
  const clone: any = Array.isArray(obj) ? [...(obj as any)] : { ...obj };
  let node: any = clone;
  for (let i = 0; i < segs.length - 1; i++) {
    const k = segs[i];
    node[k] = typeof node[k] === "object" && node[k] !== null ? { ...node[k] } : {};
    node = node[k];
  }
  node[segs[segs.length - 1]] = value;
  return clone;
}

function req(v: string) {
  return (v ?? "").toString().trim().length > 0;
}

function validarPaso(step: number, f: AspiranteDTO): { ok: boolean; errores: Errores; step?: number } {
  const e: Errores = {};
  if (step === 1) {
    mark(e, "TIdentificacion", req(f.TIdentificacion), "Requerido");
    mark(e, "gradoAspira", req(f.gradoAspira), "Requerido");
    mark(e, "nIdentificacion", req(f.nIdentificacion), "Requerido");
    mark(e, "nombres", req(f.nombres), "Requerido");
    mark(e, "apellidos", req(f.apellidos), "Requerido");
    mark(e, "fechaNacimiento", req(f.fechaNacimiento), "Requerido");
    mark(e, "lugarNacimiento", req(f.lugarNacimiento), "Requerido");
    mark(e, "sexo", req(f.sexo), "Requerido");
    mark(e, "edadAnios", req(f.edadAnios), "Requerido");
    mark(e, "edadMeses", req(f.edadMeses), "Requerido");
    mark(e, "direccionResidencia", req(f.direccionResidencia), "Requerido");
    mark(e, "barrioAspirante", req(f.barrioAspirante), "Requerido");
    mark(e, "telefonoCasa", req(f.telefonoCasa), "Requerido");
    mark(e, "religion", req(f.religion), "Requerido");
    /* mark(e, "colegioProcedencia", req(f.colegioProcedencia), "Requerido"); */
    /* mark(e, "ultimoGrado", req(f.ultimoGrado), "Requerido"); */
  }
  if (step === 2) {
    validarPersona("padre", f.padre, e);
  }
  if (step === 3) {
    validarPersona("madre", f.madre, e);
  }
  if (step === 4) {
    /* mark(e, "recomendador.nombresApellidos", req(f.recomendador.nombresApellidos), "Requerido");
    mark(e, "recomendador.telefono", req(f.recomendador.telefono), "Requerido");
    mark(e, "recomendador.parentesco", req(f.recomendador.parentesco), "Requerido"); */
    // familiaresEnColegio opcional
  }
  if (step === 5) {
    if (!f.aceptaTerminos) {
      e["aceptaTerminos"] = "Debes aceptar los términos y condiciones.";
    }
  }
  return { ok: Object.keys(e).length === 0, errores: e, step: Object.keys(e).length ? step : undefined };
}

function validarPersona(base: "padre" | "madre", p: AspirantePadreOMadre, e: Errores) {
  mark(e, `${base}.nombresApellidos`, req(p.nombresApellidos), "Requerido");
  mark(e, `${base}.numeroIdentificacion`, req(p.numeroIdentificacion), "Requerido");
  mark(e, `${base}.telefono`, req(p.telefono), "Requerido");
  mark(e, `${base}.direccion`, req(p.direccion), "Requerido");
  mark(e, `${base}.barrio`, req(p.barrio), "Requerido");
  mark(e, `${base}.email`, req(p.email), "Requerido");
  mark(e, `${base}.empresa`, req(p.empresa), "Requerido");
  mark(e, `${base}.profesion`, req(p.profesion), "Requerido");
}

function mark(e: Errores, key: string, ok: boolean, msg: string) {
  if (!ok) e[key] = msg;
}

function keyToStep(key: string): number {
  if (key.startsWith("padre.")) return 2;
  if (key.startsWith("madre.")) return 3;
  if (key.startsWith("recomendador.") || key === "familiaresEnColegio") return 4;
  if (key === "aceptaTerminos") return 5;
  return 1;
}
