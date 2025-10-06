import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';

type Audit = { changedAt: any; changedBy: string; role: string; action: string; field?: string; fields?: string[]; oldValue?: any; newValue?: any; reason?: string; };

export default function AuditoriaPanel({ id }: { id: string }) {
  const [items, setItems] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const qRef = query(collection(db, 'matriculas', id, 'audits'), orderBy('changedAt','desc'));
      const snap = await getDocs(qRef);
      setItems(snap.docs.map(d => d.data() as any));
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <progress className="progress is-small is-primary" max={100} />;
  return (
    <div className="content">
      <ul>
        {items.map((a, idx) => (
          <li key={idx}>
            <span className="tag is-info">{a.action}</span>{' '}
            <strong>{a.role}</strong> • {a.changedBy} • <small>{a.changedAt?.toDate?.()?.toLocaleString?.() ?? ''}</small>
            {a.field && <> • campo: <code>{a.field}</code></>}
            {a.fields && <> • campos: <code>{a.fields.join(', ')}</code></>}
            {a.reason && <> • motivo: {a.reason}</>}
          </li>
        ))}
      </ul>
    </div>
  );
}
