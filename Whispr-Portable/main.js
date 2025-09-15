// Load environment variables with better path handling
const path = require("path");

// Try multiple paths for .env file
const possibleEnvPaths = [
  path.join(__dirname, '../.env'),                    // Development
  path.join(__dirname, '.env'),                       // Same directory as main.js
  path.join(process.cwd(), '.env'),                   // Project root
  path.join(process.resourcesPath || __dirname, '.env') // Production resources
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  try {
    require('dotenv').config({ path: envPath });
    if (process.env.GOOGLE_API_KEY) {
      console.log(`Environment loaded from: ${envPath}`);
      envLoaded = true;
      break;
    }
  } catch (e) {
    // Continue to next path
  }
}

if (!envLoaded) {
  console.log("No .env file found in any of the expected locations");
}

const {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  Menu,
  screen,
  ipcMain,
} = require("electron");
const isDev = process.env.ELECTRON_IS_DEV === "true" || !app.isPackaged;

let mainWindow = null;
let tray = null;
let isWindowVisible = false;

function createWindow() {
  // Get the primary display's work area
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } =
    primaryDisplay.workAreaSize;

  // Window dimensions
  const windowWidth = 400;
  const windowHeight = 600;

  // Position window at bottom right
  const x = screenWidth - windowWidth - 20;
  const y = screenHeight - windowHeight - 40;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: x,
    y: y,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    show: true, // Show window on startup
    skipTaskbar: true,
    icon: path.join(__dirname, "../src/Image/Whispr-no-bg.png"), // Add custom icon
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false, // Disable web security for development
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load the app with graceful fallback
  const devUrl = "http://localhost:3000";
  const fileUrl = `file://${path.join(__dirname, "../build/index.html")}`;
  const targetUrl = isDev ? devUrl : fileUrl;

  mainWindow.loadURL(targetUrl);

  // If dev server is not running, fall back to local build automatically
  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDesc) => {
    console.log("Primary load failed:", errorCode, errorDesc, "— falling back to local build");
    if (targetUrl !== fileUrl) {
      mainWindow.loadURL(fileUrl);
    }
  });

  // Hide window instead of closing
  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      hideWindow();
    }
  });

  // Handle window events
  mainWindow.on("blur", () => {
    // Optional: Hide window when it loses focus
    // hideWindow();
  });

  // Don't auto-open dev tools
  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }

  // Set the window as visible on startup
  isWindowVisible = true;
}

function showWindow() {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    isWindowVisible = true;
  }
}

function hideWindow() {
  if (mainWindow) {
    mainWindow.hide();
    isWindowVisible = false;
  }
}

function toggleWindow() {
  if (isWindowVisible) {
    hideWindow();
  } else {
    showWindow();
  }
}

function createTray() {
  try {
    const { nativeImage } = require("electron");

    // Try to use custom icon, fallback to simple icon if it fails
    let icon;
    try {
      icon = nativeImage.createFromPath(path.join(__dirname, "../src/Image/Whispr-no-bg.png"));
      // Resize for tray (16x16)
      icon = icon.resize({ width: 16, height: 16 });
    } catch (error) {
      // Fallback to simple blue square icon
      icon = nativeImage.createFromDataURL(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAAB5JREFUOJFj/P//P8NAAiaGUQNGDRg1gHIwasCoAYQBAF8QIAOk8LHhAAAAAElFTkSuQmCC"
      );
    }

    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show/Hide Chatbot",
        click: toggleWindow,
      },
      {
        type: "separator",
      },
      {
        label: "Quit",
        click: () => {
          app.isQuiting = true;
          app.quit();
        },
      },
    ]);

    tray.setToolTip("Desktop Chatbot");
    tray.setContextMenu(contextMenu);

    // Show/hide on tray click
    tray.on("click", toggleWindow);
  } catch (error) {
    console.log("Tray creation failed:", error.message);
  }
}

function registerGlobalShortcuts() {
  // Register Ctrl+L to toggle window
  const ret = globalShortcut.register("CommandOrControl+L", () => {
    toggleWindow();
  });

  if (!ret) {
    console.log("Global shortcut registration failed");
  } else {
    console.log("Global shortcut Ctrl+L registered successfully");
  }
}

// AI Integration
const MODEL_PREFERENCE = [
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash",
  "gemini-1.5-pro"
];

let genAIClient = null;
let currentModelName = MODEL_PREFERENCE[0];

async function initializeAI() {
  try {
    console.log("Loading Google Generative AI library...");
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    // Store API key from environment variable
    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!API_KEY) {
      console.error("GOOGLE_API_KEY environment variable not set");
      return null;
    }

    if (!API_KEY) {
      console.error("No API key provided");
      return null;
    }

    console.log("API key found, initializing Google AI client...");
    console.log("API key starts with:", API_KEY.substring(0, 10) + "...");
    console.log("Running in production:", !isDev);
    console.log("App path:", app.getAppPath());
    console.log("Resources path:", process.resourcesPath || "not available");

    // Initialize the Google AI client
    genAIClient = new GoogleGenerativeAI(API_KEY);

    console.log("Getting Gemini model...");
    // Get the Gemini model (using the preferred model name)
    currentModelName = MODEL_PREFERENCE[0];
    const model = genAIClient.getGenerativeModel({ model: currentModelName });

    console.log("AI model initialized successfully");
    return model;
  } catch (error) {
    console.error("Failed to initialize AI:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return null;
  }
}

