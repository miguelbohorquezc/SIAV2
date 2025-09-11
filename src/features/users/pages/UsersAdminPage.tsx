import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//@ts-ignore
import { usersSelectors, selectUI, makeSelectFilteredUsers } from '../store/selectors';
import {
  fetchUsersThunk,
  createUserWithPasswordThunk,
  updateUserRoleStatusThunk,
  sendPasswordResetForUserThunk,
} from '../store/thunks';
import { openModal, closeModal, clearInfo } from '../store/slice';
import { UsersTable } from '../components/UsersTable';
import { UserFormModal } from '../components/UserFormModal';
import type { AppDispatch } from '@/app/store';

// Estilos solo de esta feature (tema claro scopiado)
import '../styles/users.light.css';

export default function UsersAdminPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Cargamos UNA VEZ desde Firestore
  useEffect(() => { dispatch(fetchUsersThunk({})); }, [dispatch]);

  // Estado local de búsqueda (cliente)
  const [q, setQ] = useState('');

  // Selectores
  const ui = useSelector(selectUI);
  const selectFiltered = useMemo(makeSelectFilteredUsers, []); // factory (memo)
  //@ts-ignore
  const filtered = useSelector((state) => selectFiltered(state, { q }));

  return (
    <section className="section users-scope">
      <div className="container">
        <div className="level">
          <div className="container">
            <h1 className="title has-text-primary-invert">Usuarios</h1>
            <p className="subtitle is-6 has-text-primary-invert">Gestión de permisos y roles</p>
          </div>
          <div className="level-right">
            <div className="field has-addons mb-0">
              <div className="control">
                <input
                  className="input"
                  placeholder="Buscar por correo o nombre…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Buscar usuarios"
                />
              </div>
              <div className="control">
                <button className="button" onClick={() => setQ('')}>Limpiar</button>
              </div>
            </div>
            <button className="button is-primary ml-3" onClick={() => dispatch(openModal())}>Nuevo</button>
          </div>
        </div>

        {ui.actionInfo && (
          <div className="notification is-success" role="status">
            {ui.actionInfo}
            <button className="delete" aria-label="Cerrar" onClick={() => dispatch(clearInfo())} />
          </div>
        )}
        {ui.error && (
          <div className="notification is-danger" role="alert">
            {ui.error}
            <button className="delete" aria-label="Cerrar" onClick={() => dispatch(clearInfo())} />
          </div>
        )}

        <UsersTable
          items={filtered}               // 👈 lista filtrada en Redux
          loading={ui.loading}
          error={undefined}
          updatingMap={ui.updating ?? {}}
          resettingMap={ui.resetting ?? {}}
          onEditRole={(uid, role) => dispatch(updateUserRoleStatusThunk({ uid, role }))}
          onToggleStatus={(uid, next) => dispatch(updateUserRoleStatusThunk({ uid, status: next }))}
          onResetPassword={(email) => dispatch(sendPasswordResetForUserThunk({ email }))}
        />

        <UserFormModal
          open={ui.modalOpen}
          onClose={() => dispatch(closeModal())}
          onCreate={(input) => dispatch(createUserWithPasswordThunk(input)).unwrap().then(() => dispatch(closeModal()))}
          creating={false}
          error={undefined}
        />
      </div>
    </section>
  );
}
