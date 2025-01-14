const express = require('express');
const cors = require('cors');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs').promises;
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configure CORS properly
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3003', 'https://portfolio-main-9il7p1l1u-expandaa7455-gmailcoms-projects.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

// Add pre-flight OPTIONS handling
app.options('*', cors());

app.use(express.json());

const PROJECTS_FILE = path.join(__dirname, './data/projects.json');
const PORT = process.env.PORT || 3003;

app.use(express.static(path.join(__dirname, '../../dist')));

// Ensure projects file exists
async function ensureProjectsFile() {
  try {
    await fs.access(PROJECTS_FILE);
  } catch {
    await fs.mkdir(path.dirname(PROJECTS_FILE), { recursive: true });
    await fs.writeFile(PROJECTS_FILE, JSON.stringify([], null, 2));
  }
}

// Initialize projects file
ensureProjectsFile();

// Helper functions
async function readProjects() {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

async function writeProjects(projects) {
  try {
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing projects:', error);
    return false;
  }
}

// API Routes
app.get('/api/projects', async (req, res) => {
  try {
    console.log('Fetching projects from:', PROJECTS_FILE);
    const data = await fs.readFile(PROJECTS_FILE, 'utf8');
    const projects = JSON.parse(data);
    console.log('Projects found:', projects.length);
    res.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Update bot configuration
const bot = new TelegramBot(process.env.VITE_TELEGRAM_BOT_TOKEN, { 
  webHook: {
    port: process.env.PORT || 3003
  }
});

const DOMAIN = 'https://portfolio-main-oy7jvsvf6-expandaa7455-gmailcoms-projects.vercel.app';
bot.setWebHook(`${DOMAIN}/webhook`);

// Validate environment variables
const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('Error: VITE_TELEGRAM_BOT_TOKEN not found in environment variables');
  console.log('Make sure .env file exists with proper token');
} else {
  try {
    console.log('Bot initialized successfully');
    
    // Bot commands
    bot.onText(/\/add/, async (msg) => {
      const chatId = msg.chat.id;
      try {
        await bot.sendMessage(chatId, 'Enter project name:');
        const nameMsg = await new Promise(resolve => bot.once('message', resolve));
        
        await bot.sendMessage(chatId, 'Enter project description:');
        const descMsg = await new Promise(resolve => bot.once('message', resolve));
        
        await bot.sendMessage(chatId, 'Enter project image URL:');
        const imgMsg = await new Promise(resolve => bot.once('message', resolve));
        
        await bot.sendMessage(chatId, 'Enter project link:');
        const linkMsg = await new Promise(resolve => bot.once('message', resolve));
  
        const projects = await readProjects();
        projects.push({
          id: uuidv4(),
          name: nameMsg.text,
          description: descMsg.text,
          imageUrl: imgMsg.text,
          link: linkMsg.text,
          createdAt: new Date()
        });
  
        await writeProjects(projects);
        await bot.sendMessage(chatId, 'Project added successfully! 🎉');
      } catch (error) {
        console.error('Error:', error);
        await bot.sendMessage(chatId, 'Error adding project.');
      }
    });
  
    bot.onText(/\/del/, async (msg) => {
      const chatId = msg.chat.id;
      try {
        const projects = await readProjects();
        const projectsList = projects.map(p => p.name).join('\n');
        await bot.sendMessage(chatId, `Projects:\n${projectsList}\nEnter name to delete:`);
        
        const response = await new Promise(resolve => bot.once('message', resolve));
        const updatedProjects = projects.filter(p => p.name !== response.text);
        
        await writeProjects(updatedProjects);
        await bot.sendMessage(chatId, 'Project deleted successfully! 🗑️');
      } catch (error) {
        console.error('Error:', error);
        await bot.sendMessage(chatId, 'Error deleting project.');
      }
    });

    // Admin Commands
    bot.onText(/\/admin/, (msg) => {
      const chatId = msg.chat.id;
      if (isAdmin(msg.from.id)) {
        bot.sendMessage(chatId, 'Admin commands:\n/addproject\n/deleteproject\n/updateproject');
      }
    });

    // User Commands
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 'Welcome! Available commands:\n/projects\n/help\n/about');
    });

    bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 'Commands list:\n/projects - View projects\n/about - About us');
    });

    // Project Management Commands (Admin only)
    bot.onText(/\/addproject/, async (msg) => {
      const chatId = msg.chat.id;
      if (!isAdmin(msg.from.id)) {
        bot.sendMessage(chatId, 'Permission denied');
        return;
      }
      // Add project logic here
    });

    bot.onText(/\/deleteproject/, async (msg) => {
      const chatId = msg.chat.id;
      if (!isAdmin(msg.from.id)) {
        bot.sendMessage(chatId, 'Permission denied');
        return;
      }
      // Delete project logic here
    });

    // Delete Project Command Handler
    bot.onText(/\/deleteproject (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const projectId = match[1];
    
      try {
        // Check admin permission
        if (!isAdmin(msg.from.id)) {
          await bot.sendMessage(chatId, "⛔ You don't have permission to delete projects");
          return;
        }
    
        // Read current projects
        let projects = await readProjects();
        
        // Check if project exists
        const projectIndex = projects.findIndex(p => p.id === projectId);
        if (projectIndex === -1) {
          await bot.sendMessage(chatId, "❌ Project not found");
          return;
        }
    
        // Remove project
        projects.splice(projectIndex, 1);
        
        // Save updated projects
        await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
        
        // Only send success message after successful save
        await bot.sendMessage(chatId, "Project deleted successfully! 🗑️");
    
      } catch (error) {
        console.error('Delete project error:', error);
        await bot.sendMessage(chatId, "❌ Failed to delete project. Please try again.");
      }
    });

    // Helper function to check admin status
    function isAdmin(userId) {
      const adminIds = process.env.ADMIN_IDS?.split(',').map(id => Number(id)) || [];
      return adminIds.includes(userId);
    }

    // Error Handler
    bot.on('polling_error', (error) => {
      console.error('Bot polling error:', error);
    });

  } catch (error) {
    console.error('Bot initialization error:', error);
  }
}

// Serve static files with correct paths
app.use(express.static(path.join(__dirname, '../../dist')));
app.use('/images', express.static(path.join(__dirname, '../../public/images')));
app.use('/assets', express.static(path.join(__dirname, '../../dist/assets')));
app.use('/public', express.static(path.join(__dirname, '../../public')));

// Webhook endpoint
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Catch all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;
