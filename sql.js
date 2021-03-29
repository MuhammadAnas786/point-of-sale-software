const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const location = path.join(__dirname, 'tables/orignal.db')
var mainWindow
var course = "logics"
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: location
    },
    useNullAsDefault: true,
    pool: {
        afterCreate: (conn, cb) =>
            conn.run('PRAGMA foreign_keys = ON', cb)
    }
})
var result = knex.from('courses').select('*').where({
    courses_name: `${course}`
}).then((rows) => {
    var obj = {
        name: 'babaShaeee hukaBariya',
        course: rows[0].id
    }
    knex('students').insert(obj).then(() => console.log("data inserted"))
        .catch((err) => {
            console.log(err)
            throw err
        })
})