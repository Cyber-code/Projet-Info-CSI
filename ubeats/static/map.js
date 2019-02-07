 var userID = $("#userID").text();
 var userGUID = $("#GUID").text();
 var client;

var client_x
var client_y
var bike_x
var bike_y
var img
var scale
var scaleMaison

var hasMap = 0
var data_map
var data_chemin
var data_client
var data_bike
var data_time


var gif_createImg

function preload() {
	//gif_createImg = createImg("waiting.gif");
	//gif_createImg = loadImage("image.png");	
}


function heartBeat(){
    message = new Paho.MQTT.Message("web");
    message.destinationName = "webBeats:"+userGUID;
    client.send(message);
    console.log("webBeats");
}
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connected");
    console.log(userGUID);
    console.log(userID);
    client.subscribe("WebDeliver:"+userID);
    client.subscribe("chemin:"+userID);
    client.subscribe("map:"+userID);
	client.subscribe("client:"+userID);
	client.subscribe("timeDelivery:"+userID);
    
    var heart = setInterval(heartBeat,10000); //toutes les 10 secondes
}
// called when a message arrives
function onMessageArrived(message) {
    //console.log(message);
    //console.log(message.destinationName);
    
    if (message.destinationName == ("WebDeliver:"+userID)) {
      data_bike = JSON.parse(message.payloadString);
      hasMap++;
    }
    if (message.destinationName == ("chemin:"+userID)) {
        data_chemin = JSON.parse(message.payloadString);
        hasMap++;
    }
    if (message.destinationName == ("map:"+userID)) {
        //console.log(message.payloadString);
        data_map = JSON.parse(message.payloadString);
        hasMap++;
    }
    if (message.destinationName == ("client:"+userID)) {
        data_client = JSON.parse(message.payloadString);
        hasMap++;
	}
	if (message.destinationName == ("timeDelivery:"+userID)) {
		$(".info").removeClass("hide");
		data_time = int(JSON.parse(message.payloadString));
		$("#time").text(data_time);
		var timeOrder = setInterval(function (){
			if ($("#time").text() <=1) {
				clearInterval(timeOrder);
				$("#time").text("1");
			}
			$("#time").text($("#time").text()-1);
			
		},1000); //toutes les 10 secondes
        hasMap++;
    }
  }

var broker = {"hostname" : "51.75.120.244","port" :  Number(61614)};
  // Create a client instance
  console.log(broker.hostname);
  client = new Paho.MQTT.Client(broker.hostname, Number(broker.port), "clientMap");

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({onSuccess:onConnect});


function setup() {
	scale = 2.4;
	scaleMaison = 2.1;
	createCanvas(scale*300, scale*300);
}
var cmap =0;

function draw() {
	if(hasMap >= 5) {
		background(240); // pour la couleur du fond
		
		// on récupère les données en JSON
		// à retirer pour le code réel
		/*var data_client = recup_client()
		var data_map = recup_map()
		var data_chemin = recup_chemin()
		var data_bike = recup_bike()
*/
        // on trace la map
		//var map = JSON.parse(data_map)
        var map = data_map;
        if (cmap == 0   ) {
            console.log(map);
            cmap =1;
        }
		stroke(0, 0, 0) // lignes en noir
        
		for(var i = 0 ; i < map.length ; i++){
            line(scale*map[i]["x1"], scale*-1*map[i]["y1"], scale*map[i]["x2"],scale*-1*map[i]["y2"]);
            //line(0,0,100,100);
		}
		
        // on affiche le client
        //console.log(data_client);
        //var client = JSON.parse(data_client)["user"]
        var client = data_client;

		client_x = client["x"]
		client_y = client["y"]

		maison(scale*client_x, scale*client_y, scale*3, scale*10, 5) // on affiche la maison du client
		
        // on affiche le chemin
        //console.log(data_chemin);
		//var chemin = JSON.parse(data_chemin)["chemin"]
		var chemin = data_chemin;
		strokeWeight(5);
		stroke(255, 0, 0) // lignes en rouge
		
		for(var i = 0 ; i < chemin.length -1; i++){
			line(scale*chemin[i][0], scale*chemin[i][1], scale*chemin[i+1][0],scale*chemin[i+1][1]);
		}
		strokeWeight(1);
		
        // on affiche le biker
        //console.log(data_bike);
        //var bike = JSON.parse(data_bike)["bike"]
        var bike = data_bike;
		
		bike_x = bike["X"]
		bike_y = bike["Y"]

		velo(scale*bike_x, scale*bike_y, scale*3, scale*10, 5); // on affiche le vélo du livreur
		
	} else {
		text("Votre livreur n'a pas récupéré la commande", 100, 100)
        //gif_createImg.position(50, 150);
	}
}

