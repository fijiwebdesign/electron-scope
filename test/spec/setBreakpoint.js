'use strict'

const app = require('./common/main')
const debug = console.log.bind(console)

app.on('ready', () => {
	const win = app.getMainWindow() // loaded electron main window
    const script_path = app.getScriptPath() // script being debugged

    win.webContents.once('did-finish-load', () => {
		debug('win.webContents.on(did-finish-load)')
		setBreakpoint(win.webContents.debugger, script_path, () => {
			win.webContents.openDevTools({mode: 'detach'})
			setTimeout(win.webContents.reload.bind(win.webContents), 500) // trigger breakpoint
		})
	})
})

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
				url: url
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
