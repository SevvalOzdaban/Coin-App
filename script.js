var selectedItem, buyAmount = 0, buyPrice, buyTotal, profit;
var no = 0, number = 0, id; 
var sellName, sellPrice, sellAmount = 0, sellTotal;
var apiKey = "E4515E62-48F4-4432-94A9-6FDDD853DD31";

function selected() {
    selectedItem = $("#select").val();
    getPrice();
}
function getPrice(){
$.ajax({
    type: "GET",
    url: "https://rest.coinapi.io/v1/exchangerate/" + selectedItem + "/USD",
    headers: {
        "X-CoinAPI-Key": apiKey,
    },
    data: {
    },
    success: function (data) {
        $("#currentPrice").text(parseFloat(data.rate).toFixed(3));
        console.log(`data`, data);
    }

});
}
function buyCoin() {
    buyAmount = parseFloat($("#buyAmount").val());
    if (buyAmount <= 0) {
        Swal.fire("Please enter valid value");   
    }
    else if( isNaN(buyAmount )){
        Swal.fire("Please enter valid value");
    }
    else {
        $.ajax({
            type: "GET",
            url: "https://rest.coinapi.io/v1/exchangerate/" + selectedItem + "/USD",
            headers: {
                "X-CoinAPI-Key": apiKey,
            },
            data: {
            },
            success: function (data) {
                buyPrice = Number(parseFloat(data.rate).toFixed(3));
                buyTotal = Number(parseFloat(buyPrice * buyAmount).toFixed(3));
                var markup = '<tr id =' + no + '>'
                    + '<td id = "name-' + no + '">' + selectedItem + '</td>'
                    + '<td id = "amount-' + no + '">' + buyAmount + '</td>'
                    + '<td id = "price-' + no + '">' + buyPrice + '</td>'
                    + '<td id = "buyTotal-' + no + '">' + buyTotal + '</td>'
                    + '<td>BUY</td>'
                    + "<td><button id='sellButton-" + no + "' type='button' class='btn btn-danger' data-toggle='modal' data-target='#staticBackdrop' onClick= 'openModel()'> SELL COIN </button></td>"
                    + '</tr>';
                $("#coinTable").append(markup);
                no++;
            }
        });
    }
    $("#buyAmount").val("");
    buyTotal = 0;
}
//open model
function openModel() {
    $("#sellAmount").val("");
    $("#coinTable").on('click', '.btn-danger', function () {
        //find row id
        id = $(this).closest('tr').attr('id');
        sellName = $("#name-" + id).text();
        buyAmount = $("#amount-" + id).text();    
        
        //add name of coin to modal
        $("#staticBackdropLabel").text(sellName);
        $.ajax({
            type: "GET",
            url: "https://rest.coinapi.io/v1/exchangerate/" + sellName + "/USD",
            headers: {
                "X-CoinAPI-Key": apiKey,
            },
            data:{
            },
            success: function (data) {
                console.log(`buyAmountAjax`, buyAmount)
                sellPrice = Number(parseFloat(data.rate).toFixed(3));
                $("#sellPrice").text(sellPrice);
            }
        });
    });
}
//coin which sold append to table
function sell() {
    sellAmount = parseFloat($("#sellAmount").val());

    if (sellAmount <= 0 || sellAmount == NaN) {
        Swal.fire("Please enter valid value");
        $("#sellAmount").val(0);
    }
    else if( isNaN(sellAmount)){
        Swal.fire("Please enter valid value");
    }
    else {
        if (sellAmount > buyAmount) {
            Swal.fire("You don't have enough coin");
        }
        else {  
            buyAmount -= sellAmount;
            console.log(`kalan`, buyAmount)
            sellTotal = Number(parseFloat(sellPrice * sellAmount).toFixed(3));
            profit = parseFloat((sellPrice - buyPrice) * (sellAmount)).toFixed(3);
            var markup = '<tr id =' + number + '>'
               
                + '<td id = "name' + number + '">' + sellName + '</td>'
                + '<td id = "amount' + number + '">' + sellAmount + '</td>'
                + '<td id = "price' + number + '">' + sellPrice + '</td>'
                + '<td id = "total' + number + '">' + sellTotal + '</td>'
                + '<td>SELL</td>'
                + '<td id = "profit' + number + '">' + profit + '</td>'
                + '</tr>';
            $("#briefTable").append(markup);
            number++;
        }
        $("#amount-"+id).html(buyAmount);

        $("#staticBackdrop").modal('toggle');
    }
    sellTotal = 0;
}
