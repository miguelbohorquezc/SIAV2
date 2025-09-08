import { NavLink } from "react-router-dom";
import { PublicRoutes, PrivateRoutes } from "../constants/routes";
import UsersNavItem from '@/app/components/UsersNavItem';

export default function Navbar() {
  return (
    <nav className="navbar is-link" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <NavLink className="navbar-item" to={`/${PrivateRoutes.DASHBOARD}`}>
          <strong>SIA COLINA</strong>
        </NavLink>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <NavLink
            to={`/${PublicRoutes.LOGIN}`}
            className={({ isActive }) => `navbar-item ${isActive ? "is-active" : ""}`}
          >
            Login
          </NavLink>

          <NavLink
            to={`/${PrivateRoutes.DASHBOARD}`}
            className={({ isActive }) => `navbar-item ${isActive ? "is-active" : ""}`}
          >
            Dashboard
          </NavLink>

          <NavLink
            to={`/${PrivateRoutes.HISTORY}/annual`}
            className={({ isActive }) => `navbar-item ${isActive ? "is-active" : ""}`}
          >
            Historial Anual
          </NavLink>

          {/* Solo COORDINADOR/SECRETARIA */}
          <UsersNavItem />
        </div>
      </div>
    </nav>
  );
}
