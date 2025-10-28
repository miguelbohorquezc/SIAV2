import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from '@/features/auth/services/auth.repository';
import logo from '@/assets/Logo-img.png';

// TODO: mover a shared/constants/routes.ts
const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  users: '/admin/users',
  login: '/login',
} as const;

export default function Navbar() {
  const [active, setActive] = useState(false);         // menú móvil
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navRef = useRef<HTMLElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

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
      console.error(e);
      navigate(ROUTES.login, { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // 🔸 Fijar navbar y sincronizar altura -> --nav-h
  useEffect(() => {
    const setHeights = () => {
      const h = navRef.current?.offsetHeight ?? 64;
      document.documentElement.style.setProperty('--nav-h', `${h}px`);
    };
    setHeights();
    window.addEventListener('resize', setHeights);
    return () => window.removeEventListener('resize', setHeights);
  }, []);

  // 🔸 Cerrar cuando se navega a otra ruta
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // 🔸 Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 🔸 Cerrar al hacer clic fuera del dropdown / menú móvil
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideNav = navRef.current?.contains(target);
      const insideDrop = dropRef.current?.contains(target);
      if (!insideNav && !insideDrop) closeMenu();
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <>
      {/* estilos UX */}
      <style>{`
        .navbar.is-fixed-top { 
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 40; 
          backdrop-filter: saturate(120%) blur(2px);
        }
        .navbar-spacer { height: var(--nav-h, 64px); } /* evita salto del contenido */

        /* Hover/animación del dropdown */
        .navbar .navbar-dropdown {
          opacity: 0; transform: translateY(6px);
          transition: opacity .16s ease, transform .16s ease, visibility 0s linear .16s;
          visibility: hidden; will-change: opacity, transform;
        }
        .navbar-item.has-dropdown.is-active .navbar-dropdown,
        .navbar-item.has-dropdown:hover .navbar-dropdown {
          opacity: 1; transform: translateY(0);
          transition: opacity .16s ease, transform .16s ease, visibility 0s;
          visibility: visible;
        }

        /* Mejora del área clickable y tipografía compacta */
        .navbar .navbar-item, .navbar .navbar-link {
          line-height: 1.1; 
        }
        .navbar .navbar-item .icon-text .icon { margin-right: .35rem; }

        /* Botón burger: feedback */
        .navbar-burger { transition: transform .12s ease; }
        .navbar-burger:active { transform: scale(.96); }
      `}</style>

      {/* NAVBAR FIJO */}
      <nav ref={navRef} className="navbar is-light is-fixed-top" role="navigation" aria-label="main navigation">
        {/* Brand */}
        <div className="navbar-brand">
          <Link to={ROUTES.dashboard} className="navbar-item" onClick={closeMenu} aria-label="Ir a Dashboard">
            <img src={logo} alt="logo" />
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
            <Link to={ROUTES.dashboard} className="navbar-item" onClick={closeMenu} />

            <div
              ref={dropRef}
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
                  <span className="icon"><i className="fa-solid fa-users-gear" /></span>
                  <span className="is-small has-text-weight-normal is-size-7">Usuarios</span>
                </span>
              </button>

              <div className="navbar-dropdown is-boxed">
                <Link to={ROUTES.dashboard} className="navbar-item" onClick={closeMenu}>
                  <span className="icon-text">
                    <span className="icon"><i className="fa-solid fa-grip" /></span>
                    <span>Dashboard</span>
                  </span>
                </Link>
                <Link to={ROUTES.users} className="navbar-item" onClick={closeMenu}>
                  <span className="icon-text">
                    <span className="icon"><i className="fa-solid fa-user-plus" /></span>
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

      {/* Empuja el contenido para compensar el navbar fijo */}
      <div className="navbar-spacer" />
    </>
  );
}
