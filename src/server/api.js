const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());

const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');

app.get('/api/projects', async (req, res) => {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.listen(3000, () => console.log('API Server running on port 3000'));