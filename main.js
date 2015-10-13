var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 310,
    height: 540,
    'auto-hide-menu-bar': true,
    'use-content-size': true,
    'dark-theme': true,
    'min-width': 190,
    'min-height': 72,
    'node-integration': false
  });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.focus();
});
