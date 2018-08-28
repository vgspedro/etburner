function burnTicket(ticket){
    $('#modal-status').hide()
    date = $('#datevalidate').val()

    $('.w3-overlay').show()
    setTimeout(function(){

    $.ajax({
        url:path+'api/booking/validate-ticket',
        data:'ticket='+ticket+'&id='+localStorage.getItem('acess')+'&date='+date,
        type:'POST',
        cache:false,
        success:function(d){
            $('#datevalidate').val(0)

            console.log(d)
            $('.w3-overlay').hide()
            if (d.message == "success") {
                playSuccess()
                addToLocalStorageArray(d.ticket)
            }
            else if (d.message == "db_fail") {
                playInvalid()
                $('.ticket-status').text('Ticket não existe!!')
                $('#modal-status').show()
            }
            else if(d.message == "used"){
                playInvalid()
                $('.ticket-status').text('Usado')
                $('#modal-status').show()
            }
            else if(d.message == "canceled"){
                playInvalid()
                $('.ticket-status').text('Cancelado')
                $('#modal-status').show()
            }
            else if(d.message == "Authentication Required"){
                playInvalid()
                $('.modal-credentials').show()
                logout()
            }
            else if(d.message == "no_match"){
                playInvalid()
                $('.ticket-status').text('Bilhete Externo')
                $('#modal-status').show()
            }
            else if (d.message == "dates") {
                playInvalid()
                $('.ticket-status').html('<span class="w3-xlarge">Este bilhete é para:<br><b>'+d.to+'</b><br>e não para<br><b>'+d.now+'</b><br><span class="w3-section">Pretende Utilizar?</span><div class="w3-row"><button onclick="$(\'#modal-status\').hide()" type="button" class="w3-col s6 w3-block w3-button w3-border w3-margin-top"><i class="fa fa-times"></i></button><button class="w3-col s6 w3-button w3-margin-top w3-border w3-block w3-green" onclick="$(\'#datevalidate\').val(1);burnTicket(\''+d.ticket+'\')"><i class="fa fa-check"></i></button></div></span>')
                $('#modal-status').show()
            }
            else {
                playInvalid()
                $('.modal-credentials').show()
                logout()
            }
        },
        error:function(){
            $('#datevalidate').val(0)
            noWifi()
        }
    })
    
    }, 500)
}

function scanError(error){
    $('.modal-scan-error-txt').html('Verifique: '+error)
    $('#modal-scan-error').show()
    playInvalid()
    navigator.vibrate(2000)
}

function noWifi(){
    $('.w3-overlay').hide()
    $('#modal-internet').show()
    playWiFiError()
    navigator.vibrate(2000)
}

x = document.getElementById("nowifi")
function playWiFiError() { x.play() }

y = document.getElementById("invalid")
function playInvalid() { y.play() }

z = document.getElementById("success")
function playSuccess() { z.play() }

function addToLocalStorageArray(ticket){
    value = ticket
    data = localStorage.getItem("ticket")
    data = JSON.parse(data)
    data[data.length] = [value]
    localStorage.setItem("ticket", JSON.stringify(data))
    setTimeout(function(){
        showTickets()
    }, 500)
}

function setLocalStorageArray(){
    setTimeout(function(){
        $('#display').addClass('w3-hide')
    }, 500)
    data = []
    data = JSON.stringify(data)
    localStorage.setItem("ticket", data)
}

function logout(){
    $('.unlock').addClass('w3-hide')
    $('.login').removeClass('w3-hide')
    localStorage.setItem("acess",'')
}

function scan(){
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled){
                if(result.format == "QR_CODE"){
                    burnTicket(result.text)
                }
            }
        },
        function (error) {
            scanError(error)
        },
        {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
        }
    )
}

function showTickets(){
    data = localStorage.getItem("ticket")
    data = JSON.parse(data)
    html = ""
    if(data.length > 0){
        i=0
        for(count = 0; count < data.length; count++){
            i = count+1
            html +="<tr><td class='w3-text-red'><i class='fa fa-free-code-camp'></i>"+i+"</td><td>" + data[count][0] + "</td></tr>"
        }
        $("#table-results").html(html)
        $('#display').removeClass('w3-hide')
    }
    else
        $('#display').addClass('w3-hide')
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    }
    /*,
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }*/
}
