const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 7000;

const MAX_WORDS_PER_DAY = 80000;
const TOKEN_SECRET = 'mysecrettoken';

let wordsCount = {};

app.use(bodyParser.text());
app.use(bodyParser.json());

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// token
app.post('/api/token', (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }  
  const token = jwt.sign({ email }, TOKEN_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// Endpoint pour le texte justifié
app.post('/api/justify', verifyToken, (req, res) => {
  const text = req.body.trim();
  if (!text) {
    return res.status(400).json({ error: 'Text required' });
  }

  // compter les mots dans le texte
  const words = text.split(/\s+/);
  const wordCount = words.length;
  const userEmail = req.user.email;

  // Verifier le nombre de mots par jour
  if (wordsCount[userEmail]) {
    wordsCount[userEmail] += wordCount;
  } else {
    wordsCount[userEmail] = wordCount;
  }
  if (wordsCount[userEmail] > MAX_WORDS_PER_DAY) {
    return res.status(402).json({ error: 'Payment Required' });
  }

  // Justifier le texte
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line.length + word.length > 80) {
      lines.push(line.trim());
      line = '';
    }
    line += word + ' ';
  }
  lines.push(line.trim());

  res.send(lines.join('\n'));
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
