import fs from 'fs';
import Colorize from "./colorize";
import fullReload from 'vite-plugin-full-reload';
import {loadEnv, ConfigEnv, Plugin, PluginOption, UserConfig, ViteDevServer} from 'vite';

export interface PluginConfig {
    input: string[] | {[key: string]: string};
    reload: boolean | string | string[];
}

export default function pimcore(pluginConfig: PluginConfig): Plugin[] {
    return [
        {
            name: 'pimcore',
            enforce: 'post',
            config: (config: UserConfig, env: ConfigEnv) => compileConfiguration(pluginConfig, config, env),
            configureServer: configureServer,
        },
        getReloadPlugin(pluginConfig) as Plugin
    ];
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

function compileConfiguration(pluginConfig: PluginConfig, userConfig: UserConfig, configEnv: ConfigEnv): UserConfig {
    const env = loadEnv(configEnv.mode, userConfig?.envDir ?? process.cwd(), '');
    const host = env.APP_URL ?? 'localhost';
    const secure = env.VITE_SECURE == 'true' ?? false;

    return {
        base: userConfig?.base ?? '',
        publicDir: userConfig?.publicDir ?? false,
        build: {
            manifest: userConfig?.build?.manifest ?? true,
            target: userConfig?.build?.target ?? 'es2019',
            outDir:  userConfig?.build?.outDir ??'public/build',
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
            port: userConfig?.server?.port ?? 5173,
            strictPort: userConfig?.server?.strictPort ?? true,
            hmr: userConfig?.server?.hmr ?? { host }
        }
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

    if (typeof Array.isArray(pluginConfig.reload)) {
        reloadPaths = reloadPaths.concat(pluginConfig.reload as string[]);
    }

    return fullReload(reloadPaths);
}
