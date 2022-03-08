const Watchpack = require('watchpack');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { resolve } = require('path');

class ViteRustPlugin {
    constructor(options) {
        this.crateDir = options.crateDir;
        this.outDir = options.outDir || 'pkg';
        this.outName = options.outName || 'index';
        this.profile = options.profile || this.profiling() || '--release';
        this.target = options.target || 'web';
        this.extraArgs = options.extraArgs
            ? options.extraArgs.split(' ')
            : undefined;
        this.watchFiles = [path.resolve(this.crateDir, 'Cargo.toml')];
        if (options.extraFiles) this.watchFiles.concat(options.extraFiles);
        this.watchDir = [path.resolve(this.crateDir, 'src')];
        if (options.extraDirs) this.watchDir.concat(options.extraDirs);

        if (!this.isBuild()) {
            this.wp = new Watchpack();

            this.wp.watch({
                files: this.watchFiles,
                directories: this.watchDir,
                startTime: Date.now() - 10000,
            });

            this.wp.on('change', () => {
                this.compile();
            });
        }
        this.compile();
    }

    profiling() {
        const s = new Set();
        process.argv.forEach((e) => {
            s.add(e);
        });
        if (s.has('--mode')) {
            if (s.has('development')) {
                return '--dev';
            } else if (s.has('production')) {
                return '--release';
            }
        } else {
            return undefined;
        }
    }

    isBuild() {
        let _isBuild = false;
        process.argv.forEach((e) => {
            if (e === 'build') {
                _isBuild = true;
            }
        });
        return _isBuild;
    }

    compile() {
        const options = new Array();
        options.push(
            'build',
            this.crateDir,
            this.profile,
            '--out-dir',
            this.outDir,
            '--out-name',
            this.outName,
            '--target',
            this.target
        );
        if (this.extraArgs) {
            options.push(this.extraArgs);
        }
        const sp = spawn('wasm-pack', options);

        sp.stdout.on('data', (data) => {
            process.stdout.write(`${data}`);
        });

        sp.stderr.on('data', (data) => {
            process.stdout.write(`${data}`);
        });

        sp.on('error', (error) => {
            process.stdout.write(`${error.message}`);
        });

        sp.on('close', (code) => {
            if (code === 0) {
                console.log(chalk.blue('Compilation was successful.'));
            } else {
                console.log(chalk.red('Failed to compile.'));
            }
        });
    }
}

module.exports = ViteRustPlugin;
