/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly STORYBOOK: boolean;
  readonly VITEST: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
