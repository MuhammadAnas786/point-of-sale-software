const electron = require('electron')
const { ipcRenderer } = electron


/*-------------------document------------------*/
window.onload = function() {
    ipcRenderer.send('getCompany')
    console.log('working')


}



/*---------------------------IPC Renderer------------------------*/

/*---------------ipc send---------------------------------*/
document.querySelector('.SearchStock').addEventListener('keyup', (event) => {
    var val = document.querySelector('.SearchStock').value
    var option = document.querySelector('.company')

    if (event.keyCode == 13) {

        if (option.value == 'company') {
            document.querySelector('p').innerHTML = val
            ipcRenderer.send('searchStock', val)

        } else {
            document.querySelector('p').innerHTML = option.value
            ipcRenderer.send('searchStock2', option.value, val)

        }
    } else {
        removeRows()
    }

})
document.querySelector('.SearchStock').addEventListener('reset', (event) => {


})

/*---------------ipc on-----------------------------*/

ipcRenderer.on('searchResult', (event, values, brand_name, user_name) => {
    for (var val of values) {

        var { item_code, product_name, purchase_price, sale_price, description } = val
        var empTab = document.querySelector('.index_table')
        var rowCnt = empTab.rows.length // GET TABLE ROW COUNT.
        var tr = empTab.insertRow(rowCnt)
        for (var c = 0; c < 8; c++) {
            var td = document.createElement('td') // TABLE DEFINITION.
            td = tr.insertCell(c)
            if (c == 0) {
                setIndex()
            }
            if (c == 1) {
                td.innerHTML = product_name
            }
            if (c == 2) {
                td.innerHTML = brand_name
            }
            if (c == 7) {
                td.innerHTML = user_name
            }
            if (c == 3) {
                td.innerHTML = item_code
            }
            if (c == 4) {
                td.innerHTML = purchase_price
            }
            if (c == 5) {
                td.innerHTML = sale_price
            }
            if (c == 6) {
                td.innerHTML = description
            }

        }

    }
})

ipcRenderer.on("Company's", (event, result) => {
    var select = document.querySelector('.company')

    for (var Company of result) {
        var { brand } = Company
        var option = document.createElement("option")
        option.text = brand
        option.value = brand
        console.log = brand
        select.add(option)
    }
})

/*--------------------IPC END------------------------------*/

/*-----------------------functions---------------------------*/
function removeRows() {
    var empTab = document.querySelector('.index_table')
    var rowCnt = empTab.rows.length

    for (var i = rowCnt - 1; i > 0 - 1; i--) {
        if (i > 0)
            document.querySelector('.index_table').deleteRow(i);

    }
}

function setIndex() {


    var table = document.querySelector('.index_table');
    rows = table.rows.length
    while (rows > 1) {
        table.rows[rows - 1].cells[0].innerHTML = rows - 1;
        rows--;
    }

}

function search3(event) {
    removeRows()
    document.querySelector('p').innerHTML = event.value

    ipcRenderer.send('searchStock3', event.value)


}

/*---------------------End Functions--------------------------*/