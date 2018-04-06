// vue.config.js
const GoogleFontsPlugin = require("google-fonts-webpack-plugin")

module.exports = {
    configureWebpack: {
        plugins: [
            new GoogleFontsPlugin({
                fonts: [
                    { family: "Jua", variants: [ "400", "700italic" ] }
                ]
                /* ...options */
            })
        ]
    }
}