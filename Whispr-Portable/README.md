# Whispr Personal AI Chatbot - Portable Version

## 🚀 How to Run

### Option 1: Double-click the Launcher
- **Windows**: Double-click `Launch-Whispr.bat`
- **PowerShell**: Right-click `Launch-Whispr.ps1` → "Run with PowerShell"

### Option 2: Manual Start
1. Open Command Prompt or PowerShell in this folder
2. Run: `npm start`

## ⚙️ Requirements

- **Node.js** (v16 or higher) must be installed on your system
- **Internet connection** for AI functionality

## 🔧 Setup

1. Make sure your `.env` file contains:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

2. If dependencies are missing, run:
   ```
   npm install
   ```

## 🎮 Usage

- **Global Hotkey**: Press `Ctrl+L` to show/hide the chatbot
- **System Tray**: Click the tray icon to toggle visibility
- **Close**: Right-click tray icon → "Quit"

## 📁 What's Included

- `main.js` - Main Electron process
- `preload.js` - Security bridge
- `build/` - React app files
- `src/Image/` - App icons
- `.env` - Environment variables (your API key)
- `package.json` - Dependencies
- Launcher scripts

## 🔒 Security

Your API key is stored only in the `.env` file and never hardcoded.

## 🐛 Troubleshooting

- **"Cannot find module"**: Run `npm install`
- **"API key not found"**: Check your `.env` file
- **Port 3000 in use**: Close other development servers
- **Window not showing**: Press `Ctrl+L` or check system tray

---

**Whispr Personal AI Chatbot v1.0**  
Created by Asnari Pacalna 