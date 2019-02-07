var userGUID;
var client;
$("#DevClient").click(function (e) { 
  e.preventDefault();
  document.getElementById('contain').classList = 'contain leftA';
  //document.getElementById('ContainerProduits').classList = 'container centerA'; //permet de faire l'animation

  launchClientServer();
  NewClient();

});
function heartBeat(){
  console.log("webBeats");
  message = new Paho.MQTT.Message("web");
  message.destinationName = "webBeats:"+userGUID;
  client.send(message);
}
// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Connected");
  client.subscribe("prod:"+userGUID);
  client.subscribe("DeliveryManPosition");
  client.subscribe("webtest");
  
  var heart = setInterval(heartBeat,10000); //toutes les 10 secondes
  /*message = new Paho.MQTT.Message("Hello");
  message.destinationName = "World";
  client.send(message);*/
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  //console.log(message);
  //console.log(message.destinationName);
  
  if (message.destinationName == ("prod:"+userGUID)) {
    var result = JSON.parse(message.payloadString);
    //console.log(result.liste);
    $("#nameUser").text(result.user.Name);
    userID = result.user.ID;
    $.post("/setUserID/", {"userID":userID}).done(() => {});
    
    $.post("/getProduct/",{'produits':JSON.stringify(result.liste)}).done(function(resp){
      $("#allProd").html(resp.prod);
      $(".prod").each(function(){
        var produit = $(this)[0];
        var btn = produit.childNodes[2*(produit.childElementCount -2) + 1];

        btn.addEventListener('click',function (ele) { 
          var prod = ele.target.parentElement;
          var choix = produit.lastElementChild.textContent;
          console.log("Produit choisi : "+ choix);
          message = new Paho.MQTT.Message(choix);
          message.destinationName = "setCommande:"+userGUID;
          client.send(message);
          heartBeat();
          location.href = "carte"
         });
      });
    })

  }
}


function launchClientServer(){
  $.post("/newClient/",'').done(function(resp){
    userGUID = resp;
  })


}

function NewClient(){
  var broker = {"hostname" : "51.75.120.244","port" :  Number(61614)};
  // Create a client instance
  console.log(broker.hostname);
  client = new Paho.MQTT.Client(broker.hostname, Number(broker.port), "clientId");

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({onSuccess:onConnect});


}