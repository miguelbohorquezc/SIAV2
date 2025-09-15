import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '@/features/auth/services/auth.repository';
/* import logo from '@/assets/logo.svg'; */

// TODO: mover a shared/constants/routes.ts
const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  users: '/admin/users',
  login: '/login',
} as const;

export default function Navbar() {
  const [active, setActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleBurger = () => setActive((v) => !v);
  const closeMenu = () => {
    setActive(false);
    setDropdownOpen(false);
  };

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut();
      navigate(ROUTES.login, { replace: true });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      navigate(ROUTES.login, { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <nav className="navbar is-light" role="navigation" aria-label="main navigation">
      {/* Brand */}
      <div className="navbar-brand">
        <Link to={ROUTES.dashboard} className="navbar-item" onClick={closeMenu} aria-label="Ir a Dashboard">
          {/* Puedes cambiar por tu SVG/logo */}
          {/* <img src={logo} alt="logo" /> */}
        </Link>

        {/* Burger */}
        <button
          className={`navbar-burger ${active ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded={active}
          aria-controls="navbarMainMenu"
          onClick={toggleBurger}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {/* Menu */}
      <div id="navbarMainMenu" className={`navbar-menu ${active ? 'is-active' : ''}`}>
        {/* Left/start */}
        <div className="navbar-start">
          <Link to={ROUTES.dashboard} className="navbar-item" onClick={closeMenu}>
            <span className="icon-text">
              <span className="icon">
               <i className="fa-solid fa-school-flag"></i>
              </span>
              <span>Dashboard</span>
            </span>
          </Link>

          <div
            className={`navbar-item has-dropdown ${dropdownOpen ? 'is-active' : ''}`}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className="navbar-link"
              type="button"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span className="icon-text is-size-6">
              <span className="icon">
                <i className="fa-solid fa-users-gear"></i>
              </span>
              <span className='is-small has-text-weight-normal is-size-7'>Usuarios</span>
            </span>
            </button>

            <div className="navbar-dropdown is-boxed">
              <Link to={ROUTES.dashboard} className="navbar-item" onClick={closeMenu}>
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-grip"></i>
                  </span>
                  <span>Dashboard</span>
                </span>
              </Link>
              <Link to={ROUTES.users} className="navbar-item" onClick={closeMenu}>
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-user-plus"></i>
                  </span>
                  <span>Usuarios</span>
                </span>
              </Link>
              <hr className="navbar-divider" />
              <a
                className="navbar-item"
                href="https://bulma.io/documentation/overview/start/"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                Documentación
              </a>
            </div>
          </div>
        </div>

        {/* Right/end */}
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button
                className={`button is-primary ${loading ? 'is-loading' : ''} is-normal has-text-weight-normal is-size-7`}
                onClick={handleLogout}
                disabled={loading}
                aria-busy={loading ? 'true' : 'false'}
                type="button"
              >
                {loading ? 'Saliendo…' : 'Salir'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
