const electron = require('electron')
const { ipcRenderer } = electron


function Submit(event) {


    ipcRenderer.send("update");

}

function Back() {

    ipcRenderer.send("update");

}