const { Configuration } = require("webpack");
const { resolve } = require("path");
const DotenvPlugin = require("dotenv-webpack");

require("dotenv").config({ path: "../.env" });

const nodeEnv = process.env.NODE_ENV || "production";

/**
 * @type {Configuration}
 */
const clientDir = __dirname;

module.exports = {
    entry: {
        analysis: clientDir + "/src/apps/features/analysis/index.tsx"
    },
    output: {
        filename: "[name].bundle.js",
        path: clientDir + "/dist"
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            "@": clientDir + "/src",
            "@analysis": clientDir + "/src/apps/features/analysis",
            "@assets": clientDir + "/public"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: "babel-loader"
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|gif|ttf|mp3)$/i,
                type: "asset"
            }
        ]
    },
    plugins: [
        new DotenvPlugin({
            systemvars: true,
            path: clientDir + "/../.env",
            silent: true
        })
    ],
    mode: nodeEnv
};