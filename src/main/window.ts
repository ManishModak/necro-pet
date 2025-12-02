// Summoning the window from the digital void...
import { BrowserWindow, screen, app } from 'electron';
import path from 'path';

// The configuration scroll for our haunted window
export interface WindowConfig {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  transparent: boolean;
  frame: boolean;
  alwaysOnTop: boolean;
  skipTaskbar: boolean;
  resizable: boolean;
  show: boolean;
  x?: number;
  y?: number;
}

// Conjuring the main window with dark magic
export const createMainWindow = (): BrowserWindow => {
  const config: WindowConfig = {
    width: 480,
    height: 520,
    minWidth: 400,   // Minimum width to keep the crypt usable
    minHeight: 400,  // Minimum height to keep the pet visible
    transparent: false, // Disabled for proper resize support on Windows
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: false, // Show in taskbar so users can find it!
    resizable: true,    // Allow mortals to resize the crypt
    show: false, // Don't show until ready
  };

  const mainWindow = new BrowserWindow({
    ...config,
    backgroundColor: '#0d1a0d', // Crypt dark background
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Position the window in the bottom-right corner of the screen
  positionWindowBottomRight(mainWindow);

  // Setting up Content Security Policy - protecting against malevolent spirits
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          process.env.VITE_DEV_SERVER_URL
            ? // Development mode - allow hot reload, dev tools, and weather API
              "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: wss: https://api.open-meteo.com;"
            : // Production mode - allow weather API
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.open-meteo.com;"
        ]
      }
    });
  });

  // Loading the séance chamber...
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // Production: resolve path relative to app location
    // In packaged app, __dirname is inside app.asar, so use app.getAppPath()
    const basePath = app.isPackaged 
      ? path.join(process.resourcesPath, 'app.asar')
      : path.join(__dirname, '..');
    const indexPath = path.join(basePath, 'dist', 'index.html');
    console.log('🦇 Loading séance chamber from:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  // Ensure the window manifests in the mortal realm
  mainWindow.once('ready-to-show', () => {
    console.log('🦇 Window ready to show, manifesting...');
    mainWindow.show();
    mainWindow.focus();
  });

  return mainWindow;
};

// Positioning the window in the bottom-right corner, like a lurking shadow
export const positionWindowBottomRight = (window: BrowserWindow): void => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  const [windowWidth, windowHeight] = window.getSize();

  // Calculate position with a 20px margin from edges
  const margin = 20;
  const x = screenWidth - windowWidth - margin;
  const y = screenHeight - windowHeight - margin;

  window.setPosition(x, y);
};
