import React, { useEffect, useState } from 'react';
import { localChallenges } from './lib/challenges.js';
import { runUserCode } from './lib/runner.js';
import { fetchChallenges, fetchLeaderboard, submitScore } from './lib/api.js';
import Editor from './components/Editor.jsx';
import ChallengeCard from './components/ChallengeCard.jsx';
import Leaderboard from './components/Leaderboard.jsx';

export default function App() {
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('');
  const [results, setResults] = useState([]);
  const [player, setPlayer] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    let timer;
    if (selected) {
      setTimeLeft(300);
      timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [selected]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchChallenges();
        setChallenges(data);
      } catch {
        setChallenges(localChallenges);
      }
      refreshLeaderboard();
    })();
  }, []);

  function refreshLeaderboard() {
    fetchLeaderboard().then(setLeaderboard).catch(() => setLeaderboard([]));
  }

  function onSelect(challenge) {
    setSelected(challenge);
    setCode(challenge.starterCode);
    setResults([]);
  }

  function runTests() {
    const { allPass, outputs } = runUserCode(code, selected.tests);
    setResults(outputs);
    if (allPass) {
      const bonus = Math.floor(timeLeft / 10);
      const score = selected.points + bonus;
      if (player) {
        submitScore({ player, score }).then(() => refreshLeaderboard());
      }
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ margin: 0 }}>HackCode Arena</h2>
        <div>
          
          <div className="header">
            <h2 style={{ margin: 0 }}>HackCode Arena</h2>
            <div>
                <input
                    placeholder="Your name"
                    value={player}
                    onChange={(e) => setPlayer(e.target.value)}
                    className="card"
                    style={{ padding: '8px 10px', marginRight: 8 }}
                />
                <button className="button" onClick={refreshLeaderboard}>Refresh</button>
            </div>
        </div>


        {player && (
            <p style={{ color: 'var(--muted)', marginTop: '8px' }}>
                Logged in as: <strong>{player}</strong>
            </p>
        )}

          <button className="button" onClick={refreshLeaderboard}>Refresh</button>
        </div>
      </div>

      <div className="grid">
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0 }}>Challenges</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {challenges.map((c) => (
                <ChallengeCard key={c.id} challenge={c} selected={selected?.id === c.id} onSelect={onSelect} />
              ))}
            </div>
          </div>

          {selected && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ marginTop: 0 }}>{selected.title}</h3>
                <span className="badge">Time left: {timeLeft}s</span>
              </div>
              <p style={{ color: 'var(--muted)' }}>{selected.prompt}</p>
              <Editor code={code} onChange={setCode} />
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <button className="button" onClick={runTests}>Run tests</button>
                <button className="button secondary" onClick={() => setCode(selected.starterCode)}>Reset</button>
              </div>
              <div style={{ marginTop: 12 }}>
                {results.map((r, i) => (
                  <div key={i} className={`result ${r.pass ? 'pass' : 'fail'}`}>Test {i + 1}: {r.message}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Leaderboard data={leaderboard} />
      </div>
    </div>
  );
}