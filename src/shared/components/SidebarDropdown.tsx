// src/shared/components/SidebarDropdown.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "@/shared/constants/routes";

export default function SidebarDropdown() {
  // Config
  const EXPANDED = 240;   // ancho abierto (más compacto)
  const COLLAPSED = 64;   // ancho colapsado (solo íconos)

  // Estado
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  const asideRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const isActive = (to: string) => (pathname === to ? "is-active" : "");

  // Mover el <main> con variable CSS
  useEffect(() => {
    const ml = collapsed ? `${COLLAPSED}px` : `${EXPANDED}px`;
    document.documentElement.style.setProperty("--sia-sidebar-ml", ml);
  }, [collapsed]);

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCollapsed(true); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const aside = asideRef.current;
      const btn = buttonRef.current;
      const target = e.target as Node;
      if (!aside) return;
      const insideAside = aside.contains(target);
      const onButton = !!btn && btn.contains(target);
      if (!insideAside && !onButton && !collapsed) setCollapsed(true);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapsed]);

  const asideWidth = useMemo(() => (collapsed ? COLLAPSED : EXPANDED), [collapsed]);

  return (
    <>
      {/* ====== Estilos locales (Bulma-friendly) ====== */}
      <style>{`
        :root {
          --sia-bg: #ffffff;
          --sia-border: #eaeaea;
          --sia-text: #2f2f2f;
          --sia-muted: #7a7a7a;
          --sia-hover: #f6f7f8;
          --sia-active: #00d1b2;
          --sia-radius: 10px;
          --sia-shadow: 0 6px 16px rgba(0,0,0,.12);
        }

        @media (prefers-reduced-motion: no-preference) {
          .sia-aside { transition: width 220ms ease; }
          .sia-item, .sia-icon, .sia-text { transition: all 160ms ease; }
        }

        /* Sidebar fijo */
        .sia-aside {
          position: fixed;
          top: 3rem;           /* ajusta a la altura real del Navbar */
          left: 0;
          bottom: 0;
          width: ${EXPANDED}px; /* fallback */
          background: var(--sia-bg);
          border-right: 1px solid var(--sia-border);
          color: var(--sia-text);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 30;
        }

        /* Header integrado (sticky) para el botón */
        .sia-head {
          position: sticky; top: 0; z-index: 1;
          height: 48px;
          display: flex; align-items: center;
          gap: .6rem;
          padding: .35rem .55rem;
          background: var(--sia-bg);
          border-bottom: 1px solid #f2f2f2;
        }
        .sia-title {
          font-size: .8rem;
          font-weight: 600;
          color: var(--sia-muted);
        }
        .sia-collapsed .sia-title { display: none; }

        /* Botón hamburguesa: menos redondo, integrado */
        .sia-toggle {
          border: 1px solid rgba(0,0,0,.06);
          background: #fff;
          color: #2b2b2b;
          border-radius: 8px;              /* menos redondo */
          width: 46px; height: 36px;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
          transition: background .15s ease, transform .12s ease, border-color .15s ease;
        }
        .sia-toggle:hover { background: #f7f7f7; border-color: #e3e3e3; }
        .sia-toggle:active { transform: scale(.96); }
        .sia-toggle .icon { font-size: .95rem; }

        /* Sidebar scroller */
        .sia-aside__scroll {
          overflow-y: auto;
          height: calc(100% - 48px);  /* resta header */
          padding: .6rem .65rem 1rem;
          scrollbar-width: thin;
          scrollbar-color: #bfbfbf transparent;
        }
        /* 🔒 Ocultar SOLO la barra (no el scroll) cuando está colapsado */
        .sia-collapsed .sia-aside__scroll { 
          scrollbar-width: none;     /* Firefox */
          -ms-overflow-style: none;  /* IE/Edge legacy */
        }
        .sia-collapsed .sia-aside__scroll::-webkit-scrollbar { width: 0 !important; height: 0 !important; } /* WebKit */

        /* Reset de estilos problemáticos (tema oscuro global) */
        .sia-aside .menu-list a,
        .sia-aside .menu-list a:visited {
          background: transparent !important;
          color: var(--sia-text) !important;
        }

        /* Ítem de menú (flex Bulma) */
        .sia-item {
          border-radius: var(--sia-radius);
          padding: .5rem .6rem;
          display: flex;
          align-items: center;
          gap: .6rem;
          transition: background 140ms ease, color 140ms ease, transform 140ms ease;
        }
        .sia-item:hover { background: var(--sia-hover); }
        .sia-item:active { transform: translateY(1px); }
        .sia-item.is-active {
          background: var(--sia-active) !important;
          color: white !important;
        }
        .sia-item:focus-visible {
          outline: 2px solid rgba(0,209,178,.45);
          outline-offset: 2px;
        }

        /* Contenido del item en flex */
        .sia-content {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: .6rem;
        }

        .sia-icon {
          width: 1.75rem;
          min-width: 1.75rem;
          height: 1.75rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
        }
        .sia-item:hover .sia-icon { transform: scale(1.06); }

        .sia-text {
          font-size: .9rem;
          line-height: 1.15;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Etiquetas (menu-label) */
        .sia-aside .menu-label {
          font-size: .7rem;
          letter-spacing: .04em;
          color: var(--sia-muted);
          margin: .75rem .4rem .4rem;
          text-transform: uppercase;
        }

        /* Colapsado: ocultar texto, centrar íconos */
        .sia-collapsed .menu-label {
          opacity: 0;
          height: 0;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .sia-collapsed .sia-item {
          justify-content: center !important;
          padding: .55rem 0 !important;
        }
        .sia-collapsed .sia-content { justify-content: center; }
        .sia-collapsed .sia-text { display: none !important; }

        /* Tooltip mejorado (CSS puro) */
        .sia-tooltip { position: relative; }
        .sia-tooltip[data-tooltip] { --tt-bg:#111827; --tt-pad:.38rem .55rem; --tt-r:6px; }
        /* posición fija para que no se recorte; calculamos Y con --mouse-y */
        .sia-collapsed .sia-tooltip:hover::after,
        .sia-collapsed .sia-tooltip:focus-within::after {
          content: attr(data-tooltip);
          position: fixed;
          left: ${COLLAPSED + 12}px;
          top: var(--mouse-y, 0);
          transform: translateY(-50%);
          background: var(--tt-bg);
          color: #fff;
          font-size: .75rem;
          padding: var(--tt-pad);
          border-radius: var(--tt-r);
          white-space: nowrap;
          box-shadow: var(--sia-shadow);
          pointer-events: none;
          opacity: 0;
          animation: ttIn .18s ease-out forwards;
        }
        .sia-collapsed .sia-tooltip:hover::before,
        .sia-collapsed .sia-tooltip:focus-within::before {
          content:"";
          position: fixed;
          left: ${COLLAPSED + 6}px;
          top: calc(var(--mouse-y, 0) - 1px);
          border: 6px solid transparent;
          border-right-color: var(--tt-bg);
          pointer-events: none;
          opacity: 0;
          animation: ttIn .18s ease-out forwards;
        }
        @keyframes ttIn {
          from { opacity: 0; transform: translate(4px, -50%); }
          to   { opacity: 1; transform: translate(0,   -50%); }
        }

        /* Ajustes compactos Bulma */
        .is-compact { gap: .5rem; }
        .is-compact .sia-text { font-size: .86rem; }

        /* Pequeños refinamientos de UX */
        .menu-list { margin-left: .1rem; }
        .menu-list li { list-style: none; }
      `}</style>

      {/* Sidebar */}
      <aside
        ref={asideRef as any}
        className={`sia-aside ${collapsed ? "sia-collapsed" : ""}`}
        style={{ width: asideWidth }}
        aria-label="Menú lateral SIA"
        onMouseMove={(e) => {
          // Para ubicar el tooltip a la altura del mouse
          document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
        }}
      >
        {/* Header integrado con botón (mejor posición y no tapa nada) */}
        <div className="sia-head">
          <button
            ref={buttonRef}
            type="button"
            className="button sia-toggle"
            onClick={() => setCollapsed(v => !v)}
            title={collapsed ? "Abrir menú" : "Colapsar menú"}
            aria-label="Alternar menú lateral"
          >
            <span className="icon"><i className="fa-solid fa-bars" /></span>
          </button>
          <span className="sia-title">Menú</span>
        </div>

        <div className="sia-aside__scroll">
          <nav className="menu" role="navigation" aria-label="Sidebar">
            {/* DASHBOARD */}
            <p className="menu-label">Dashboard</p>
            <ul className="menu-list">
              <li className="sia-tooltip" data-tooltip="Inicio">
                
                <Link
                  to={PrivateRoutes.DASHBOARD}
                  className={`sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact ${isActive(PrivateRoutes.DASHBOARD)}`}
                >
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-grip" /></span>
                    <span className="sia-text">Inicio</span>
                  </span>
                </Link>
              </li>
              <li className="sia-tooltip" data-tooltip="Informes generales">
                <Link
                  to={PrivateRoutes.DASHBOARD}
                  className="sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact"
                >
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-laptop-file" /></span>
                    <span className="sia-text">Informes generales</span>
                  </span>
                </Link>
              </li>
              <li className="sia-tooltip" data-tooltip="Historial académico">
                <Link
                  to={PrivateRoutes.DASHBOARD}
                  className="sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact"
                >
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-clock-rotate-left" /></span>
                    <span className="sia-text">Historial académico</span>
                  </span>
                </Link>
              </li>
            </ul>

            {/* SECRETARÍA */}
            <p className="menu-label">Secretaría</p>
            <ul className="menu-list">
              <li className="sia-tooltip" data-tooltip="Admisiones, aspirantes">
                <Link
                  to={PrivateRoutes.ADMIN_ASPIRANTES}
                  className={`sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact ${isActive(PrivateRoutes.ADMIN_ASPIRANTES)}`}
                >
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-user-graduate" /></span>
                    <span className="sia-text">Admisiones, aspirantes</span>
                  </span>
                </Link>
              </li>
              <li className="sia-tooltip" data-tooltip="Admisiones, matrículas">
                <Link
                  to={PrivateRoutes.ADMIN_MATRICULAS}
                  className={`sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact ${isActive(PrivateRoutes.ADMIN_MATRICULAS)}`}
                >
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-user-graduate" /></span>
                    <span className="sia-text">Admisiones, matrículas</span>
                  </span>
                </Link>
              </li>
              <li className="sia-tooltip" data-tooltip="Formulario de aspirantes">
                <Link
                  to={PublicRoutes.ASPIRANTES}
                  className={`sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact ${isActive(PublicRoutes.ASPIRANTES)}`}
                >
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-user-graduate" /></span>
                    <span className="sia-text">Formulario de aspirantes</span>
                  </span>
                </Link>
              </li>
              <li className="sia-tooltip" data-tooltip="Formulario de matrícula">
                <Link
                  to={PublicRoutes.MATRICULA}
                  className={`sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact ${isActive(PublicRoutes.MATRICULA)}`}
                >
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-user-graduate" /></span>
                    <span className="sia-text">Formulario de matrícula</span>
                  </span>
                </Link>
              </li>
              <li className="sia-tooltip" data-tooltip="Usuarios">
                <Link
                  to={PrivateRoutes.ADMIN_USERS}
                  className={`sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact ${isActive(PrivateRoutes.ADMIN_USERS)}`}
                >
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-user-plus" /></span>
                    <span className="sia-text">Usuarios</span>
                  </span>
                </Link>
              </li>
            </ul>

            {/* ACADEMIA */}
            <p className="menu-label">Academia</p>
            <ul className="menu-list">
              <li className="sia-tooltip" data-tooltip="Matrículas">
                <Link to={PrivateRoutes.DASHBOARD} className="sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact">
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-school-circle-check" /></span>
                    <span className="sia-text">Matrículas</span>
                  </span>
                </Link>
              </li>
              <li className="sia-tooltip" data-tooltip="Salones de clase">
                <Link to={PrivateRoutes.DASHBOARD} className="sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact">
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-chalkboard-user" /></span>
                    <span className="sia-text">Salones de clase</span>
                  </span>
                </Link>
              </li>
              <li className="sia-tooltip" data-tooltip="Materias">
                <Link to={PrivateRoutes.DASHBOARD} className="sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact">
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-book-open" /></span>
                    <span className="sia-text">Materias</span>
                  </span>
                </Link>
              </li>
              <li className="sia-tooltip" data-tooltip="Informes">
                <Link to={PrivateRoutes.DASHBOARD} className="sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact">
                  <span className="sia-content">
                    <span className="sia-icon"><i className="fa-solid fa-chart-simple" /></span>
                    <span className="sia-text">Informes</span>
                  </span>
                </Link>
              </li>
            </ul>

            {/* CALIFICACIONES */}
            <p className="menu-label">Calificaciones</p>
            <ul className="menu-list">
              {[1,2,3,4].map(p => (
                <li key={p} className="sia-tooltip" data-tooltip={`Periodo ${p} - 2025`}>
                  <Link to={PrivateRoutes.DASHBOARD} className="sia-item is-flex is-align-items-center is-justify-content-flex-start is-compact">
                    <span className="sia-content">
                      <span className="sia-icon"><i className="fa-solid fa-school-circle-check" /></span>
                      <span className="sia-text">Periodo {p} - 2025</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
