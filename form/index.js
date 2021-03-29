const { ipcRenderer } = require('electron');

/*-----------------var-------------------------*/
/*const electron = require('electron');
const {
    ipcRenderer
} = electron;

const { remote } = electron;


var button = document.querySelector('.button');;
/*-----------------------------------------------*/





/*button.addEventListener('click', (event) => {
    console.log('hello how are you doing')
    const {
        path
    } = document.querySelector('input').files[0]


    ipcRenderer.send('video:submitPath', path)
})

ipcRenderer.on('video:duration', (event, duration) => {
        document.querySelector('.para').innerHTML += " " + duration
    })
    /*document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        debugger
    });*/
/*document.querySelector('.nextButton').addEventListener('click', () => {
    const window = remote.getCurrentWindow()
    window.close()
})


document.querySelector('.create_table').addEventListener('click', () => {

    console.log(name.value)
    ipcRenderer.send('create_table', name.value)
})


document.querySelector('.submit').addEventListener('click', () => {
    const name = document.querySelector('.table_name')
    const mail = document.querySelector('.mail')
    const pass = document.querySelector('.pass')
    ipcRenderer.send('table_values', name.value, mail.value, pass.value)
})

ipcRenderer.on('db', (event, data) => {
    var { password } = data[0]
    console.log(password);

})
document.querySelector('.view').addEventListener('click', () => {
    const name = document.querySelector('.table_name')
    const mail = document.querySelector('.mail')


    ipcRenderer.send('display_values', name.value, mail.value)
})*/
const name = document.querySelector('.mail')
const course = document.querySelector('.pass')

document.querySelector('.submit').addEventListener('click', () => {
    ipcRenderer.send('addStudent', name.value, course.value)
})
document.querySelector('.view').addEventListener('click', () => {
    ipcRenderer.send('viewStudent')

})
ipcRenderer.on('lastStudent', (event, row) => {
    console.log(row)
    for (var rows of row) {
        var { id, name, course } = rows
        document.querySelector('.student').innerHTML += id + "   " + name + "   " + course + "<br />"
    }
})