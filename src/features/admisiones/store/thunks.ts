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

export const authorizeMatricula = createAsyncThunk(
  'admisiones/authorizeMatricula',
  async ({ id }: { id: string }) => {
    const { actorUid } = await applicantsService.authorize(id);
    await auditsService.create({
      entity: 'applicants',
      entityId: id,
      action: 'authorize',
      changes: {},
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
    'id',
    'nombresApellidos',
    'numeroIdentificacion',
    'ultimoGrado',
    'estado',
    'autorizadoMatricula',
    'createdAt',
    'fuente',
    'tags',
  ];
  const csv = [header.join(',')]
    .concat(
      rows.map((r) =>
        [
          r.id,
          JSON.stringify(r.nombresApellidos),
          r.numeroIdentificacion,
          JSON.stringify(r.ultimoGrado),
          r.estado,
          r.autorizadoMatricula,
          new Date(r.createdAt).toISOString(),
          JSON.stringify(r.fuente),
          JSON.stringify(r.tags.join('|')),
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
