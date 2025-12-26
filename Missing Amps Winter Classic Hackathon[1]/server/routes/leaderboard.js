const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.getLeaderboard());
});

router.post('/', (req, res) => {
  const { player, score } = req.body || {};
  if (!player || typeof score !== 'number') {
    return res.status(400).json({ error: 'player and score required' });
  }
  const row = { id: nanoid(), player, score, at: new Date().toISOString() };
  db.addScore(row);
  res.json(row);
});

module.exports = router;