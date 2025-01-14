const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(cors());
app.use(express.json());

const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initialize bot if token exists
if (process.env.VITE_TELEGRAM_BOT_TOKEN) {
  const bot = new TelegramBot(process.env.VITE_TELEGRAM_BOT_TOKEN, { polling: true });
  // ...bot commands...
}