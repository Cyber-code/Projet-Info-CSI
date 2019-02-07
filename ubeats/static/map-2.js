var client_x
var client_y
var bike_x
var bike_y
var img
var scale
var scaleMaison

var hasMap = true;
var data_map;
var data_chemin;
var data_client;
var data_bike;

function setup() {
	scale = 2.4;
	scaleMaison = 2.1;
	createCanvas(scale*300, scale*300);
}

function draw() {
	if(hasMap) {
		background(240); // pour la couleur du fond
		
		// on récupère les données en JSON
		// à retirer pour le code réel
		var data_client = recup_client()
		var data_map = recup_map()
		var data_chemin = recup_chemin()
		var data_bike = recup_bike()

		// on trace la map
		var map = JSON.parse(data_map)["map"]
		
		stroke(0, 0, 0) // lignes en noir
		
		for(var i = 0 ; i < map.length ; i++){
			line(scale*map[i]["x1"], scale*map[i]["y1"], scale*map[i]["x2"], scale*map[i]["y2"])
		}
		
		// on affiche le client
		var client = JSON.parse(data_client)["user"]

		client_x = client[0]["x"]
		client_y = client[0]["y"]

		maison(scale*client_x, scale*client_y, scale*3, scale*10, 5) // on affiche la maison du client
		
		// on affiche le chemin
		var chemin = JSON.parse(data_chemin)["chemin"]
		
		stroke(255, 0, 0) // lignes en rouge
		
		for(var i = 0 ; i < chemin.length ; i++){
			line(scale*chemin[i]["x1"], scale*chemin[i]["y1"], scale*chemin[i]["x2"], scale*chemin[i]["y2"])
		}
		
		// on affiche le biker
		var bike = JSON.parse(data_bike)["bike"]
		
		bike_x = bike[0]["x"]
		bike_y = bike[0]["y"]

		velo(scale*bike_x, scale*bike_y, scale*3, scale*10, 5); // on affiche le vélo du livreur
		
	} else {
		text("Votre livreur n'a pas récupéré la commande", 100, 100)
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
	if(mouseIsPressed && mouseX < client_x*scale + marge && mouseX > client_x*scale - marge && mouseY < client_y*scale + marge && mouseY > client_y*scale - marge) {
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



function recup_client(){
	return JSON.stringify(
	{
		"user": [
			{"x": 140, "y": 100}
		]
	})
}

function recup_chemin(){
	return JSON.stringify(
	{
		"chemin": [
			{
				"x1": 90,
				"y1": 180,
				"x2": 90,
				"y2": 200,
				"f": 7,
				"to": 7,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 200,
				"x2": 90,
				"y2": 220,
				"f": 8,
				"to": 8,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 220,
				"x2": 90,
				"y2": 250,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}, 
			{
				"x1": 90,
				"y1": 180,
				"x2": 90,
				"y2": 160,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}, 
			{
				"x1": 90,
				"y1": 160,
				"x2": 90,
				"y2": 140,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}, 
			{
				"x1": 90,
				"y1": 140,
				"x2": 90,
				"y2": 100,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}, 
			{
				"x1": 90,
				"y1": 100,
				"x2": 90,
				"y2": 80,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}, 
			{
				"x1": 90,
				"y1": 80,
				"x2": 90,
				"y2": 60,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}, 
			{
				"x1": 90,
				"y1": 60,
				"x2": 90,
				"y2": 40,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}, 
			{
				"x1": 90,
				"y1": 40,
				"x2": 110,
				"y2": 20,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}, 
			{
				"x1": 110,
				"y1": 20,
				"x2": 130,
				"y2": 10,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}, 
			{
				"x1": 130,
				"y1": 10,
				"x2": 140,
				"y2": 10,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}
		]
	})
}

function recup_bike(){
	return JSON.stringify(
		{
			"bike": [
				{
					"x":90, 
					"y": 140
				}
			]
		}
	)
}

function recup_map(){
	return JSON.stringify(
	{
		"map": [ 
			{
				"x1": 190,
				"y1": 40,
				"x2": 170,
				"y2": 20,
				"f": 1,
				"to": 4,
				"n": "Round St"
			},
			{
				"x1": 170,
				"y1": 20,
				"x2": 150,
				"y2": 10,
				"f": 5,
				"to": 8,
				"n": "Round St"
			},
			{
				"x1": 150,
				"y1": 10,
				"x2": 130,
				"y2": 10,
				"f": 9,
				"to": 11,
				"n": "Round St"
			},
			{
				"x1": 130,
				"y1": 10,
				"x2": 110,
				"y2": 20,
				"f": 12,
				"to": 15,
				"n": "Round St"
			},
			{
				"x1": 110,
				"y1": 20,
				"x2": 90,
				"y2": 40,
				"f": 16,
				"to": 20,
				"n": "Round St"
			},
			{
				"x1": 170,
				"y1": 80,
				"x2": 110,
				"y2": 20,
				"f": 1,
				"to": 20,
				"n": "Christopher St"
			},
			{
				"x1": 90,
				"y1": 40,
				"x2": 70,
				"y2": 40,
				"f": 1,
				"to": 4,
				"n": "Charles St"
			},
			{
				"x1": 70,
				"y1": 40,
				"x2": 50,
				"y2": 40,
				"f": 5,
				"to": 9,
				"n": "Charles St"
			},
			{
				"x1": 90,
				"y1": 60,
				"x2": 70,
				"y2": 60,
				"f": 1,
				"to": 4,
				"n": "Grove St"
			},
			{
				"x1": 70,
				"y1": 60,
				"x2": 50,
				"y2": 60,
				"f": 5,
				"to": 9,
				"n": "Grove St"
			},
			{
				"x1": 90,
				"y1": 80,
				"x2": 70,
				"y2": 80,
				"f": 1,
				"to": 4,
				"n": "Carmine St"
			},
			{
				"x1": 70,
				"y1": 80,
				"x2": 50,
				"y2": 80,
				"f": 5,
				"to": 9,
				"n": "Carmine St"
			},
			{
				"x1": 50,
				"y1": 40,
				"x2": 50,
				"y2": 60,
				"f": 1,
				"to": 4,
				"n": "Leroy St"
			},
			{
				"x1": 50,
				"y1": 60,
				"x2": 50,
				"y2": 80,
				"f": 5,
				"to": 9,
				"n": "Leroy St"
			},
			{
				"x1": 70,
				"y1": 40,
				"x2": 70,
				"y2": 60,
				"f": 1,
				"to": 4,
				"n": "Jones St"
			},
			{
				"x1": 70,
				"y1": 60,
				"x2": 70,
				"y2": 80,
				"f": 5,
				"to": 9,
				"n": "Jones St"
			},
			{
				"x1": 90,
				"y1": 100,
				"x2": 70,
				"y2": 100,
				"f": 1,
				"to": 4,
				"n": "Downing St"
			},
			{
				"x1": 70,
				"y1": 100,
				"x2": 30,
				"y2": 100,
				"f": 5,
				"to": 12,
				"n": "Downing St"
			},
			{
				"x1": 30,
				"y1": 100,
				"x2": 10,
				"y2": 100,
				"f": 13,
				"to": 14,
				"n": "Downing St"
			},
			{
				"x1": 90,
				"y1": 140,
				"x2": 70,
				"y2": 140,
				"f": 1,
				"to": 2,
				"n": "Perry St"
			},
			{
				"x1": 70,
				"y1": 140,
				"x2": 50,
				"y2": 140,
				"f": 3,
				"to": 3,
				"n": "Perry St"
			},
			{
				"x1": 50,
				"y1": 140,
				"x2": 30,
				"y2": 140,
				"f": 5,
				"to": 4,
				"n": "Perry St"
			},
			{
				"x1": 30,
				"y1": 140,
				"x2": 10,
				"y2": 140,
				"f": 7,
				"to": 5,
				"n": "Perry St"
			},
			{
				"x1": 70,
				"y1": 100,
				"x2": 70,
				"y2": 140,
				"f": 1,
				"to": 4,
				"n": "Bethune St"
			},
			{
				"x1": 30,
				"y1": 100,
				"x2": 30,
				"y2": 140,
				"f": 1,
				"to": 4,
				"n": "Bank St"
			},
			{
				"x1": 10,
				"y1": 100,
				"x2": 10,
				"y2": 140,
				"f": 1,
				"to": 4,
				"n": "Hudson St"
			},
			{
				"x1": 90,
				"y1": 160,
				"x2": 70,
				"y2": 160,
				"f": 1,
				"to": 2,
				"n": "Jane St"
			},
			{
				"x1": 70,
				"y1": 160,
				"x2": 50,
				"y2": 160,
				"f": 3,
				"to": 4,
				"n": "Jane St"
			},
			{
				"x1": 50,
				"y1": 160,
				"x2": 30,
				"y2": 160,
				"f": 5,
				"to": 6,
				"n": "Jane St"
			},
			{
				"x1": 30,
				"y1": 160,
				"x2": 10,
				"y2": 160,
				"f": 7,
				"to": 8,
				"n": "Jane St"
			},
			{
				"x1": 90,
				"y1": 180,
				"x2": 70,
				"y2": 180,
				"f": 1,
				"to": 2,
				"n": "Horacio St"
			},
			{
				"x1": 70,
				"y1": 180,
				"x2": 50,
				"y2": 180,
				"f": 3,
				"to": 4,
				"n": "Horacio St"
			},
			{
				"x1": 50,
				"y1": 180,
				"x2": 30,
				"y2": 180,
				"f": 5,
				"to": 6,
				"n": "Horacio St"
			},
			{
				"x1": 30,
				"y1": 180,
				"x2": 10,
				"y2": 180,
				"f": 7,
				"to": 8,
				"n": "Horacio St"
			},
			{
				"x1": 90,
				"y1": 200,
				"x2": 70,
				"y2": 200,
				"f": 1,
				"to": 2,
				"n": "Gansevoort St"
			},
			{
				"x1": 70,
				"y1": 200,
				"x2": 50,
				"y2": 200,
				"f": 3,
				"to": 4,
				"n": "Gansevoort St"
			},
			{
				"x1": 50,
				"y1": 200,
				"x2": 30,
				"y2": 200,
				"f": 5,
				"to": 6,
				"n": "Gansevoort St"
			},
			{
				"x1": 30,
				"y1": 200,
				"x2": 10,
				"y2": 200,
				"f": 7,
				"to": 8,
				"n": "Gansevoort St"
			},
			{
				"x1": 70,
				"y1": 160,
				"x2": 70,
				"y2": 180,
				"f": 1,
				"to": 2,
				"n": "King St"
			},
			{
				"x1": 70,
				"y1": 180,
				"x2": 70,
				"y2": 200,
				"f": 3,
				"to": 4,
				"n": "King St"
			},
			{
				"x1": 50,
				"y1": 160,
				"x2": 50,
				"y2": 180,
				"f": 1,
				"to": 2,
				"n": "Sullivan St"
			},
			{
				"x1": 50,
				"y1": 180,
				"x2": 50,
				"y2": 200,
				"f": 3,
				"to": 4,
				"n": "Sullivan St"
			},
			{
				"x1": 30,
				"y1": 160,
				"x2": 30,
				"y2": 180,
				"f": 1,
				"to": 2,
				"n": "Thompson St"
			},
			{
				"x1": 30,
				"y1": 180,
				"x2": 30,
				"y2": 200,
				"f": 3,
				"to": 4,
				"n": "Thompson St"
			},
			{
				"x1": 10,
				"y1": 160,
				"x2": 10,
				"y2": 180,
				"f": 1,
				"to": 2,
				"n": "Wooster St"
			},
			{
				"x1": 10,
				"y1": 180,
				"x2": 10,
				"y2": 200,
				"f": 3,
				"to": 4,
				"n": "Wooster St"
			},
			{
				"x1": 210,
				"y1": 50,
				"x2": 190,
				"y2": 50,
				"f": 1,
				"to": 1,
				"n": "Greene St"
			},
			{
				"x1": 210,
				"y1": 50,
				"x2": 210,
				"y2": 90,
				"f": 1,
				"to": 4,
				"n": "Spring St"
			},
			{
				"x1": 210,
				"y1": 90,
				"x2": 190,
				"y2": 90,
				"f": 1,
				"to": 1,
				"n": "Mercer St"
			},
			{
				"x1": 230,
				"y1": 100,
				"x2": 210,
				"y2": 100,
				"f": 1,
				"to": 2,
				"n": "Crosby St"
			},
			{
				"x1": 210,
				"y1": 100,
				"x2": 190,
				"y2": 100,
				"f": 3,
				"to": 4,
				"n": "Crosby St"
			},
			{
				"x1": 230,
				"y1": 120,
				"x2": 210,
				"y2": 120,
				"f": 1,
				"to": 2,
				"n": "Jersey St"
			},
			{
				"x1": 210,
				"y1": 120,
				"x2": 190,
				"y2": 120,
				"f": 3,
				"to": 4,
				"n": "Jersey St"
			},
			{
				"x1": 230,
				"y1": 140,
				"x2": 210,
				"y2": 140,
				"f": 1,
				"to": 2,
				"n": "Mott St"
			},
			{
				"x1": 210,
				"y1": 140,
				"x2": 190,
				"y2": 140,
				"f": 3,
				"to": 4,
				"n": "Mott St"
			},
			{
				"x1": 230,
				"y1": 100,
				"x2": 230,
				"y2": 120,
				"f": 1,
				"to": 1,
				"n": "Greenwich St"
			},
			{
				"x1": 230,
				"y1": 120,
				"x2": 230,
				"y2": 140,
				"f": 1,
				"to": 1,
				"n": "Greenwich St"
			},
			{
				"x1": 210,
				"y1": 100,
				"x2": 210,
				"y2": 120,
				"f": 1,
				"to": 1,
				"n": "Mulberry St"
			},
			{
				"x1": 210,
				"y1": 120,
				"x2": 210,
				"y2": 140,
				"f": 2,
				"to": 2,
				"n": "Mulberry St"
			},
			{
				"x1": 190,
				"y1": 100,
				"x2": 190,
				"y2": 120,
				"f": 1,
				"to": 1,
				"n": "Broome St"
			},
			{
				"x1": 190,
				"y1": 120,
				"x2": 190,
				"y2": 140,
				"f": 2,
				"to": 2,
				"n": "Broome St"
			},
			{
				"x1": 230,
				"y1": 160,
				"x2": 210,
				"y2": 160,
				"f": 1,
				"to": 1,
				"n": "Lafayette St"
			},
			{
				"x1": 210,
				"y1": 160,
				"x2": 190,
				"y2": 160,
				"f": 2,
				"to": 2,
				"n": "Lafayette St"
			},
			{
				"x1": 230,
				"y1": 160,
				"x2": 230,
				"y2": 200,
				"f": 1,
				"to": 1,
				"n": "Kenmare St"
			},
			{
				"x1": 230,
				"y1": 200,
				"x2": 190,
				"y2": 200,
				"f": 1,
				"to": 1,
				"n": "Chrystie St"
			},
			{
				"x1": 210,
				"y1": 140,
				"x2": 210,
				"y2": 160,
				"f": 1,
				"to": 1,
				"n": "Bowery St"
			},
			{
				"x1": 190,
				"y1": 220,
				"x2": 150,
				"y2": 220,
				"f": 1,
				"to": 2,
				"n": "Elisabeth St"
			},
			{
				"x1": 150,
				"y1": 220,
				"x2": 110,
				"y2": 220,
				"f": 3,
				"to": 3,
				"n": "Elisabeth St"
			},
			{
				"x1": 110,
				"y1": 220,
				"x2": 90,
				"y2": 220,
				"f": 4,
				"to": 5,
				"n": "Elisabeth St"
			},
			{
				"x1": 190,
				"y1": 180,
				"x2": 150,
				"y2": 180,
				"f": 1,
				"to": 2,
				"n": "Hester St"
			},
			{
				"x1": 150,
				"y1": 180,
				"x2": 110,
				"y2": 180,
				"f": 3,
				"to": 3,
				"n": "Hester St"
			},
			{
				"x1": 110,
				"y1": 180,
				"x2": 90,
				"y2": 180,
				"f": 4,
				"to": 5,
				"n": "Hester St"
			},
			{
				"x1": 190,
				"y1": 140,
				"x2": 150,
				"y2": 140,
				"f": 1,
				"to": 2,
				"n": "Centre St"
			},
			{
				"x1": 150,
				"y1": 140,
				"x2": 110,
				"y2": 140,
				"f": 3,
				"to": 3,
				"n": "Centre St"
			},
			{
				"x1": 110,
				"y1": 140,
				"x2": 90,
				"y2": 140,
				"f": 4,
				"to": 5,
				"n": "Centre St"
			},
			{
				"x1": 150,
				"y1": 140,
				"x2": 150,
				"y2": 180,
				"f": 1,
				"to": 1,
				"n": "Essex St"
			},
			{
				"x1": 150,
				"y1": 180,
				"x2": 150,
				"y2": 220,
				"f": 2,
				"to": 2,
				"n": "Essex St"
			},
			{
				"x1": 130,
				"y1": 140,
				"x2": 130,
				"y2": 180,
				"f": 1,
				"to": 1,
				"n": "Ludlow St"
			},
			{
				"x1": 130,
				"y1": 180,
				"x2": 130,
				"y2": 220,
				"f": 2,
				"to": 2,
				"n": "Ludlow St"
			},
			{
				"x1": 130,
				"y1": 100,
				"x2": 90,
				"y2": 60,
				"f": 1,
				"to": 2,
				"n": "Allen St"
			},
			{
				"x1": 190,
				"y1": 70,
				"x2": 170,
				"y2": 80,
				"f": 1,
				"to": 1,
				"n": "Delancey St"
			},
			{
				"x1": 170,
				"y1": 80,
				"x2": 150,
				"y2": 90,
				"f": 2,
				"to": 2,
				"n": "Delancey St"
			},
			{
				"x1": 150,
				"y1": 90,
				"x2": 150,
				"y2": 110,
				"f": 3,
				"to": 3,
				"n": "Delancey St"
			},
			{
				"x1": 190,
				"y1": 130,
				"x2": 150,
				"y2": 110,
				"f": 1,
				"to": 1,
				"n": "Division St"
			},
			{
				"x1": 150,
				"y1": 110,
				"x2": 130,
				"y2": 100,
				"f": 2,
				"to": 2,
				"n": "Division St"
			},
			{
				"x1": 130,
				"y1": 100,
				"x2": 90,
				"y2": 100,
				"f": 3,
				"to": 3,
				"n": "Division St"
			},
			{
				"x1": 190,
				"y1": 40,
				"x2": 190,
				"y2": 50,
				"f": 1,
				"to": 1,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 50,
				"x2": 190,
				"y2": 70,
				"f": 2,
				"to": 2,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 70,
				"x2": 190,
				"y2": 90,
				"f": 3,
				"to": 3,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 90,
				"x2": 190,
				"y2": 100,
				"f": 4,
				"to": 4,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 100,
				"x2": 190,
				"y2": 120,
				"f": 5,
				"to": 5,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 120,
				"x2": 190,
				"y2": 130,
				"f": 6,
				"to": 6,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 130,
				"x2": 190,
				"y2": 140,
				"f": 7,
				"to": 7,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 140,
				"x2": 190,
				"y2": 160,
				"f": 8,
				"to": 8,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 160,
				"x2": 190,
				"y2": 180,
				"f": 9,
				"to": 9,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 180,
				"x2": 190,
				"y2": 200,
				"f": 10,
				"to": 10,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 200,
				"x2": 190,
				"y2": 220,
				"f": 11,
				"to": 11,
				"n": "Grand St"
			},
			{
				"x1": 190,
				"y1": 220,
				"x2": 190,
				"y2": 250,
				"f": 12,
				"to": 12,
				"n": "Grand St"
			},
			{
				"x1": 90,
				"y1": 40,
				"x2": 90,
				"y2": 60,
				"f": 1,
				"to": 1,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 60,
				"x2": 90,
				"y2": 80,
				"f": 2,
				"to": 2,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 80,
				"x2": 90,
				"y2": 100,
				"f": 3,
				"to": 3,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 100,
				"x2": 90,
				"y2": 140,
				"f": 4,
				"to": 4,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 140,
				"x2": 90,
				"y2": 160,
				"f": 5,
				"to": 5,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 160,
				"x2": 90,
				"y2": 180,
				"f": 6,
				"to": 6,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 180,
				"x2": 90,
				"y2": 200,
				"f": 7,
				"to": 7,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 200,
				"x2": 90,
				"y2": 220,
				"f": 8,
				"to": 8,
				"n": "Vauban St"
			},
			{
				"x1": 90,
				"y1": 220,
				"x2": 90,
				"y2": 250,
				"f": 9,
				"to": 9,
				"n": "Vauban St"
			}
		]
	})
}

