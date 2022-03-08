import { defineConfig } from "vite";
import ViteRustPlugin from "vite-rust-plugin";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  base: "./",
  plugins: [
    new ViteRustPlugin({
      crateDir: "./rust",
      extraArgs: "--no-typescript",
    }),
    createHtmlPlugin({ minify: true }),
  ],
});
