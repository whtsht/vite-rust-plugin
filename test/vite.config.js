import { defineConfig } from 'vite';
import ViteRustPlugin from 'vite-rust-plugin';

export default defineConfig({
    base: './',
    plugins: [
        new ViteRustPlugin({
            crateDir: './rust',
            extraArgs: '--no-typescript',
        }),
    ],
});
