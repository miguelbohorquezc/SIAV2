import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import '@/features/admin-matricula/styles/adminMatricula.light.css'

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
    <div className="section users-scope">
      <h1 className="title has-text-black">Matrícula #{id}</h1>
      <p className="subtitle is-6 has-text-primary-invert">Información del estudiante</p>

      <div className="buttons">
        <MatricularButton enabled={canMatricular} onConfirm={() => dispatch(marcarMatriculado(id))} />
        <RevocarButton onConfirm={(reason) => dispatch(revocarMatricula({ id, reason }))} />
        <RetirarButton onConfirm={(reason) => dispatch(retirarMatricula({ id, reason }))} />
        <PrintFichaButton data={data} />
      </div>

      <div className="buttons">
        <ul className='is-flex'>
          <li className={tab === 'datos' ? 'is-active' : ''}>
            <button className='button mr-2' onClick={() => setTab('datos')}><i className="fa-solid fa-user-tie mr-1"></i>Datos</button>
          </li>
          <li className={tab === 'documentos' ? 'is-active' : ''}>
            <button className='button mr-2' onClick={() => setTab('documentos')}><i className="fa-solid fa-file mr-1"></i> Documentos</button>
    
          </li>
          <li className={tab === 'auditoria' ? 'is-active' : ''}>
            <button className='button mr-2' onClick={() => setTab('auditoria')}><i className="fa-solid fa-list-check mr-1"></i> Auditoría</button>
            
          </li>
          <li className={tab === 'historial' ? 'is-active' : ''}>
            <button className='button mr-2' onClick={() => setTab('historial')}><i className="fa-solid fa-clock-rotate-left mr-1"></i>Historial</button>
            
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
          //@ts-ignore
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
