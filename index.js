'use strict'
const electron = require('electron')
const app = electron.app 
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const path = require('path')
const debug = require('debug')('electron-scope:app')

// params
const script_path = argv['path'] || process.argv[2]

console.log('Electron-scope is debugging: "' + script_path + '"')

if (!script_path) {
	throw new Error('Script path required')
}

// reloads electron process on file changes
const watched_path = script_path.replace(/([^\/]+)$/, '')
require('./modules/electron-reload')(watched_path);
debug('Watching for file changes within ', watched_path)

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// prevent window being garbage collected
let mainWindow

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null
}

function createScreenCapture(win) {
  win.webContents.session.setPreloads([path.join(__dirname, 'js/get-diplay-media-electron-polyfill.js')])
  win.webContents.session.setPermissionCheckHandler(async (webContents, permission, details) => {
    return true
  })
  win.webContents.session.setPermissionRequestHandler(async (webContents, permission, callback, details) => {
    callback(true)
  })
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400,
		webPreferences: {
			nodeIntegration: true
		}
  })

  createScreenCapture(win)

	if (script_path.match(/\.html?$/)) {
		debug('Loading html app as electron-scope html window render process')
		win.loadURL('file://' + path.resolve(script_path))
		win.webContents.openDevTools({mode: 'right'})
	} else {
		debug('Embedding node app within electron-scope html window render process')
		win.loadURL(`file://${__dirname}/index.html?${script_path}`)
		win.webContents.openDevTools({mode: 'detached'})
	}

	win.on('closed', onClosed)

	//win.webContents.openDevTools()
	win.webContents.on('devtools-opened', () => {
    	setImmediate(() => {
			win.webContents.reload()
		})
	})
	win.maximize()

	return win
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow()
	}
})

app.on('ready', () => {
	mainWindow = createMainWindow()
})
