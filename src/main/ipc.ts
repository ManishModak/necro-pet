// The Crypt's messenger - broadcasting whispers to the séance chamber...
import { BrowserWindow } from 'electron';

// The sacred contract for file events
export interface FileEvent {
  type: 'file:changed' | 'file:added';
  path: string;
  timestamp: number;
}

// Registering the IPC handlers - preparing the channels for communication
export const registerIPCHandlers = (): void => {
  console.log('🦇 Opening the channels between realms...');
  
  // Currently no handlers needed from renderer to main
  // This function is here for future expansion when the renderer needs to send messages
  
  // Example handler structure (commented out for now):
  // ipcMain.handle('some-channel', async (event, arg) => {
  //   return 'response';
  // });
};

// Broadcasting file events to all windows in the séance chamber
export const sendFileEvent = (event: FileEvent): void => {
  const allWindows = BrowserWindow.getAllWindows();
  
  if (allWindows.length === 0) {
    console.warn('🦇 No windows to haunt with this event:', event);
    return;
  }
  
  // Determining which channel to use based on event type
  const channel = event.type;
  
  // Broadcasting to all windows (though we typically only have one)
  allWindows.forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send(channel, event);
      console.log(`🦇 Whispered ${event.type} to the séance chamber:`, event.path);
    }
  });
};
