import { useState } from 'react';

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export default function TagsEditor({ value, onChange }: Props) {
  const [input, setInput] = useState('');
  const add = () => {
    const t = input.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setInput('');
  };
  const remove = (t: string) => onChange(value.filter((x) => x !== t));

  return (
    <div>
      <div className="field has-addons">
        <div className="control is-expanded">
          <input className="input" placeholder="Nuevo tag…" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div className="control">
          <button className="button is-primary" onClick={add}>Agregar</button>
        </div>
      </div>
      <div className="tags">
        {value.map((t) => (
          <span key={t} className="tag is-info is-light">
            {t}
            <button className="delete is-small ml-2" onClick={() => remove(t)} />
          </span>
        ))}
      </div>
    </div>
  );
}
