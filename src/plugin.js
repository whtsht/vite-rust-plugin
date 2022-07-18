const Watchpack = require("watchpack");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const { spawn, execSync } = require("child_process");

function orDefault(value, defaultValue) {
    return typeof value === "undefined" ? defaultValue : value;
}

class ViteRustPlugin {
    constructor(options) {
        this.crateDir = options.crateDir;
        this.outDir = orDefault(options.outDir, "pkg");
        this.outName = orDefault(options.outName, "index");
        this.profile = orDefault(
            options.profile,
            orDefault(this.profiling(), "--release")
        );
        this.extraArgs = options.extraArgs
            ? options.extraArgs.split(" ")
            : undefined;
        this.watchFiles = [path.resolve(this.crateDir, "Cargo.toml")];
        if (options.extraFiles) this.watchFiles.concat(options.extraFiles);
        this.watchDir = [path.resolve(this.crateDir, "src")];
        if (options.extraDirs) this.watchDir.concat(options.extraDirs);
        this.detailLog = orDefault(options.detailLog, true);

        if (!this.isBuild()) {
            this.wp = new Watchpack();
            this.wp.watch({
                files: this.watchFiles,
                directories: this.watchDir,
                startTime: Date.now() - 10000,
            });
            this.wp.on("change", () => {
                this.compile();
            });
        } else {
            this.compileSync();
        }
    }

    profiling() {
        const s = new Set();
        process.argv.forEach((e) => {
            s.add(e);
        });
        if (s.has("--mode")) {
            if (s.has("development")) {
                return "--dev";
            } else if (s.has("production")) {
                return "--release";
            }
        } else {
            return undefined;
        }
    }

    isBuild() {
        let _isBuild = false;
        process.argv.forEach((e) => {
            if (e === "build") {
                _isBuild = true;
            }
        });
        return _isBuild;
    }

    compileSync() {
        console.log("🦀 Rust & ⚡ Vite = ❤    Compiling...");
        this.createEmpty();
        const options = new Array();
        options.push(
            "build",
            this.crateDir,
            this.profile,
            "--out-dir",
            this.outDir,
            "--out-name",
            this.outName,
            "--target",
            "web"
        );
        if (this.extraArgs) {
            options.push(this.extraArgs);
        }
        execSync("wasm-pack " + options.join(" "));
    }

    compile() {
        console.log("🦀 Rust & ⚡ Vite = ❤    Compiling...");
        this.createEmpty();
        const options = new Array();
        options.push(
            "build",
            this.crateDir,
            this.profile,
            "--out-dir",
            this.outDir,
            "--out-name",
            this.outName,
            "--target",
            "web"
        );
        if (this.extraArgs) {
            options.push(this.extraArgs);
        }
        const sp = spawn("wasm-pack", options);

        sp.stdout.on("data", (data) => {
            if (this.detailLog) process.stdout.write(`${data}`);
        });

        sp.stderr.on("data", (data) => {
            if (this.detailLog) process.stdout.write(`${data}`);
        });

        sp.on("close", (code) => {
            if (code === 0) {
                console.log(chalk.blue("Compilation was successful."));
            } else {
                console.log(chalk.red("Failed to compile."));
                this.createFake();
            }
        });
    }

    createEmpty() {
        const outDir = path.resolve(this.crateDir, this.outDir);
        try {
            fs.mkdirSync(outDir, { recursive: true });
        } catch (e) {
            if (e.code !== "EEXIST") {
                throw e;
            }
        }

        fs.writeFileSync(
            path.join(outDir, this.outName + ".js"),
            'export default function init() { console.log("Now compiling. Please wait..."); }'
        );
    }

    createFake() {
        const outDir = path.resolve(this.crateDir, this.outDir);
        try {
            fs.mkdirSync(outDir, { recursive: true });
        } catch (e) {
            if (e.code !== "EEXIST") {
                throw e;
            }
        }

        fs.writeFileSync(
            path.join(outDir, this.outName + ".js"),
            'export default function init() { console.error("Failed to compile. Fix rust code."); }'
        );
    }
}

module.exports = ViteRustPlugin;
