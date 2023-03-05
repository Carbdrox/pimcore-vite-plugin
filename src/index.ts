import fs from 'fs';
import Colorize from "./colorize";
import {ConfigEnv, Plugin, UserConfig, ViteDevServer} from 'vite';

export interface PluginConfig {
    input: string[] | {[key: string]: string}
}

export default function pimcore(pluginConfig: PluginConfig): Plugin {
    return {
        name: 'pimcore',
        enforce: 'post',
        config: (config: UserConfig, env: ConfigEnv) => ({
            base: '',
            publicDir: false,
            build: {
                manifest: true,
                target: 'es2019',
                outDir:'public/build',
                rollupOptions: {
                    input: pluginConfig.input
                }
            }
        }),
        configureServer: configureServer,
    };
}

function pimcoreVersion(): string {
    try {
        const lockData = fs.readFileSync('composer.lock');

        return JSON.parse(lockData.toString())
            ?.packages
            ?.find((packageData: {[key: string]: string}) => packageData.name === 'pimcore/pimcore')
            ?.version ?? '';
    }
    catch {
        return '';
    }
}

function pluginVersion(): string {
    try {
        const lockData = fs.readFileSync('package-lock.json');
        const packages = JSON.parse(lockData.toString())?.packages as {[key: string]: any};
        const packageKey = 'node_modules/@carbdrox/pimcore-vite-plugin';

        if (!packages.hasOwnProperty(packageKey)) {
            return '';
        }

        return packages[packageKey]?.version ?? '';
    }
    catch {
        return '';
    }
}

function configureServer(server: ViteDevServer) {
    const serveFile = 'public/vite-serve';

    server.httpServer?.once('listening', () => {
        fs.writeFileSync(serveFile, 'vite-serve');

        //timeout needed, so that the Log is written at the end..
        setTimeout(() => {
            server.config.logger.info(
                `\n  ${Colorize.purple(Colorize.bold('PIMCORE') + ' ' + pimcoreVersion())}`
                + `  ${Colorize.grey('plugin v' + pluginVersion())}`
            );

        }, 100);
    });

    process.on('SIGTERM', process.exit);
    process.on('SIGHUP', process.exit);
    process.on('SIGINT', process.exit);
    process.on('exit', () => {
        if (!fs.existsSync(serveFile)) {
            return;
        }
        fs.rmSync(serveFile);
    });
}


