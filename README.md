# Pimcore Vite Plugin

<a href="https://www.npmjs.com/package/pimcore-vite-plugin"><img src="https://img.shields.io/npm/dt/pimcore-vite-plugin" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/pimcore-vite-plugin"><img src="https://img.shields.io/npm/v/pimcore-vite-plugin" alt="Latest Stable Version"></a>
<a href="https://www.npmjs.com/package/pimcore-vite-plugin"><img src="https://img.shields.io/npm/l/pimcore-vite-plugin" alt="License"></a>

This plugin configures Vite for use within a [Pimcore](https://github.com/pimcore/pimcore) project.

## Installation

### Using npm

```
npm i -D pimcore-vite-plugin --save
```

## Usage

Add it to yout plugins inside your `vite.config.js`

```js
import {defineConfig} from 'vite';
import Pimcore from 'pimcore-vite-plugin';

export default defineConfig({
    plugins: [
        Pimcore({
            input: 'assets/scss/app.scss'
        })
    ],
});
```

To see which configuration options are available, check the section [Configuration](#configuration).  
If you dont plan to specify your own host, port, https inside the server section of the object passed to defineConfig,
the Plugin will use its default values `localhost`, `5173` and `false`.
The recommended way to overwrite these Values is by setting environment variables inside your .env file.  
The possible environment variables are:

| ENV Variable | Used for                                                | default   |
|--------------|---------------------------------------------------------|-----------|
| APP_URL      | The host under which the development page is accessible | localhost |
| VITE_PORT    | The port under which the development page is accessible | 5173      |
| VITE_SECURE  | If the development page is accessible via https or http | false     |

To use this Plugin it is required to create a twig helper inside your Pimcore project, which gets the right files.  
If running in dev-mode your assets can be loaded under `{http | https}://{host}:{port}/FILE`.  
You can see that you running in dev-mode by checking if the file public/vite-serve exists.

The built assets are located in public/build/** without further configuration. The exact position of the file can be
found in public/build/manifest.json.

It is highly recommended using our pimcore-vite-bundle to add this functionality.  
You can find it here ..PACKAGE_URL TO BE DONE.., and install it with `composer require ..`.

## Configuration

The following options can be provided:

- `input`
  The Files which are processed by vite.   
  You can either pass a string, an array of strings or an object.  
  If you pass an object, the keys will be used as path to store the build asset specified as value.

  __Default:__ `This option doesnt have a default value, since it is required for this Plugin to work`

  ``` js
    Pimcore({input: 'assets/scss/app.scss'}),
    Pimcore({input: ['assets/scss/app.scss', 'assets/js/app.js']}),
    Pimcore({input: {
            'css/app': 'assets/scss/app.scss',
            'js/app': 'assets/js/app.js',
        }
    }),
  ``` 

- `reload`
  The Files which trigger a page reload if saved.   
  You can either pass a bool, a string or an array of strings.  
  If you pass a bool (false) this functionality will be disabled.  
  For more configuration information take a look
  at [vite-plugin-full-reload](https://www.npmjs.com/package/vite-plugin-full-reload).

  __Default:__ `[
  'assets/**/*.js',
  'assets/**/*.scss',
  'templates/**/*.twig',
  'src/Resources/views/**/*.twig',
  ]`

  ``` js
    Pimcore({reload: false}),
    Pimcore({reload: 'templates/**/*.twig'}),
    Pimcore({reload: ['templates/**/*.twig', 'src/Resources/views/**/*.twig']}),
  ``` 

- `copy`
  You can pass assets which will be hard copied to the specified destination.  
  You can either pass an object, or an array of objects. Each Object must contain a key `src` and `dest`, specifying
  the source from where the assets can be found and destination to which they will be copied.  
  The destination path starts in the configured outDir (default public/build).  
  If you don't pass this option, no files will be hard copied.  
  For more configuration information take a look
  at [vite-plugin-static-copy](https://www.npmjs.com/package/vite-plugin-static-copy).

  __Default:__ `[]`

  ``` js
    Pimcore({copy: {src: 'assets/img/', dest: '../assets'}}),
    Pimcore({copy: [
      {src: 'assets/img/', dest: '../assets/img'},
      {src: 'assets/svg/', dest: '../assets/svg'}
    ]}),
  ``` 

## Acknowledgements

Here are two great vite plugins.
I used these two plugins internally to combine all needed functionality.
So please take a look at those too.

- `vite-plugin-full-reload`  
  The plugin used for the reload function.   
  [https://www.npmjs.com/package/vite-plugin-full-reload](https://www.npmjs.com/package/vite-plugin-full-reload)

- `vite-plugin-static-copy`  
  The plugin used for the copy function.   
  [https://www.npmjs.com/package/vite-plugin-static-copy](https://www.npmjs.com/package/vite-plugin-static-copy)

## Contributing

Thank you for considering contributing! The contribution guide can be found in the [CONTRIBUTING.md](CONTRIBUTING.md).

## Code of Conduct

Please review and abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

The Pimcore Vite plugin is licensed under the [MIT license](LICENSE.md).
