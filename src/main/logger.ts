import log from "electron-log/main";
import { app } from "electron";

export const initLogger = () => {
  log.initialize({ preload: true });

  log.transports.file.level = "info";
  log.transports.file.maxSize = 10485760;
  log.transports.console.level = "debug";
  log.transports.ipc.level = "info";

  log.errorHandler.startCatching({
    showDialog: false,
    onError({ error, errorName, processType }) {
      log.error(`[${processType}] ${errorName}:`, error);
    }
  });

  log.eventLogger.startLogging({
    level: "warn",
    scope: "electron"
  });

  log.info("========== Application started ==========");
  log.info(`App: ${app.getName()} v${app.getVersion()}`);
  log.info(`Electron: ${process.versions.electron}`);
  log.info(`Chrome: ${process.versions.chrome}`);
  log.info(`Node: ${process.versions.node}`);
  log.info(`OS: ${process.platform} ${process.getSystemVersion()}`);
  log.info("==========================================");
};

export default log;
