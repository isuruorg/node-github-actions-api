const nodeExternals = require('webpack-node-externals');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = (env, argv) => {
  return {
    mode: 'development',
    entry: { app: './src/app.ts' },
    externalsPresets: { node: true },
    context: __dirname,

    externals: [nodeExternals()],
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'app.js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new Dotenv({
        path: `.env.${NODE_ENV}`,
        allowEmptyValues: true,
        systemvars: true,
      }),
    ],
    node: {
      __dirname: true,
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        routes: path.resolve(__dirname, 'src/routes'),
        controllers: path.resolve(__dirname, 'src/controllers'),
        services: path.resolve(__dirname, 'src/services'),
        models: path.resolve(__dirname, 'src/models'),
        lib: path.resolve(__dirname, 'src/lib'),
        db: path.resolve(__dirname, 'src/db'),
        middlewares: path.resolve(__dirname, 'src/middlewares'),
        dataMigrations: path.resolve(__dirname, 'src/dataMigrations'),
        clients: path.resolve(__dirname, 'src/clients'),
      },
    },
    module: {
      rules: [
        {
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
      ],
    },
  };
};
