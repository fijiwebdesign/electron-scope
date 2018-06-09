# Electron Scope

> Node JS Debugger using Electron

This is very experimental. 

## Install

Clone the electron-scope git repository.

```
$ git clone https://github.com/fijiwebdesign/electron-scope
```

Install the dependencies locally.
```
$ cd electron-scope
$ npm install
```

### Run

Run electron-scope with the local electron and pass it the script to debug in the --path option.

```
$ electron . /path/to/node/app.js
```

Or link the `electron-scope` binary globally and run `electron-scope` with global `electron`

```
$ npm link # links local electon-scope binary to global
$ npm install -g electron # installs electron globally for use in electron-scope binary
$ electron-scope /path/to/node/app.js
```

### Build

```
$ npm run build
```

Builds the app for OS X, Linux, and Windows, using [electron-packager](https://github.com/electron-userland/electron-packager).


## License

MIT © [Gabe](http://fijiwebdesign.com)
