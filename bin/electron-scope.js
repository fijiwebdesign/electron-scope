#!/usr/bin/env electron
const argv = require('minimist')(process.argv.slice(2))
const script_path = argv['path'] || process.argv[2]

if (!script_path) {
  console.log(usage())
  process.exit(1)
}

function usage() {
  return `
    ElectronScope 

    USAGE:

    electron-scope /path/to/node/app.js

    or

    electron-scope --path /path/to/node/app.js
  `
}

require('../index')