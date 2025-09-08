/**
 * Item de menú "Usuarios" para el navbar.
 * Solo visible para COORDINADOR/SECRETARIA.
 * Inserta <UsersNavItem /> dentro de tu navbar existente.
 */
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { ROLES, type Role } from '@/shared/constants/roles';

const ALLOWED: Role[] = [ROLES.COORDINADOR, ROLES.SECRETARIA];

export default function UsersNavItem() {
  const role = useSelector((s: RootState) => (s as any).auth?.role as Role | undefined);
  if (!role || !ALLOWED.includes(role)) return null;

  return (
    <NavLink
      to="/admin/users"
      className={({ isActive }) => `navbar-item ${isActive ? 'is-active' : ''}`}
      aria-label="Administración de usuarios"
    >
      Usuarios
    </NavLink>
  );
}
