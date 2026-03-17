import React from 'react';

export default function ChallengeCard({ challenge, selected, onSelect }) {
  return (
    <div className={`card`} style={{ borderColor: selected ? '#4f46e5' : '#1b2030' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{challenge.title}</h3>
        <span className="badge">{challenge.points} pts</span>
      </div>
      <p style={{ color: 'var(--muted)' }}>{challenge.prompt}</p>
      <pre className="card" style={{ overflowX: 'auto', background: '#0f131c' }}>
        {challenge.signature}
      </pre>
      <button className="button secondary" onClick={() => onSelect(challenge)}>
        Select
      </button>
    </div>
  );
}