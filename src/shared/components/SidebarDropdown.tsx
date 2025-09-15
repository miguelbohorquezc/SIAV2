import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PrivateRoutes } from '@/shared/constants/routes';

export default function SidebarDropdown() {
  const navigate = useNavigate();


  // Navegar sin recargar y dejar el dropdown tranquilo (Bulma lo cierra al salir el mouse)
  const go = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <div
      // 🔹 contenedor flotante (ajusta top/left si tu navbar es más alta)
      style={{ position: "fixed", top: "4.25rem", left: "1rem", zIndex: 40 }}
    >
      {/* 🔹 Bulma original + hover */}
      <div className="dropdown is-hoverable">
        {/* Trigger oficial */}
        <div className="dropdown-trigger">
          <button className="button is-info is-light" aria-haspopup="true" aria-controls="sia-dropdown">
            <span className="is-flex is-align-items-center">
              <i className="fa-solid fa-bars mr-2" aria-hidden="true" />
              <p className="has-text-weight-semibold is-size-7 has-text-grey">Menú</p>
            </span>
            <span className="icon is-small">
              <i className="fas fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>

        {/* Menú oficial */}
        <div className="dropdown-menu" id="sia-dropdown" role="menu">
          <div
            className="dropdown-content has-background-white"
            style={{ width: 260, maxHeight: 350, overflowY: "auto", 
              border: "1px solid #dbdbdb", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            {/* Grupo 1: General */}
            <div className="dropdown-item has-text-weight-semibold is-size-7 has-text-grey">
              Dashboard
            </div>

            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon mr-1">
                  <i className="fa-solid fa-grip"></i>
                </span>
              <span>Home</span>
              </span>
            </Link>

            {/* Grupo 1: General */}
            <div className="dropdown-item has-text-weight-semibold is-size-7 has-text-grey">
              Secretaría
            </div>

            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon mr-1">
                  <i className="fa-solid fa-user-graduate"></i>
                </span>
              <span>Admisiones, registro y control</span>
              </span>
            </Link>

            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon mr-1">
                  <i className="fa-solid fa-laptop-file"></i>
                </span>
              <span>Informes generales</span>
              </span>
            </Link>

            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon mr-1">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </span>
              <span>Historial Académico</span>
              </span>
            </Link>

            <Link to={PrivateRoutes.ADMIN_USERS} className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fa-solid fa-user-plus"></i>
                </span>
                <span>Usuarios</span>
              </span>
            </Link>

            {/* Grupo 2: Gestión */}
            <div className="dropdown-item has-text-weight-semibold is-size-7 has-text-grey has-background-white">
              Academia
            </div>

            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fa-solid fa-school-circle-check"></i>
                </span>
                <span>Matriculas</span>
              </span>
            </Link>

            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fa-solid fa-chalkboard-user"></i>
                </span>
                <span>Salones de clase</span>
              </span>
            </Link>

            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fa-solid fa-book-open"></i>
                </span>
                <span>Materias</span>
              </span>
            </Link>

            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fa-solid fa-chart-simple"></i>
                </span>
                <span>Informes</span>
              </span>
            </Link>

            {/* Grupo 4: Docentes */}
            <div className="dropdown-item has-text-weight-semibold is-size-7 has-text-grey has-background-white">
              Calificaciones
            </div>

            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fa-solid fa-school-circle-check"></i>
                </span>
                <span>Periodo 1 - 2025</span>
              </span>
            </Link>
            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fa-solid fa-school-circle-check"></i>
                </span>
                <span>Periodo 2 - 2025</span>
              </span>
            </Link>
            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fa-solid fa-school-circle-check"></i>
                </span>
                <span>Periodo 3 - 2025</span>
              </span>
            </Link>
            <Link to={PrivateRoutes.DASHBOARD} className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fa-solid fa-school-circle-check"></i>
                </span>
                <span>Periodo 4 - 2025</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
