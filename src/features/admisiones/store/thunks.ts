import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Applicant, Estado } from '../types';
import { applicantsService } from '../services/applicants.service';
import { auditsService } from '../services/audits.service';

export const fetchApplicantsPage = createAsyncThunk(
  'admisiones/fetchApplicantsPage',
  async (opts: { dateWindowFrom?: number; dateWindowTo?: number } | undefined, { getState }) => {
    const state = getState() as any;
    const pageSize: number = state.admisiones.pagination.pageSize;
    const cursor = state.admisiones.pagination.cursor;
    const { items, nextCursor } = await applicantsService.fetchPage({ pageSize, cursor, ...opts });
    return { items, nextCursor, append: Boolean(cursor) } as {
      items: Applicant[];
      nextCursor?: unknown;
      append: boolean;
    };
  },
);

export const syncRecent = createAsyncThunk('admisiones/syncRecent', async () => {
  const { items } = await applicantsService.fetchRecent({ limit: 20 });
  return { items } as { items: Applicant[] };
});

export const updateEstado = createAsyncThunk(
  'admisiones/updateEstado',
  async ({ id, estado, motivo }: { id: string; estado: Estado; motivo?: string }, { rejectWithValue }) => {
    if (estado === 'no_admitido' && !motivo) {
      return rejectWithValue('Motivo es obligatorio para no_admitido');
    }
    await applicantsService.update(id, {
      estado,
      motivoNoAdmision: estado === 'no_admitido' ? (motivo ?? '') : null,
      updatedAt: Date.now(),
    });
    await auditsService.create({
      entity: 'applicants',
      entityId: id,
      action: 'state_change',
      changes: { to: estado, reason: motivo ?? null },
    });
    return { id, estado, motivo };
  },
);

export const authorizeMatricula = createAsyncThunk('admisiones/authorizeMatricula', async ({ id }: { id: string }) => {
  const { actorUid, actorEmail } = await applicantsService.authorize(id);
  await auditsService.create({
    entity: 'applicants',
    entityId: id,
    action: 'authorize',
    changes: { to: true, actorEmail },
  });
  return { id, actorUid, actorEmail };
});

export const revokeMatricula = createAsyncThunk(
  'admisiones/revokeMatricula',
  async ({ id, reason }: { id: string; reason?: string }) => {
    const { actorUid } = await applicantsService.revokeAuthorize(id);
    await auditsService.create({
      entity: 'applicants',
      entityId: id,
      action: 'authorize_revert',
      changes: { to: false },
      reason: reason ?? null,
    });
    return { id, actorUid };
  },
);

export const updateFuente = createAsyncThunk(
  'admisiones/updateFuente',
  async ({ id, fuente }: { id: string; fuente: string }) => {
    await applicantsService.update(id, { fuente, updatedAt: Date.now() });
    await auditsService.create({
      entity: 'applicants',
      entityId: id,
      action: 'update',
      changes: { campo: 'fuente', to: fuente },
    });
    return { id, fuente };
  },
);

export const updateTags = createAsyncThunk(
  'admisiones/updateTags',
  async ({ id, tags }: { id: string; tags: string[] }) => {
    await applicantsService.update(id, { tags, updatedAt: Date.now() });
    await auditsService.create({
      entity: 'applicants',
      entityId: id,
      action: 'tag_update',
      changes: { to: tags },
    });
    return { id, tags };
  },
);

export const exportCsv = createAsyncThunk('admisiones/exportCsv', async (_: void, { getState }) => {
  const state = getState() as any;
  const rows: Applicant[] = state.admisiones.ids.map((id: string) => state.admisiones.entities[id]);
  const header = [
    'Marca temporal',
    'NOMBRES',
    'APELLIDOS',
    'DOCUMENTO',
    'ULTIMO GRADO CURSADO',
    'ESTADO DE INSCRIPCION',
    'AUTORIZADO PARA MATRICULA',
    'ETIQUETAS',
  ];
  const csv = [header.join(',')]
    .concat(
      rows.map((r) =>
        [
          new Date(r.createdAt).toISOString(),
          JSON.stringify(r.nombres.toUpperCase()),
          JSON.stringify(r.apellidos.toUpperCase()),
          r.nIdentificacion,
          JSON.stringify(r.ultimoGrado),
          r.estado.toUpperCase(),
          r.autorizadoMatricula? 'SI' : 'NO',
          JSON.stringify(r.tags.join('|').toUpperCase()),
        ].join(','),
      ),
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aspirantes_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

export const printFicha = createAsyncThunk('admisiones/printFicha', async ({ id }: { id: string }) => {
  await auditsService.create({
    entity: 'applicants',
    entityId: id,
    action: 'print',
    changes: {},
  });
});
