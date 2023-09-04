import fs from 'fs';
import Colorize from "./colorize";
import fullReload from 'vite-plugin-full-reload';
import {viteStaticCopy, Target} from 'vite-plugin-static-copy';
import {loadEnv, ConfigEnv, Plugin, PluginOption, UserConfig, ViteDevServer, HmrOptions} from 'vite';

export interface PluginConfig {
    input: string[] | { [key: string]: string };
    reload?: boolean | string | string[];
    copy?: Target | Target[];
}

export default function pimcore(pluginConfig: PluginConfig): Plugin[] {
    return [
        {
            name: 'pimcore',
            enforce: 'post',
            config: (config: UserConfig, env: ConfigEnv) => compileConfiguration(pluginConfig, config, env),
            configureServer: configureServer,
        },
        getReloadPlugin(pluginConfig) as Plugin,
        getStaticCopyPlugin(pluginConfig) as Plugin
    ];
}

function pimcoreVersion(): string {
    try {
        const lockData = fs.readFileSync('composer.lock');

        return JSON.parse(lockData.toString())
            ?.packages
            ?.find((packageData: { [key: string]: string }) => packageData.name === 'pimcore/pimcore')
            ?.version ?? '';
    } catch {
        return '';
    }
}

function pluginVersion(): string {
    try {
        const lockData = fs.readFileSync('package-lock.json');
        const packages = JSON.parse(lockData.toString())?.packages as { [key: string]: any };
        const packageKey = 'node_modules/pimcore-vite-plugin';

        if (!packages.hasOwnProperty(packageKey)) {
            return '';
        }

        return packages[packageKey]?.version ?? '';
    } catch {
        return '';
    }
}

function compileConfiguration(pluginConfig: PluginConfig, userConfig: UserConfig, configEnv: ConfigEnv): UserConfig {
    const env = loadEnv(configEnv.mode, userConfig?.envDir ?? process.cwd(), '');
    const host = env.APP_URL ?? 'localhost';
    const port = parseInt(env.VITE_PORT ?? '5173');
    const secure = env.VITE_SECURE == 'true' ?? false;
    const hmrOptions: HmrOptions = { host };

    if (env.VITE_HMR_SECURE == 'true' || (!env.hasOwnProperty('VITE_HMR_SECURE') && env.VITE_SECURE == 'true')) {
        hmrOptions['protocol'] = 'wss';
    }


    return {
        base: userConfig?.base ?? '',
        publicDir: userConfig?.publicDir ?? false,
        build: {
            manifest: userConfig?.build?.manifest ?? true,
            target: userConfig?.build?.target ?? 'es2019',
            outDir: userConfig?.build?.outDir ?? 'public/build',
            cssCodeSplit: userConfig?.build?.cssCodeSplit ?? true,
            rollupOptions: {
                input: pluginConfig?.input ?? []
            }
        },
        resolve: {
            alias: userConfig?.resolve?.alias ?? {
                '@': '/assets'
            }
        },
        optimizeDeps: {
            force: userConfig?.optimizeDeps?.force ?? true
        },
        server: {
            https: userConfig?.server?.https ?? secure,
            host: userConfig?.server?.host ?? host,
            port: userConfig?.server?.port ?? port,
            strictPort: userConfig?.server?.strictPort ?? true,
            hmr: userConfig?.server?.hmr ?? hmrOptions
        }
    }
}

function configureServer(server: ViteDevServer) {
    const serveFile = 'public/vite-serve';
    const serverConfig = server.config.server;
    const host = typeof serverConfig?.hmr === 'object' ? serverConfig?.hmr?.host : serverConfig.host ?? 'localhost';

    let protocol = serverConfig.https ? 'https' : 'http';
    if (typeof serverConfig.hmr === 'object' && serverConfig.hmr.hasOwnProperty('protocol') && serverConfig.hmr.protocol === 'wss') {
        protocol = 'https';
    }

    const url = `${protocol}://${host}`;

    server.httpServer?.once('listening', () => {
        fs.writeFileSync(serveFile, url + `:${serverConfig.port ?? 5173}`);

        //timeout needed, so that the Log is written at the end..
        setTimeout(() => {
            server.config.logger.info(
                `\n  ${Colorize.purple(Colorize.bold('PIMCORE') + ' ' + pimcoreVersion())}`
                + `  ${Colorize.grey('plugin v' + pluginVersion())}`
            );
            server.config.logger.info('');
            server.config.logger.info(`  ${Colorize.purple('➜')}  `
                + `${Colorize.grey(Colorize.bold('App'))}:     ${Colorize.cyan(url)}`);
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

function getReloadPlugin(pluginConfig: PluginConfig): PluginOption {

    let reloadPaths = [
        'assets/**/*.js',
        'assets/**/*.scss',
        'templates/**/*.twig',
        'src/Resources/views/**/*.twig',
    ];

    if (!pluginConfig.hasOwnProperty('reload')) {
        return fullReload(reloadPaths);
    }

    if (typeof pluginConfig.reload === 'boolean' && !pluginConfig.reload) {
        return null;
    }

    if (typeof pluginConfig.reload === 'string' && !!pluginConfig.reload) {
        reloadPaths.push(pluginConfig.reload);
    }

    if (Array.isArray(pluginConfig.reload)) {
        reloadPaths = reloadPaths.concat(pluginConfig.reload as string[]);
    }

    return fullReload(reloadPaths);
}

function getStaticCopyPlugin(pluginConfig: PluginConfig): PluginOption {

    if (!pluginConfig.hasOwnProperty('copy') || !pluginConfig.copy) {
        return null;
    }

    return viteStaticCopy(
        {
            targets: Array.isArray(pluginConfig.copy) ? pluginConfig.copy : [pluginConfig.copy]
        }
    );
}
