import electronLog from "electron-log/main";
import { app } from "electron";
import { wrapLogFn } from "@share/logger";

const log = {
  ...electronLog,
  error: wrapLogFn(electronLog.error.bind(electronLog)),
  warn: wrapLogFn(electronLog.warn.bind(electronLog)),
  info: wrapLogFn(electronLog.info.bind(electronLog)),
  verbose: wrapLogFn(electronLog.verbose.bind(electronLog)),
  debug: wrapLogFn(electronLog.debug.bind(electronLog)),
  silly: wrapLogFn(electronLog.silly.bind(electronLog))
} as typeof electronLog;

export const initLogger = () => {
  electronLog.initialize({ preload: true });

  electronLog.transports.file.level = "info";
  electronLog.transports.file.maxSize = 10485760;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  electronLog.transports.file.fileName = `${y}-${m}-${d}.log`;
  electronLog.transports.console.level = "debug";
  electronLog.transports.ipc.level = "info";

  electronLog.errorHandler.startCatching({
    showDialog: false,
    onError({ error, errorName, processType }) {
      log.error(`[${processType}] ${errorName}:`, error);
    }
  });

  electronLog.eventLogger.startLogging({
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
