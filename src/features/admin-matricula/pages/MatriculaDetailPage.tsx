import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/app/store';

import {
  resetSelected,
  fetchMatriculaById,
  toggleDocumentoCheck,
  updateMatriculaFields,
  marcarMatriculado,
  revocarMatricula,
  retirarMatricula,
  selectMatriculaById,
  selectCanMatricular,
} from '../store';

import MatriculaForm from '../components/MatriculaForm';
import ChecklistDocumentos from '../components/ChecklistDocumentos';
import MatricularButton from '../components/MatricularButton';
import RevocarButton from '../components/RevocarButton';
import RetirarButton from '../components/RetirarButton';
import AuditoriaPanel from '../components/AuditoriaPanel';
import PrintFichaButton from '../components/PrintFichaButton';

export default function MatriculaDetailPage() {
  const { id = '' } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectMatriculaById(id));
  const canMatricular = useSelector(selectCanMatricular(id));
  const [tab, setTab] = useState<'datos' | 'documentos' | 'auditoria' | 'historial'>('datos');

  useEffect(() => {
    dispatch(fetchMatriculaById(id));
    return () => {
      dispatch(resetSelected());
    };
  }, [dispatch, id]);

  if (!data) {
    return (
      <div className="section">
        <progress className="progress is-primary" max={100} />
      </div>
    );
  }

  return (
    <div className="section">
      <h1 className="title">Matrícula #{id}</h1>

      <div className="buttons">
        <MatricularButton enabled={canMatricular} onConfirm={() => dispatch(marcarMatriculado(id))} />
        <RevocarButton onConfirm={(reason) => dispatch(revocarMatricula({ id, reason }))} />
        <RetirarButton onConfirm={(reason) => dispatch(retirarMatricula({ id, reason }))} />
        <PrintFichaButton data={data} />
      </div>

      <div className="tabs is-boxed">
        <ul>
          <li className={tab === 'datos' ? 'is-active' : ''}>
            <a onClick={() => setTab('datos')}>Datos</a>
          </li>
          <li className={tab === 'documentos' ? 'is-active' : ''}>
            <a onClick={() => setTab('documentos')}>Documentos</a>
          </li>
          <li className={tab === 'auditoria' ? 'is-active' : ''}>
            <a onClick={() => setTab('auditoria')}>Auditoría</a>
          </li>
          <li className={tab === 'historial' ? 'is-active' : ''}>
            <a onClick={() => setTab('historial')}>Historial</a>
          </li>
        </ul>
      </div>

      {tab === 'datos' && (
        <MatriculaForm
          value={data}
          onChange={() => {
            /* optimistic local-only (UI) */
          }}
          onSave={() => dispatch(updateMatriculaFields({ id, payload: { estudiante: data.estudiante } }))}
        />
      )}

      {tab === 'documentos' && (
        <ChecklistDocumentos
          value={data}
          onToggle={(key, val) => dispatch(toggleDocumentoCheck({ id, key, value: val }))}
        />
      )}

      {tab === 'auditoria' && <AuditoriaPanel id={id} />}

      {tab === 'historial' && (
        <div className="notification is-light">Enlazar prevMatriculaId / prevAnio para mostrar histórico.</div>
      )}
    </div>
  );
}
