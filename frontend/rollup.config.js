


import acornPrivateMethods from 'acorn-private-methods';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import html from '@rollup/plugin-html';
import copy from 'rollup-plugin-copy';

function htmlTemplate(externals) {
    return ({ attributes, files, meta, publicPath, title }) => {
        return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Rollup Bundle</title>
      <link href="maplibre-gl.css" rel="stylesheet">
      <link rel="shortcut icon" href="favicon.png" type="image/png">
    </head>
    <body>
      <script src="index.js" type="module"></script>
    </body>
  </html>`;
    };
}

function makeHtmlAttributes(attributes) {
  if (!attributes) {
    return '';
  }

  const keys = Object.keys(attributes);
  // eslint-disable-next-line no-param-reassign
  return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '');
}
/* END recipes/external-files/index.js */

export default {
    acornInjectPlugins: [ acornPrivateMethods ],
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'esm',
        sourcemap: true,
        chunkFileNames: 'node_modules/maplibre-gl/dist/maplibre-gl.css'
    },
    plugins: [
        json(),
        html({
            template: htmlTemplate()
        }),
        commonjs(),
        resolve({ browser: true, preferBuiltins: false }),
        copy({
            targets: [
                { src: 'node_modules/maplibre-gl/dist/maplibre-gl.css', dest: 'dist' },
                { src: 'images/favicon.png', dest: 'dist' },
            ]
        }),
        process.env.BUILD === 'production' && terser()
    ]
};
