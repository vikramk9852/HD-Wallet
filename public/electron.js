const { app, BrowserWindow } = require('electron')
const path = require('path')

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 990, 
    height: 768,
    backgroundColor: '#151719',
    icon: `file://${__dirname}/dist/assets/logo.png`
  })

  win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)

  // win.loadURL("http://localhost:3000");

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})