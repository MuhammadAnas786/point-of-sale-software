const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const location = path.join(__dirname, 'tables/autostore.db')
var mainWindow
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
var user = 'anas'
var i = 0

/*---------------------------------------------------------*/

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'jsForm/form.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on('close', () => {
        mainWindow = null

    })

    // mainWindow.openDevTools()

})



/*-----------------------------------*/

ipcMain.on('bill_no', (event, date) => {
    knex.from('invoice').select('today').max('today').where({
        date: date
    }).then((rows) => {
        console.log(rows)
        if (rows[0].today)
            mainWindow.webContents.send('BillNo', rows[0].today + 1)
        else
            mainWindow.webContents.send('BillNo', 1)
    })

})
ipcMain.on('getUser', (event) => {

    knex('user').where('name', `${user}`).then((rows) => {
        console.log(rows[0].id)
        mainWindow.webContents.send('user', rows[0].id)
    })
})


ipcMain.on('invoice', (event, customer, bill, tot, user, date) => {

    console.log(customer + " " + bill + " " + tot + " " + user + "  " + date)
    var obj = {
        customer: `${customer}`,
        today: bill,
        date: date,
        user_id: `${user}`,
        total_price: tot
    }

    knex('invoice').insert(obj).then(() => {
        console.log('data_inserted')

    }).catch((err) => {
        console.log(err)
        throw err
    })
})
ipcMain.on('invoice_items', (event, values) => {
    for (var info of values) {
        var { invoice_id, item_code, Quantity, total } = info
        //            console.log(`${invoice_id}  ${item_code}  ${Quantity}  ${total} \n`)

        knex.from('products').select('id').where({ item_code: item_code }).then((rows) => {

            var obj = {
                invoice_id: invoice_id,
                product_id: rows[0].id,
                quantity: Quantity,
                total: total
            }
            knex('invoice_item').insert(obj).then(() => {
                console.log('data inserted into invoice items')
                knex('stock').where({ product: rows[0].id }).decrement({
                    inStock: Quantity
                }).then(() => {
                    console.log("successfully updated stock")
                })
            }).catch((err) => {
                console.log(err)
                throw err
            })


        })
    }



})
ipcMain.on('Product_info', (event, code) => {
    knex.from('products').select('*').where({
        item_code: code
    }).then((rows) => {
        knex.from('brands').select('brand').where({
            id: rows[0].brand_id
        }).then((company) => {
            knex.from('stock').select('inStock').where({
                product: rows[0].id
            }).then((stock) => {
                mainWindow.webContents.send('ProductInfo', rows, company[0].brand, stock[0].inStock)

            })
        })
    })
})
ipcMain.on('newWindow', (event) => {
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'jsForm/stock.html'),
        protocol: 'file:',
        slashes: true
    }))
})

ipcMain.on('viewStock', (event) => {
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'jsForm/viewStock.html'),
        protocol: 'file:',
        slashes: true
    }))
})
ipcMain.on('searchStock', (event, code) => {
    console.log(code)
    knex.from('products').select('*').where({
        item_code: code
    }).then((rows) => {
        console.log(rows)
        knex.from('brands').select('brand').where({
            id: rows[0].brand_id
        }).then((brands) => {
            knex.from('user').select('name').where({
                id: rows[0].user_id
            }).then((users) => {
                mainWindow.webContents.send('searchResult', rows, brands[0].brand, users[0].name)
            })
        })
    })

})
ipcMain.on('getCompany', (event) => {
    knex.from('brands').select('brand').then((result) => {
        mainWindow.webContents.send("Company's", result)

    })
})

ipcMain.on('searchStock2', (event, name, code) => {
    knex.from('brands').select('*').where({
        brand: name
    }).then((brnd) => {
        console.log(brnd)
        knex.from('products').select('*').where({
            item_code: code,
            brand_id: brnd[0].id
        }).then((rows) => {
            // console.log(rows)
            knex.from('user').select('name').where({
                id: rows[0].user_id
            }).then((users) => {
                mainWindow.webContents.send('searchResult', rows, brnd[0].brand, users[0].name)
            })
        })
    })

})
ipcMain.on('searchStock3', (event, name) => {
    knex.from('brands').select('*').where({
        brand: name
    }).then((brnd) => {
        console.log(brnd)
        knex.from('products').select('*').where({
            brand_id: brnd[0].id
        }).then((rows) => {
            // console.log(rows)
            knex.from('user').select('name').where({
                id: rows[0].user_id
            }).then((users) => {
                mainWindow.webContents.send('searchResult', rows, brnd[0].brand, users[0].name)
            })
        })
    })

})
ipcMain.on('update', (event) => {
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'jsForm/update.html'),
        protocol: 'file:',
        slashes: true
    }))
})
ipcMain.on("UpdateForm", (event) => {
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'jsForm/UpdateForm.html'),
        protocol: 'file:',
        slashes: true
    }))

})

/*ipcMain.on('addStudent', (event, name, course) => {

    knex.from('courses').select('*').where({
        courses_name: `${course}`
    }).then((rows) => {
        var obj = {
            name: `${name}`,
            course: rows[0].id
        }
        knex('students').insert(obj).then(() => console.log("data inserted"))
            .catch((err) => {
                console.log(err)
                throw err
            })
    })

})*/
/*ipcMain.on('viewStudent', (event) => {
    knex.select('*').from('students').then((rows) => {
        console.log(rows)
        mainWindow.webContents.send('lastStudent', rows)
    })

})*/