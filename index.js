'use strict'
const electron = require('electron')
const app = electron.app 
const minimist = require('minimist')
const argv = require('minimist')(process.argv.slice(2))

// params
const script_path = argv['path'] || ''

console.log('Debugging: ' + script_path)

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
	win.maximize()
	
	win.on('closed', onClosed)

	
	

	win.loadURL(`file://${__dirname}/index.html?${script_path}`)

	win.webContents.debugger.attach()
	setBreakpoint(win)
	setTimeout(() => {
		win.webContents.debugger.detach()
		win.webContents.openDevTools({mode: 'undocked'})
		setBreakpoint(win) // try again?
	}, 500)

	return win
}

function setBreakpoint(win) {
	win.webContents.debugger.sendCommand(
		'Debugger.setBreakpointByUrl', {
			lineNumber: 0,
			url: './test.js'
		},
		function (err, result){
			console.log('breakpoint set')
			if(err){
				console.error('Error:', err)
			}
			console.log('Result: ', result)
		})
}

function evaluateCmd(win) {
	var callback = function (err, res) {
		console.log('evaluateCommand callback', err, res)
	}
	const params = {
		'expression': '4+2'
	}
	win.webContents.debugger.sendCommand('Runtime.evaluate', params, callback)
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
