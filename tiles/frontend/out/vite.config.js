"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const plugin_react_1 = require("@vitejs/plugin-react");
// import eslint from "vite-plugin-eslint";
const vite_1 = require("vite");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    resolve: {
        alias: {
            "@": node_path_1.default.resolve(__dirname, "./src"),
        },
    },
});
