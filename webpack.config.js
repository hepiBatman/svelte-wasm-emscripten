const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const alias = { svelte: path.resolve('node_modules', 'svelte') };
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];

module.exports = {
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		resolve: { alias, extensions, mainFields },
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader',
						options: {
							dev,
							hydratable: true,
							hotReload: false // pending https://github.com/sveltejs/svelte/issues/2377
						}
					}
				},
        {
          test: /\/wasm\/.*\.js$/,
          loader: "exports-loader"
        },
        // The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
        {
          test: /\/wasm\/.*\.wasm$/,
          type: "javascript/auto",
          loader: "file-loader",
          options: {
            name: '[name].[hash:5].[ext]',
          },
        }
			]
		},
		mode,
		plugins: [
      // Ignore fs in /wasm folder
      new webpack.IgnorePlugin(
        /fs/,
        /wasm$/
      ),
			// pending https://github.com/sveltejs/svelte/issues/2377
			// dev && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
		].filter(Boolean),
		devtool: dev && 'inline-source-map'
	},

	server: {
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: { alias, extensions, mainFields },
		externals: Object.keys(pkg.dependencies).concat('encoding'),
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader',
						options: {
							css: false,
							generate: 'ssr',
							dev
						}
					}
				},
        {
          test: /\/wasm\/.*\.js$/,
          loader: "exports-loader"
        },
        // The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
        {
          test: /\/wasm\/.*\.wasm$/,
          type: "javascript/auto",
          loader: "file-loader",
          options: {
            name: '[name].[hash:5].[ext]',
          },
        }
			]
		},
		mode: process.env.NODE_ENV,
		performance: {
			hints: false // it doesn't matter if server.js is large
		}
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode: process.env.NODE_ENV
	},
  
  node: {
    console: false,
    // Keep global, it's just an alias of window and used by many third party modules:
    global: true,
    // Turn off process to avoid bundling a nextTick implementation:
    process: false,
    // Inline __filename and __dirname values:
    __filename: 'mock',
    __dirname: 'mock',
    // Never embed a portable implementation of Node's Buffer module:
    Buffer: false,
    // Never embed a setImmediate implementation:
    setImmediate: false
  },
};
