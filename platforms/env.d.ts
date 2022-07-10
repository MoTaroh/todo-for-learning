/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly APP_HOST: string;
  }
}
