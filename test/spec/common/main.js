'use strict'
const electron = require('electron')
const app = electron.app
//const debug = require('debug')('electron-scope/index')
const debug = console.log.bind(console)

// params
const script_path = require('path').resolve('./test/fixtures/test.js')

debug('Debugging: ' + script_path)

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// prevent window being garbage collected
let mainWindow

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	app.mainWindow = mainWindow = null
}

function createMainWindow() {
	debug('creating main window')
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	})
	
	win.maximize()
	win.on('closed', onClosed)
	win.loadURL(`file://${__dirname}/../../fixtures/index.html?${script_path}`)

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

module.exports = app
app.getMainWindow = function() {
	return mainWindow
}
app.getScriptPath = function() {
	return script_path
}
