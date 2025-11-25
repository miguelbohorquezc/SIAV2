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
import RevocarButton from '../components/RevocarButton';
import RetirarButton from '../components/RetirarButton';
import AuditoriaPanel from '../components/AuditoriaPanel';
import Ficha from '../printing/ficha.template';
import ConfirmModal from '../components/ConfirmModal';

export default function MatriculaDetailPage() {
  const { id = '' } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectMatriculaById(id));
  const canMatricular = useSelector(selectCanMatricular(id));
  const [tab, setTab] = useState<'datos'|'matricula'| 'documentos' | 'auditoria' | 'historial'>('datos');
  const [openConfirmMatricula, setOpenConfirmMatricula] = useState(false)
  

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
      <div className="">

        <div className="buttons mt-2 ml-2">
          <button
          className="button is-success"
          disabled={!canMatricular}
          onClick={() => setOpenConfirmMatricula(true)}
          aria-label="Abrir confirmación de matrícula">
          Matricular
        </button>

        <RevocarButton onConfirm={(reason) => dispatch(revocarMatricula({ id, reason }))} />
        <RetirarButton onConfirm={(reason) => dispatch(retirarMatricula({ id, reason }))} />
      </div>

      <ConfirmModal
        open={openConfirmMatricula}
        title="Confirmar matrícula"
        message="Esta acción matriculará definitivamente al estudiante en el sistema."
        //@ts-ignore
        requireText="confirmar"
        confirmLabel="Matricular ahora"
        cancelLabel="Cancelar"
        onCancel={() => setOpenConfirmMatricula(false)}
        onConfirm={() => {
          setOpenConfirmMatricula(false);
          dispatch(marcarMatriculado(id));
        }}/>


      <div className="buttons ml-2">
        <ul className='is-flex'>
          <li className={tab === 'datos' ? 'is-active' : ''}>
            <button className='button mr-2  is-info is-light' onClick={() => setTab('datos')}><i className="fa-solid fa-user-tie mr-1"></i>Datos</button>
          </li>
          <li className={tab === 'documentos' ? 'is-active' : ''}>
            <button className='button mr-2  is-info is-light' onClick={() => setTab('documentos')}><i className="fa-solid fa-file mr-1"></i> Documentos</button>
    
          </li>
          <li className={tab === 'auditoria' ? 'is-active' : ''}>
            <button className='button mr-2  is-info is-light' onClick={() => setTab('auditoria')}><i className="fa-solid fa-list-check mr-1"></i> Auditoría</button>
            
          </li>
          <li className={tab === 'historial' ? 'is-active' : ''}>
            <button className='button mr-2  is-info is-light' onClick={() => setTab('historial')}><i className="fa-solid fa-clock-rotate-left mr-1"></i>Historial</button>
          </li>
          <li className={tab === 'matricula' ? 'is-active' : ''}>
            <button className='button mr-2  is-info is-light' onClick={() => setTab('matricula')}><i className="fa-solid fa-clock-rotate-left mr-1"></i>Ficha de matricula</button>
          </li>
        </ul>
      </div>

      {tab === 'datos' && (
        <MatriculaForm
          value={data}
          onChange={() => {/* opcional */}}
          //@ts-ignore
          onSave={(payload) => dispatch(updateMatriculaFields({ id, payload: payload ?? { estudiante: data.estudiante } }))}
        />

      )}

      {tab === 'documentos' && (
        <ChecklistDocumentos
          value={data}
          //@ts-ignore
          onToggle={(key, val) => dispatch(toggleDocumentoCheck({ id, key, value: val }))}
        />
      )}

      {tab === 'matricula' && (
        <Ficha data={data}/>
      )}

      {tab === 'auditoria' && <AuditoriaPanel id={id} />}

      {tab === 'historial' && (
        <div className="notification is-light">Enlazar prevMatriculaId / prevAnio para mostrar histórico.</div>
      )}
    </div>
  );
}
