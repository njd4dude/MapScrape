import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import Dotenv from "dotenv-webpack";

export default {
  entry: {
    content: "./src/content-adSkipper/index.js",
    background: "./src/background/index.js",
    popup: "./src/popup/index.js",
    onboarding: "./src/onboardingPage/index.js",
    sidepanel: "./src/sidepanel/index.js",
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/popup/index.html",
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      template: "src/sidepanel/index.html",
      filename: "sidepanel.html",
      chunks: ["sidepanel"],
    }),
    new HtmlWebpackPlugin({
      template: "src/onboardingPage/index.html",
      filename: "onboarding.html",
      chunks: ["onboarding"],
      favicon: "public/icons/128x128.png",
    }),
    new CopyPlugin({
      patterns: [{ from: path.resolve("public"), to: path.resolve("dist") }],
    }),
    new Dotenv(),
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
        test: /\.css$/i, // Add this rule to handle CSS files
        exclude: /node_modules/,
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
    extensions: [".js", ".jsx", "..."],
  },
};
