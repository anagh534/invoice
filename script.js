let itemCounter = 0;
function addInvoiceItem() {
    itemCounter++;
    const newItemRow = `
        <tr id="itemRow${itemCounter}">
        <td><input type="text" class="form-control" placeholder="Enter Description" required></td>
        <td><input type="number" class="form-control quantity" placeholder="Enter Quantity" required></td>
        <td><input type="number" class="form-control unitPrice" placeholder="Enter Unit Price" required></td>
        <td><input type="text" class="form-control totalItemPrice" disabled readonly></td>
        <td><button type="button" class="btn btn-danger" onclick="removeInvoiceItem(${itemCounter})">Remove</button></td>
    `;
    $('#invoiceItems').append(newItemRow);

    updateTotalAmount();
}

function removeInvoiceItem(itemId) {
    $(`#itemRow${itemId}`).remove();
    updateTotalAmount();
}


function updateTotalAmount() {
    let totalAmount = 0;
    const discount = $("#discount").val();

    $("tr[id^='itemRow']").each(function () {
        const quantity = parseFloat($(this).find(".quantity").val()) || 0;
        const unitPrice = parseFloat($(this).find(".unitPrice").val()) || 0;
        const totalItemPrice = quantity * unitPrice;

        $(this).find('.totalItemPrice').val(totalItemPrice.toFixed(2));
        totalAmount += totalItemPrice;
    })
    if (discount !== "") {
        totalAmount = totalAmount - parseInt(discount);
    }

    $("#totalAmount").val(totalAmount.toFixed(2))
}

$(document).ready(function () {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10)
    $("#invoiceDate").val(formattedDate)
})

$("#invoiceForm").submit(function (event) {
    event.preventDefault();
    updateTotalAmount();
})

function printInvoice() {
    const customerName = $("#customerName").val();
    const invoiceDate = $("#invoiceDate").val();
    const discount = $("#discount").val();
    const address = $("#address").val();
    const items = []

    $("tr[id^='itemRow']").each(function () {
        const description = $(this).find("td:eq(0) input").val();
        const quantity = $(this).find("td:eq(1) input").val();
        const unitPrice = $(this).find("td:eq(2) input").val();
        const totalItemPrice = $(this).find("td:eq(3) input").val();

        items.push(
            {
                description,
                quantity,
                unitPrice,
                totalItemPrice
            }
        )
    })

    const totalAmount = $("#totalAmount").val()
    const invoiceContent = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        h2 {
            color: #007bff;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }

        .total {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <h2>Invoice Slip</h2>
    <p><strong>Customer Name:</strong>  ${customerName}</p>
    <p>${address}</p>
    <p><strong>Invoice Date:</strong>  ${invoiceDate}</p>
    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${items.map((item) =>
        `
            <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.unitPrice}</td>
                <td>${item.totalItemPrice}</td>
            </tr>
        `
    ).join("")}
        </tbody>
    </table>
    <p class="discount"><strong>Discount Amount: </strong> ${discount}</p>
    <p class="total">Total Amount: ${totalAmount}</p>
    <p>
        Tax is not payable on reverse charge basis <br>
        This is a computer generated invoice and does not require signature <br>
        Other charges are charges that are applicable to your order and include charges for logistics fee (where
        applicable) and/or fees levied for high <br>
        return rate <br>
        Includes discounts for your city, limited returns and/or for online payments (as applicable) <br>
    </p>
</body>

</html>`;
    const printWindow = window.open("", "_blank")
    printWindow.document.write(invoiceContent)
    printWindow.document.close()
    printWindow.print()
}