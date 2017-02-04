'use strict'
const electron = require('electron')
const app = electron.app 
const minimist = require('minimist')
const argv = require('minimist')(process.argv.slice(2))

// params
const script_path = argv['path']

console.log('Debugging ' + script_path)

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')({showDevTools: 'undocked'})

// prevent window being garbage collected
let mainWindow

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	})

	win.loadURL(`file://${__dirname}/index.html?${script_path}`)
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
