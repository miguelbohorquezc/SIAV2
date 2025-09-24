import { db, auth } from '@/infrastructure/firebase/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

type Audit = {
  entity: 'applicants';
  entityId: string;
  action:
    | 'create'
    | 'update'
    | 'delete'
    | 'state_change'
    | 'tag_update'
    | 'authorize'
    | 'authorize_revert'
    | 'print';
  changes: Record<string, unknown>;
  reason?: string | null;
};

export const auditsService = {
  async create(a: Audit) {
    const actorUid = auth.currentUser?.uid ?? 'system';
    const actorRole = (auth as any)?.role ?? 'UNKNOWN';
    const actorEmail = auth.currentUser?.email ?? null;

    await addDoc(collection(db, 'audits'), {
      ...a,
      reason: a.reason ?? null,
      actorUid,
      actorRole,
      actorEmail,
      createdAt: serverTimestamp(),
    });
  },
};
