/// <reference types="vite/client" />
/// <reference types="node" />

declare global {
  interface GlobalThis {
    Buffer: typeof import("buffer").Buffer
  }
}

export {}
