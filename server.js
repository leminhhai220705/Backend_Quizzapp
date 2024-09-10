const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 9000;

app.use(cors());
app.use(bodyParser.json());

let polls = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
    votes: { Paris: 0, London: 0, Berlin: 0, Madrid: 0 }
  },
  {
    id: 2,
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    votes: { '3': 0, '4': 0, '5': 0, '6': 0 }
  },
  {
    id: 3,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    votes: { Earth: 0, Mars: 0, Jupiter: 0, Saturn: 0 }
  },
  {
    id: 4,
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    votes: { 'Atlantic Ocean': 0, 'Indian Ocean': 0, 'Arctic Ocean': 0, 'Pacific Ocean': 0 }
  }
];

let nextId = 5; // Bắt đầu từ ID tiếp theo

const validUser = {
  username: "e2301508",
  password: "abcd"
};

let isAuthenticated = false;

// API to login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === validUser.username && password === validUser.password) {
    isAuthenticated = true;
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// API to get all polls (authenticated)
app.get('/api/polls', (req, res) => {
  if (isAuthenticated) {
    res.json(polls);
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
});

// API to create a new poll (authenticated)
app.post('/api/polls', (req, res) => {
  if (!isAuthenticated) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { question, options } = req.body;
  
  if (!question || !options || !Array.isArray(options) || options.length === 0) {
    return res.status(400).json({ message: 'Invalid question or options' });
  }

  const newPoll = {
    id: nextId++,
    question,
    options,
    votes: options.reduce((acc, option) => {
      acc[option] = 0;
      return acc;
    }, {})
  };

  polls.push(newPoll);
  res.status(201).json(newPoll);
});

// API to submit votes (authenticated)
app.post('/api/vote', (req, res) => {
  if (!isAuthenticated) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { pollId, option } = req.body;

  const poll = polls.find(p => p.id === pollId);
  if (!poll || !poll.votes.hasOwnProperty(option)) {
    return res.status(400).json({ message: 'Invalid poll or option' });
  }

  poll.votes[option]++;
  res.json(poll);
});

// API to get poll results (authenticated)
app.get('/api/results', (req, res) => {
  if (!isAuthenticated) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  res.json(polls);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
