/// <reference types="vite/client" />

interface ImportMetaEnv {
  // api请求路径
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
