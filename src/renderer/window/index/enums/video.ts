export enum VideoEvent {
  Play = "play",
  Pause = "pause",
  Timeupdate = "timeupdate",
  Loadedmetadata = "loadedmetadata",
  ActiveChange = "activeChange"
}

export enum MethodName {
  GetDuration = "getDuration",
  Play = "play",
  Pause = "pause",
  TogglePlay = "togglePlay",
  Seek = "seek",
  GetCurrentTime = "getCurrentTime",
  SetSpeed = "setSpeed",
  GetSpeed = "getSpeed",
  GetPaused = "getPaused"
}
