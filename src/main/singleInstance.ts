import { app } from "electron";

export const initSingleInstance = (action: () => void) => {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", () => {
      action();
    });
  }
};
