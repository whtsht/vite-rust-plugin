# vite-rust-plugin

Vite plugin for Rust

## Requirement

You need [wasm-pack](https://github.com/rustwasm/wasm-pack) for Rust compile to WebAssembly.

## Install

```sh
npm install --save-dev vite-rust-plugin
```

## Usage

vite.config.js

```js
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
```

Start dev server

```sh
vite --open
```

Build for production

```sh
vite build
```

## Template

You can use [vite-wasm-template](https://github.com/dfjk0/vite-wasm-template).

Execute the following command.

```sh
git clone https://github.com/dfjk0/vite-wasm-template
cd vite-wasm-template
npm install
npm run dev
```
