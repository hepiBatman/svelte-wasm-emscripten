const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, '../../static/'),
    filename: 'image-processing-worker.js',
    library: 'image-processing-worker',
    libraryTarget:'umd',
    globalObject: 'this'
  },
  plugins: [
    // Ignore fs in /wasm folder when starting up, surround fs require/import with try-catch
    new webpack.IgnorePlugin(
      /fs/,
      /codecs/
    ),
  ],
  
  module: {
    // Disable default rules
    defaultRules: [],
    rules: [
      {
        oneOf: [
          {
            type: 'javascript/auto',
            resolve: {},
            parser: {
              system: false,
              requireJs: false
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\/codecs\/.*\/.*\.js$/,
        loader: "exports-loader"
      },
      // The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
      {
        test: /\/codecs\/.*\/.*\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader",
        options: {
          name: '[name].[hash:5].[ext]',
        },
      }
    ]
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
