const electron = require('electron')
const { ipcRenderer } = electron
var dt
var d_price = document.getElementById('discount');

var code = document.myForm1.code;
/*var desc = document.getElementById('desc');
var company = document.getElementById('company');*/
var qty = document.getElementById('qty');
/*var price = document.getElementById('price');*/
var grandTotal = document.forms['form2']['grand_total'];
/*var total = document.myForm1.total;*/
var totalRs = document.form2.totalRs;
var discountAmount = document.form2.d_amount;
var discountPercent = document.getElementById('disc');
var user
var BillNumber
var invoice_val = []
var desc, company, unit_price, total

code.addEventListener('keyup', (e) => {
        if (e.keyCode == 13) {
            ipcRenderer.send('Product_info', code.value)
        }
        totalPrice();
        Total();
    })
    /*price.addEventListener('keyup', (e) => {
        totalPrice();
        Total();
    })*/
document.forms['myForm1']['quantity'].addEventListener('keyup', (e) => {

    totalPrice();

})
d_price.addEventListener('keyup', (e) => {

    totalPrice();

})

function totalPrice() {
    var n = price.value - d_price.value;
    total.value = n * qty.value;
}



function Total() {
    var counter = 0.0;

    var column = document.getElementsByClassName('TotalPrice');

    for (var i = 0; i < column.length; i++) {

        counter += parseFloat(column[i].innerHTML);

    }
    document.forms['form2']['totalRs'].value = counter;
    grandTotal.value = counter
}


function addRow() {

    var code = document.myForm1.code;
    /*var product = document.getElementById('desc');
    var company = document.getElementById('company');*/
    var qty = document.getElementById('qty');
    /*var price = document.getElementById('price');*/

    var empTab = document.getElementById('mytable');

    var rowCnt = empTab.rows.length; // GET TABLE ROW COUNT.
    var tr = empTab.insertRow(0); // TABLE ROW.


    invoice_val.push({

        invoice_id: BillNumber,
        item_code: code.value,
        Quantity: qty.value,
        total: total.value

    })


    for (var c = 0; c < 8; c++) {
        var td = document.createElement('td'); // TABLE DEFINITION.
        td = tr.insertCell(c);

        if (c == 7) { // FIRST COLUMN.
            // ADD A BUTTON.
            var button = document.createElement('a');

            // SET INPUT ATTRIBUTE.
            button.innerHTML = "remove";
            button.setAttribute('class', 'mybutt');
            // ADD THE BUTTON's 'onclick' EVENT.
            button.setAttribute('onclick', 'removeRow(this)');


            td.appendChild(button);
        }
        if (c == 0) {

            setIndex();
        }
        if (c == 1) {
            td.innerHTML = code.value;
        }
        if (c == 2) {
            td.innerHTML = product.value;
        }
        if (c == 3) {
            td.innerHTML = company.value;
        }
        if (c == 4)
            td.innerHTML = qty.value;
        if (c == 5)

            td.innerHTML = price.value - d_price.value;
        if (c == 6) {
            var n = price.value - d_price.value;
            if (n > 0) {
                td.setAttribute('class', 'TotalPrice')
                td.innerHTML = n * qty.value;
                Total();

            } else { td.innerHTML = "enter valid price" }


        }
    }




}

function removeRow(oButton) {
    setIndex();
    console.log(invoice_val)
    var ObjectIndex = invoice_val.length - 1
    var RowIndex = oButton.parentNode.parentNode.rowIndex
    invoice_val.splice(ObjectIndex - RowIndex, 1)
    console.log(invoice_val)
    document.getElementById("mytable").deleteRow(oButton.parentNode.parentNode.rowIndex);
    setIndex();
    Total();

}

function setIndex() {

    var table = document.getElementById("mytable");

    rows = table.rows.length
    while (rows > 0) {
        table.rows[rows - 1].cells[0].innerHTML = rows;
        rows--;
    }

}
window.onload = function() {
    var field = document.querySelector('#dateme');
    var date = new Date();
    dt = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
        '-' + date.getDate().toString().padStart(2, 0)
        // Set the date
    field.value = dt;
    ipcRenderer.send('bill_no', dt)
    getUser()

}

discountPercent.addEventListener('keyup', (event) => {

    discountAmount.value = ((discountPercent.value * totalRs.value) / 100);
    grandTotal.value = totalRs.value - discountAmount.value;
})
discountAmount.addEventListener('keyup', (event) => {
    console.log(document.getElementById('d_amount').value);
    //console.log(totalRs.value);
    discountPercent.value = (discountAmount.value / totalRs.value) * 100;
    grandTotal.value = totalRs.value - discountAmount.value;
})
document.querySelector('.save').addEventListener('click', () => {
    var customer = document.forms['myForm1']['customer'].value

    console.log(customer + "  " + grandTotal.value + " " + user + dt)
    if (grandTotal.value > 0) {
        ipcRenderer.send('invoice', customer, BillNumber, grandTotal.value, user, dt)
        ipcRenderer.send('invoice_items', invoice_val)

        document.location.reload(true)
    } else {

    }

})

function getUser() {

    ipcRenderer.send('getUser')


}

ipcRenderer.on('user', (event, use) => {

    user = use

})


ipcRenderer.on('BillNo', (event, bill) => {
    var bill_no = document.querySelector('.bill_no')
    bill_no.value = bill
    BillNumber = bill
    console.log(BillNumber)
})
ipcRenderer.on('ProductInfo', (event, prod, comp, stock) => {
        for (var pod of prod) {
            var { product_name, purchase_price, sale_price, description } = pod
            desc.value = product_name
            price.value = sale_price
            document.forms['myForm1']['P.price'].value = purchase_price

        }
        company.value = comp
        document.forms['myForm1']['Stock'].value = stock
    })
    /*var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + '/' + dd + '/' + yyyy;
      console.log(today);*/
document.querySelector('.print').addEventListener('click', () => {
    ipcRenderer.send('newWindow')
})