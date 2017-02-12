const {app, BrowserWindow} = require('electron')

const path = require('path').resolve(__dirname, './../fixtures/test.js')
const url = require('path').resolve(__dirname, './../fixtures/test.html')

app.on('ready', () => {
	let win = new BrowserWindow()

    win.loadURL('file://' + url)

    try {
        win.webContents.debugger.attach()
    } catch (err) {
        console.error('Debugger attach failed : ', err)
    }

    win.webContents.debugger.on('detach', (event, reason) => {
        console.log('Debugger detached due to : ', reason)
    })

    win.webContents.once('devtools-opened', function () {
        console.log('devtools opened')
        //setTimeout(win.webContents.reload.bind(win.webContents), 1000)
      })

    win.webContents.once('did-finish-load', () => {
		console.log('win loaded')

        

        setTimeout( () => {
            
            win.webContents.debugger.sendCommand('Debugger.enable', (err) => {
                console.log('debugger enabled', err)
                setTimeout( () => {
                    setBreakpointByUrl(win.webContents.debugger, path, () => {
                        setTimeout(() => {
                            //win.webContents.debugger.detach()
                            win.webContents.openDevTools({mode: 'detach'})
                        }, 1000)
                    })
                }, 1000)

                setImmediate( () => {
                    setBreakpointByUrl(win.webContents.debugger, 'file://' + path)
                })

            })
        }, 1000)
	})
})

function setBreakpointByUrl(dbgr, url, cb) {
    dbgr.sendCommand(
        'Debugger.setBreakpointByUrl', 
        {
            lineNumber: 0,
            url: url
        },
        (err, result) => {
            if(err && err.msg){
                console.error('Error:', err)
            }
            console.log('Breakpoint set: ', result)
            if (typeof cb == 'function') {
                cb(err, result)
            }
        })
}
