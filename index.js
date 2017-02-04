'use strict'
const electron = require('electron')
const app = electron.app 
const minimist = require('minimist')
const argv = require('minimist')(process.argv.slice(2))
//const debug = require('debug')('electron-scope/index')
const debug = console.log.bind(console)

// params
const script_path = argv['path'] || ''

debug('Debugging: ' + script_path)

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
	debug('creating main window')
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	})
	
	win.maximize()
	
	win.on('closed', onClosed)

	win.loadURL(`file://${__dirname}/index.html?${script_path}`)

	win.webContents.once('did-finish-load', () => {
		debug('win.webContents.on(did-finish-load)')
		setBreakpoint(win.webContents.debugger, script_path, () => {
			win.webContents.openDevTools({mode: 'detach'})
			setTimeout(win.webContents.reload.bind(win.webContents), 500)
		})
	})

	/*

	const devToolsInstaller = require('electron-devtools-installer')
	devToolsInstaller.default('bomhdjeadceaggdgfoefmpeafkjhegbo')
		.then((name) => {
			debug('Added extension:', name)
		})
		.catch(debug)

	devToolsInstaller.default(devToolsInstaller.REACT_DEVELOPER_TOOLS)
		.then((name) => console.log(`Added Extension:  ${name}`))
		.catch((err) => console.log('An error occurred: ', err))

		*/

	return win
}

function setBreakpoint(debugClient, url, callback) {
	url = require('path').resolve(url)
	debug('setting breakpoint', url)
	try {
		debugClient.attach()
	} catch(e) {
		debug('error attaching debugger', e)
	}

	//debugClient.sendCommand('Debugger.enable', (err) => {
		//debug('enabed debugger', err)
	setTimeout(() => {
		debugClient.sendCommand(
			'Debugger.setBreakpointByUrl', {
				lineNumber: 0,
				url: 'file://' + url
			},
			(err, result) => {
				if(err && err.msg){
					console.error('Error:', err)
				}
				debug('Breakpoint: ', result)
				debugClient.detach()
				if (typeof callback == 'function') {
					callback(result)
				}
			})
	}, 500)
	//})
}

function evaluateCmd(win) {
	var callback = function (err, res) {
		debug('evaluateCommand callback', err, res)
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
