import React from 'react';

export default function Leaderboard({ data }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Leaderboard</h3>
      {data.length === 0 && <p style={{ color: 'var(--muted)' }}>No scores yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {data.map((row, idx) => (
          <li key={row.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1b2030' }}>
            <span className="badge">#{idx + 1}</span>
            <span>{row.player}</span>
            <strong>{row.score}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}