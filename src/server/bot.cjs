require('dotenv').config({ path: '../../.env' });
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const bot = new TelegramBot(process.env.VITE_TELEGRAM_BOT_TOKEN, { polling: true });
const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');

// Debug logging
console.log('Bot starting...');
console.log('Token exists:', !!process.env.VITE_TELEGRAM_BOT_TOKEN);

// Add message handler for debugging
bot.on('message', (msg) => {
  console.log('Received message:', msg.text);
});

async function initProjectsFile() {
  const dir = path.dirname(PROJECTS_FILE);
  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(dir, { recursive: true });
    
    // Check if projects file exists
    try {
      await fs.access(PROJECTS_FILE);
    } catch {
      // Create empty projects file if it doesn't exist
      await fs.writeFile(PROJECTS_FILE, JSON.stringify([], null, 2));
      console.log('Created empty projects file');
    }
    
    console.log('Projects file initialized at:', PROJECTS_FILE);
  } catch (error) {
    console.error('Error initializing projects file:', error);
    throw error;
  }
}

// Helper function to read projects
async function readProjects() {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

// Helper function to write projects
async function writeProjects(projects) {
  try {
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing projects:', error);
    return false;
  }
}

// Initialize on startup
initProjectsFile().catch(console.error);

// Bot command handler
bot.onText(/\/add/, async (msg) => {
  console.log('Add command received');
  const chatId = msg.chat.id;
  let projectData = {};

  try {
    await bot.sendMessage(chatId, 'Enter project name:');
    const nameMsg = await new Promise(resolve => bot.once('message', resolve));
    console.log('Name received:', nameMsg.text);
    projectData.name = nameMsg.text;

    await bot.sendMessage(chatId, 'Enter project description:');
    const descMsg = await new Promise(resolve => bot.once('message', resolve));
    console.log('Description received:', descMsg.text);
    projectData.description = descMsg.text;

    await bot.sendMessage(chatId, 'Enter project image URL:');
    const imgMsg = await new Promise(resolve => bot.once('message', resolve));
    console.log('Image URL received:', imgMsg.text);
    projectData.imageUrl = imgMsg.text;

    await bot.sendMessage(chatId, 'Enter project link:');
    const linkMsg = await new Promise(resolve => bot.once('message', resolve));
    console.log('Link received:', linkMsg.text);
    projectData.link = linkMsg.text;

    const project = {
      id: uuidv4(),
      ...projectData,
      createdAt: new Date()
    };

    // Save to file
    const projects = await readProjects();
    projects.push(project);
    await writeProjects(projects);

    // Update API endpoint to send updated data
    app.get('/api/projects', async (req, res) => {
      try {
        const data = await fs.readFile(PROJECTS_FILE, 'utf8');
        res.json(JSON.parse(data));
      } catch (error) {
        res.status(500).json({ error: 'Failed to load projects' });
      }
    });

    await bot.sendMessage(chatId, 'Project added successfully! 🎉');
  } catch (error) {
    console.error('Error in add command:', error);
    await bot.sendMessage(chatId, 'Error adding project. Please try again.');
  }
});

// Delete project command
bot.onText(/\/del/, async (msg) => {
  console.log('Delete command received');
  const chatId = msg.chat.id;
  try {
    const projects = await readProjects();
    
    if (projects.length === 0) {
      await bot.sendMessage(chatId, 'No projects to delete.');
      return;
    }

    const projectsList = projects.map(p => p.name).join('\n');
    await bot.sendMessage(chatId, `Available projects:\n${projectsList}\n\nEnter project name to delete:`);
    
    const response = await new Promise(resolve => bot.once('message', resolve));
    const projectName = response.text;
    
    const updatedProjects = projects.filter(p => p.name !== projectName);
    
    if (updatedProjects.length === projects.length) {
      await bot.sendMessage(chatId, 'Project not found.');
      return;
    }
    
    await writeProjects(updatedProjects);
    
    // Update API endpoint with new data
    app.get('/api/projects', async (req, res) => {
      try {
        const data = await fs.readFile(PROJECTS_FILE, 'utf8');
        res.json(JSON.parse(data));
      } catch (error) {
        res.status(500).json({ error: 'Failed to load projects' });
      }
    });

    await bot.sendMessage(chatId, `Project deleted successfully! 🗑️`);
  } catch (error) {
    console.error('Error in delete command:', error);
    await bot.sendMessage(chatId, 'Error deleting project. Please try again.');
  }
});

// Add error handler
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// API Endpoints
app.get('/api/projects', async (req, res) => {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf8');
    console.log('Sending projects:', data); // Debug log
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));