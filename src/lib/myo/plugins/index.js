// rewrite of myo.js plugins @ https://github.com/thalmiclabs

//
//  MYO plugins auto-loader
//
export default function addPlugins(myo) {
    const { config } = myo;

    // map plugins
    config.plugins.forEach((pluginName, idx) => {
        // load plugins on demand
        const plugin = require(`./${pluginName}`);
        let handler = null;

        // look for attach handler function
        if (typeof plugin === 'function') {
            handler = plugin;
        } else if (typeof plugin.default === 'function') {
            handler = plugin.default;
        }

        // attach plugin to device
        if (typeof handler === 'function') {
            handler(myo);
        }
    });
}