function maison(x, y) {
	beginShape();
	
	fill(50, 50, 50)
	stroke(0, 0, 0)
	
	vertex(x-8*scaleMaison, y-8*scaleMaison)
	vertex(x, y-13*scaleMaison)
	vertex(x+8*scaleMaison, y-8*scaleMaison)
	vertex(x+8*scaleMaison, y+6*scaleMaison)
	vertex(x-8*scaleMaison, y+6*scaleMaison)
	
	endShape(CLOSE);
	
	fenetre(x-4*scaleMaison, y-5*scaleMaison)
	fenetre(x+4*scaleMaison, y-5*scaleMaison)
	
	var marge = 20*scaleMaison
	
	// si on clique sur la maison
	if(mouseIsPressed && bike_x < client_x*scale + marge && mouseX > client_x*scale - marge && mouseY < client_y*scale + marge && mouseY > client_y*scale - marge) {
		bouche_contente(x, y+3*scaleMaison)
		fenetre(x-4*scaleMaison, y-5*scaleMaison, 255, 0, 0)
		fenetre(x+4*scaleMaison, y-5*scaleMaison, 255, 0, 0)
	} else {
		bouche_pas_contente(x, y+3*scaleMaison)
		fenetre(x-4*scaleMaison, y-5*scaleMaison, 220, 220, 220)
		fenetre(x+4*scaleMaison, y-5*scaleMaison, 220, 220, 220)
	}
}

function bouche_pas_contente(x, y) {
	beginShape();
	
	fill(220, 220, 220)
	
	vertex(x-5*scaleMaison, y+3*scaleMaison)
	vertex(x-3*scaleMaison, y+3*scaleMaison)
	vertex(x-3*scaleMaison, y+1*scaleMaison)
	vertex(x+3*scaleMaison, y+1*scaleMaison)
	vertex(x+3*scaleMaison, y+3*scaleMaison)
	vertex(x+5*scaleMaison, y+3*scaleMaison)
	vertex(x+5*scaleMaison, y-1*scaleMaison)
	vertex(x-5*scaleMaison, y-1*scaleMaison)
	
	
	endShape(CLOSE);
}

function bouche_contente(x, y) {
	beginShape();
	
	fill(220, 220, 220)
	
	vertex(x-5*scaleMaison, y-3*scaleMaison)
	vertex(x-3*scaleMaison, y-3*scaleMaison)
	vertex(x-3*scaleMaison, y-1*scaleMaison)
	vertex(x+3*scaleMaison, y-1*scaleMaison)
	vertex(x+3*scaleMaison, y-3*scaleMaison)
	vertex(x+5*scaleMaison, y-3*scaleMaison)
	vertex(x+5*scaleMaison, y+1*scaleMaison)
	vertex(x-5*scaleMaison, y+1*scaleMaison)
	
	
	endShape(CLOSE);
}

function fenetre(x, y, r, g, b) {
	beginShape();
	
	fill(r, g, b)
	
	vertex(x-2*scale, y-2*scale)
	vertex(x-2*scale, y+2*scale)
	vertex(x+2*scale, y+2*scale)
	vertex(x+2*scale, y-2*scale)
	
	endShape(CLOSE);
}

function velo(x, y) {
	
	noFill()
	stroke(0, 0, 0)
	
	// les roues du vélo
	ellipse(x-6*scale, y+5*scale, 7*scale, 7*scale)	
	ellipse(x+6*scale, y+5*scale, 7*scale, 7*scale)	
	
	fill(0, 0, 0)
	
	// la tête du cycliste
	ellipse(x+2*scale, y-10*scale, 3*scale, 3*scale)
	
	beginShape();
	
	vertex(x-1*scale, y+4*scale)
	vertex(x, y+4*scale)
	vertex(x, y)
	vertex(x-2*scale, y-2*scale)
	vertex(x+1*scale, y-5*scale)
	vertex(x+3*scale, y-3*scale)
	vertex(x+6*scale, y-3*scale)
	vertex(x+6*scale, y-4*scale)
	vertex(x+3*scale, y-4*scale)
	vertex(x-1*scale, y-8*scale)
	vertex(x-6*scale, y-3*scale)
	vertex(x-1*scale, y+2*scale)
	
	vertex(x-1*scale, y+4*scale)
	
	endShape(CLOSE);
}
