import { Buffer as BufferPolyfill } from "buffer"

import React from "react"

import ReactDOM from "react-dom/client"

import App from "./app"

globalThis.Buffer = BufferPolyfill

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
