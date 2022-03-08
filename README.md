# vite-rust-plugin

Vite plugin for Rust

## Requirement

You need [wasm-pack](https://github.com/rustwasm/wasm-pack) for Rust compile to WebAssembly.

## Install

```sh
npm install --save-dev vite-rust-plugin
```

## Usage

### 1. Creating cargo in your project

```sh
cargo new rust --lib
```

Add the following to Cargo.toml.

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "^0.2"
```

src/lib.rs

```rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen(start)]
pub fn start() {
    log("hello wasm :)");
}
```

### 2. Setting vite.config.js

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

### 3. Setting index.html

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
    </head>

    <body>
        <div id="app"></div>
        <h1>Hello</h1>
        <script type="module">
            import init from './rust/pkg';
            (async function () {
                await init();
            })();
        </script>
    </body>
</html>
```

### 4. Start dev server

```sh
vite --open
```

### 5. Build for production

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
