import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const reactDirectory = "popup"; //CHANGE THIS FOLDER for loading new react page.

export default {
  mode: "development",
  devtool: "inline-source-map",
  entry: { index: `./src/${reactDirectory}/index.js` }, //entry point is where webpack starts bundling file(s) and builds dependency graph
  output: {
    path: path.resolve("dist-react"),
    filename: "bundle.js", // this filename is used in the devserver
    clean: true, // this option deletes the dist folder before creating a new one
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `src/${reactDirectory}/index.html`,
      filename: "index.html", // this filename is used in the devserver. must remain index.html in order for devServer to recognize it
      chunks: ["index"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.css$/, // Add this rule to handle CSS files
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.png$/, // Rule for PNG files
        type: "asset/resource",
        generator: {
          filename: "images/[name].[hash][ext]", // This line configures the hashing
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // this line allows you to import files without the extension
  },
  devServer: {
    // HOW IT WORKS ---> devServer uses the bundled output(including plugins) that it would normally have created in the dist folder, to serve the page
    // static: {
    //   directory: path.resolve(""), // use this option for like images or static files you want to include. Right now its using the index.html file from the htmlwebpack plugin
    // },
    port: 9000,
    open: true, // Automatically open the page in the default browser
    hot: true, // Enable hot module replacement
  },
};
