// Summoning the window from the digital void...
import { BrowserWindow, screen } from 'electron';
import path from 'path';

// The configuration scroll for our haunted window
export interface WindowConfig {
  width: number;
  height: number;
  transparent: boolean;
  frame: boolean;
  alwaysOnTop: boolean;
  skipTaskbar: boolean;
  x?: number;
  y?: number;
}

// Conjuring the main window with dark magic
export const createMainWindow = (): BrowserWindow => {
  const config: WindowConfig = {
    width: 320,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
  };

  const mainWindow = new BrowserWindow({
    ...config,
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
            ? // Development mode - allow hot reload and dev tools
              "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: wss:;"
            : // Production mode - strict security
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
        ]
      }
    });
  });

  // Loading the séance chamber...
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

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
