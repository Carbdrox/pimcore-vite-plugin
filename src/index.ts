import fs from 'fs';
import {ConfigEnv, Plugin, UserConfig, ViteDevServer} from 'vite'

export interface PluginConfig {
    input: string[] | {[key: string]: string}
}

export default function pimcore(pluginConfig: PluginConfig): Plugin {
    return {
        name: 'pimcore',
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
        configureServer(server: ViteDevServer) {
            const serveFile = 'public/vite-serve';

            server.httpServer?.once('listening', () => {
                fs.writeFileSync(serveFile, 'vite-serve');

                //timeout needed, so that the Log is written at the end..
                setTimeout(() => {
                    server.config.logger.info(`\n Pimcore plugin`);
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
    }
}
