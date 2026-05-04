import electronLog from "electron-log/renderer";
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
  electronLog.transports.console.level = "info";
  electronLog.transports.ipc.level = "info";

  electronLog.errorHandler.startCatching({
    showDialog: false,
    onError({ error, errorName }) {
      log.error(`[renderer] ${errorName}:`, error);
    }
  });
};

export default log;