let aiModel = null;
// In-memory lightweight conversation history (last 8 turns)
let conversationHistory = [];
const MAX_TURNS_TO_KEEP = 8;

// IPC handlers
function setupIPC() {
  // Handle AI message requests
  ipcMain.handle("ai-message", async (event, message) => {
    try {
      if (!aiModel) {
        console.log("Initializing AI model...");
        aiModel = await initializeAI();
      }

      if (!aiModel) {
        console.error("AI model initialization failed");
        throw new Error("AI model not available");
      }

      console.log("Sending message to AI:", message.substring(0, 50) + "...");

      // Build short conversation memory (last few exchanges)
      const historyText = conversationHistory
        .slice(-MAX_TURNS_TO_KEEP)
        .map((turn, index) => `${index + 1}. User: ${turn.user}\n   Assistant: ${turn.assistant}`)
        .join("\n");

      // Guardrails to reduce repetition and introductions every turn
      const behaviorRules = `
You are Whispr, a friendly, concise desktop AI assistant.
- Do not repeat introductions or bios in each reply.
- Only mention being created by Asnari Pacalna when explicitly asked.
- Avoid repeating sentences from your previous reply.
- Prefer direct, specific answers. Keep greetings minimal and only on the first turn.
- When helpful, ask one brief follow-up question to clarify needs, but not every time.
- Vary your word choice across turns to avoid sounding repetitive.
- Use markdown formatting sparingly and only when it improves readability.
`;

      const prompt = `CONVERSATION CONTEXT (last ${Math.min(
        conversationHistory.length,
        MAX_TURNS_TO_KEEP
      )} turns):\n${historyText || "(no prior context)"}\n\n${behaviorRules}\n\nUser message: ${message}\n\nProvide your best answer now:`;

      // Retry for transient errors (503/overloaded) with exponential backoff and model fallback
      async function generateWithRetry(maxRetries = 3) {
        let attempt = 0;
        let lastError = null;
        let modelIndex = MODEL_PREFERENCE.indexOf(currentModelName);
        while (attempt <= maxRetries) {
          try {
            const result = await aiModel.generateContent(prompt);
            return await result.response;
          } catch (err) {
            lastError = err;
            const msg = String(err?.message || "");
            if (msg.includes("503") || msg.toLowerCase().includes("overloaded") || msg.includes("unavailable")) {
              // Try switching to a fallback model first
              if (genAIClient && modelIndex + 1 < MODEL_PREFERENCE.length) {
                modelIndex += 1;
                currentModelName = MODEL_PREFERENCE[modelIndex];
                console.log(`Switching to fallback model: ${currentModelName}`);
                aiModel = genAIClient.getGenerativeModel({ model: currentModelName });
              } else {
                const delayMs = Math.min(1500 * Math.pow(2, attempt), 6000);
                console.log(`AI overloaded, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(r => setTimeout(r, delayMs));
                attempt += 1;
              }
              continue;
            }
            throw err;
          }
        }
        throw lastError;
      }

      const response = await generateWithRetry(3);
      let text = response.text();

      // Post-process to strip repetitive intros after the first turn
      if (conversationHistory.length > 0) {
        const lines = text.split(/\r?\n/);
        const filtered = lines.filter((line, idx) => {
          if (idx === 0 && /\b(i\'m|i am)\s+whispr\b/i.test(line)) return false;
          if (/created by\s+asnari\s+pacalna/i.test(line)) return false;
          return true;
        });
        text = filtered.join("\n").trim();
      }

      console.log("AI response received successfully");

      // Update conversation history
      conversationHistory.push({ user: message, assistant: text });
      if (conversationHistory.length > MAX_TURNS_TO_KEEP) {
        conversationHistory = conversationHistory.slice(-MAX_TURNS_TO_KEEP);
      }

      return text;
    } catch (error) {
      console.error("Detailed AI error:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code
      });
      
      // Return more specific error messages
      if (error.message.includes("API key")) {
        throw new Error("Invalid API key - please check your Google AI API key");
      } else if (error.message.includes("quota")) {
        throw new Error("API quota exceeded - please check your Google Cloud billing");
      } else if (error.message.includes("permission")) {
        throw new Error("API permission denied - please enable Gemini API in Google Cloud Console");
      } else if (error.code === "ENOTFOUND" || error.message.includes("network")) {
        throw new Error("Network error - please check your internet connection");
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
  });

  // Handle window control
  ipcMain.on("close-window", () => {
    app.isQuiting = true;
    app.quit();
  });

  ipcMain.on("minimize-window", () => {
    hideWindow();
  });
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createTray();
  registerGlobalShortcuts();
  setupIPC();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // Don't quit the app when all windows are closed (keep running in tray)
  // The app will only quit when explicitly requested from tray menu
});

app.on("will-quit", () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

app.on("before-quit", () => {
  app.isQuiting = true;
});

// Handle app activation (macOS)
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    showWindow();
  }
});

// Security: Prevent new window creation
app.on("web-contents-created", (event, contents) => {
  contents.on("new-window", (event, navigationUrl) => {
    event.preventDefault();
  });
});
