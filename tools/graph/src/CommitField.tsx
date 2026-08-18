import { useEffect, useState } from "react";

interface CommitFieldProps {
  label: string;
  value: string;
  multiline?: boolean;
  onCommit: (value: string) => void;
}

export function CommitField({ label, value, multiline = false, onCommit }: CommitFieldProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    const next = draft.trim();
    if (next && next !== value) onCommit(next);
    if (!next) setDraft(value);
  };

  const shared = {
    value: draft,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(event.target.value),
    onBlur: commit,
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key === "Escape") setDraft(value);
      if (event.key === "Enter" && (!multiline || event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        commit();
        event.currentTarget.blur();
      }
    },
  };

  return (
    <label className="graph-field">
      <span>{label}</span>
      {multiline ? <textarea {...shared} rows={5} /> : <input {...shared} />}
    </label>
  );
}
