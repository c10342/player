import log from "electron-log/renderer";

log.transports.console.level = "info";
log.transports.ipc.level = "info";

log.errorHandler.startCatching({
  showDialog: false,
  onError({ error, errorName }) {
    log.error(`[renderer] ${errorName}:`, error);
  }
});

export default log;
