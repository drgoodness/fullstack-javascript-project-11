import { fileURLToPath } from 'url';
import path from 'path';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default {
  entry: './src/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: path.resolve(dirname, 'dist'),
    port: 8080,
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  autoprefixer,
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};
