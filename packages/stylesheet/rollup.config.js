import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

import pkg from './package.json';

const external = [
  'postcss-value-parser/lib/parse',
  'postcss-value-parser/lib/unit',
  '@babel/runtime/helpers/extends',
].concat(Object.keys(pkg.dependencies));

const babelConfig = ({ browser }) => ({
  babelrc: false,
  exclude: 'node_modules/**',
  babelHelpers: 'runtime',
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        ...(browser
          ? { targets: { browsers: 'last 2 versions' } }
          : { targets: { node: '12' } }),
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { version: '^7.16.4' }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
});

const cjsConfig = {
  input: './src/index.js',
  output: {
    format: 'cjs',
    file: 'lib/index.js',
    exports: 'named',
  },
  external,
  plugins: [
    nodeResolve(),
    babel(babelConfig({ browser: false })),
    replace({
      preventAssignment: true,
      values: { BROWSER: JSON.stringify(false) },
    }),
  ],
};

const esmConfig = {
  input: './src/index.js',
  output: {
    format: 'esm',
    file: 'lib/index.esm.js',
    exports: 'named',
  },
  external,
  plugins: [
    nodeResolve(),
    babel(babelConfig({ browser: true })),
    replace({
      preventAssignment: true,
      values: { BROWSER: JSON.stringify(true) },
    }),
  ],
};

export default [cjsConfig, esmConfig];
