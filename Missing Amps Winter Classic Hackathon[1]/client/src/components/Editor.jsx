import React from 'react';

export default function Editor({ code, onChange }) {
  return (
    <textarea
      className="editor card"
      value={code}
      onChange={(e) => onChange(e.target.value)}
      spellCheck="false"
    />
  );
}