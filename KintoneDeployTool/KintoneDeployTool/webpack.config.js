const path = require('path');
const glob = require("glob");
const webpack = require('webpack');

//#region バンドル対象を取得する
// ビルド対象のsrc/ts/entries配下のtsファイル名を取得する
const entries = {};
const srcDir = path.resolve(__dirname, 'Scripts', 'entries');
glob.sync('**/*.ts', {
    ignore: '**/_*.ts',
    cwd: srcDir
}).map((value) => {
    var fileName = path.basename(value, '.ts')
    entries[fileName + '.ts'] = path.resolve(srcDir, value);
});
//#endregion

const config = {
    // jsファイルの容量について警告を表示しない
    performance: {
        hints: false,
    },
    entry: entries,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'wwwroot', 'js'),
        clean: true,
    },
    target: 'web',
    devtool: "inline-source-map",
    module: {
        rules: [
            // TypeScriptを処理するローダー
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        // モジュールを探すフォルダ（node_modulesとScriptsフォルダを対象にする）
        modules: [
            "node_modules",
            path.resolve(__dirname, "Scripts")
        ],
        // ビルド時のパスを解決
        // @ → src/tsに置換 
        alias: { '@': path.resolve(__dirname, 'src/ts'), },
    }
};

module.exports = config;