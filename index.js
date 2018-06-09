'use strict'
const electron = require('electron')
const app = electron.app 
const minimist = require('minimist')
const argv = require('minimist')(process.argv.slice(2))

// params
const script_path = argv['path'] || process.argv[2]

console.log('Debugging ' + script_path)

if (!script_path) {
	throw new Error('Script path required')
}

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

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

	if (script_path.match(/\.html?$/)) {
		win.loadURL('file://' + require('path').resolve(script_path))
		win.webContents.openDevTools({mode: 'right'})
	} else {
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
