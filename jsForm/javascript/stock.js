const electron = require('electron')
const { ipcRenderer } = electron

document.querySelector('.view').addEventListener('click', () => {
    ipcRenderer.send('viewStock')
})
document.querySelector('.update').addEventListener('click', () => {
    ipcRenderer.send('update')
})