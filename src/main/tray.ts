import { BrowserWindow, nativeImage, Tray } from "electron";
import { GlobalEventEnum } from "@share/enum";
import icon from "../../resources/icon.png?asset";
import { createWindow } from "./window";

let tray: Tray | null = null;
let menuWin: BrowserWindow | null = null;
let isPlaying = false;

function getTrayIcon(): Electron.NativeImage {
  const image = nativeImage.createFromPath(icon);
  if (process.platform === "darwin") {
    return image.resize({ width: 16, height: 16 });
  }
  return image;
}

function createTrayMenuWindow() {
  menuWin = createWindow(
    "trayMenu",
    {
      width: 200,
      height: 296,
      show: false,
      frame: false,
      transparent: true,
      resizable: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      focusable: true,
      hasShadow: false
    },
    {
      disabledReadyToShow: true
    }
  );
  menuWin.on("blur", () => {
    if (menuWin && !menuWin.isDestroyed()) {
      menuWin.hide();
    }
  });
  menuWin.webContents.on("did-finish-load", () => {
    menuWin?.webContents.send(GlobalEventEnum.TrayPlayingChanged, isPlaying);
  });
}

export const createTray = (): void => {
  tray = new Tray(getTrayIcon());
  tray.setToolTip("Electron Player");
  createTrayMenuWindow();
  tray.on("right-click", (_event, bounds) => {
    if (!menuWin) {
      return;
    }
    const info = menuWin.getBounds();

    menuWin.setPosition(bounds.x - (info.width - 10), bounds.y - (info.height - 10), false);
    menuWin.show();
  });

  tray.on("double-click", () => {
    for (const win of BrowserWindow.getAllWindows()) {
      if (win === menuWin) continue;
      if (win.isMinimized()) {
        win.restore();
      }
      win.show();
      win.focus();
    }
  });
};

export const setTrayPlaying = (playing: boolean): void => {
  isPlaying = playing;
  if (menuWin && !menuWin.isDestroyed()) {
    menuWin.webContents.send(GlobalEventEnum.TrayPlayingChanged, playing);
  }
};
