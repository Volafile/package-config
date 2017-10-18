
const path = require('path');
const os = require('os');
const fs = require('fs');
const ini = require('ini');

const readFile = util.promisify(fs.readFile);

module.exports = async (options) => {
    options = Object.assign({
        name: null,        
        directory: null,
        globalConfig: '/etc/npmrc',
        userConfig: path.join(os.homedir(), '.npmrc')
    }, options || {});

    const config = {};

    if (!options.directory && !options.name) {
        throw new Error("A directory or a package name must be given");
    }
    
    if (options.directory) {
        const packageInfo = JSON.parse(await readFile(path.join(options.directory, 'package.json')));

        options.name = options.name || packageInfo.name;
        
        const packageConfig = await readINIConfig(path.join(options.directory, 'npmrc'), options.name);

        Object.assign(config, packageInfo.config);
        Object.assign(config, packageConfig);
    }

    if (options.globalConfig) {
        Object.assign(config, await readINIConfig(options.globalConfig, options.name));
    }
    
    if (options.userConfig) {
        Object.assign(config, await readINIConfig(options.userConfig, options.name));
    }
        
    return config;
};

async function readINIConfig(path, packageName) {
    try {
        const contents = await readFile(path);
        const config = ini.parse(contents.toString('utf8'));
        const result = {};

        Object.keys(config).forEach(key => {
            if (key.startsWith(packageName + ':')) {
                result[key.slice(packageName.length + 1)] = config[key];
            }
        });

        return result;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {};
        }

        throw error;
    }
}
