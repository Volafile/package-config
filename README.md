read-package-config
==============

Simply read the configuration of any package. Optionally also reading a package.json.

Config files read:

    - directory/package.json (if a directory is given),
    - directory/npmrc       (if a directory is given),
    - `globalConfig` (Default: /etc/npmrc),
    - `userConfig` (Default: ~/.npmrc)

Doesn't read npm's built-in config file.

Usage:

```js

const readConfig = require('read-package-config');

const config = await readConfig({
    name: 'my-package',     // Packages can be identified by name...
    directory: './',        // or directory. In which case its package.json and .npmrc will also be read.

                                // Optional arguments:
    globalConfig: '/etc/npmrc', // Location of npm's global configuration
    userConfig: os.homedir() + '/.npmrc',     // Location of npm's per-user configuration
});

console.log(config); // { key: value, ... }

```
