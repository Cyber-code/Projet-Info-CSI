Ensemble de nos fichiers pour notre projet d'informatique.

Chaque dossier contient un composant du projet.

Pour agent :
	
	
    agent/
	├── GPS_Fonction.py
	├── boiteAoutils.py
	└── test_agent.py

   Contient donc le code permettant la communication des agents dans "test_agent.py"
   GPS_Fonction.py contient toute les fonctions permettant de determiner le chemin/distance pourl'agent.

Pour consommateur :

	ubeats/
	├── __init__.py
	├── boiteAoutils.py
	├── celery_init.py
	├── customer.py
	├── dump.rdb
	├── static
	│   ├── app.js
	│   ├── burger.jpg
	│   ├── css
	│   │   ├── bootstrap-grid.css
	│   │   ├── bootstrap.css
	│   │   ├── bootstrap.min.css
	│   │   ├── map.css
	│   │   └── style.css
	│   ├── index.html
	│   ├── jquery.js
	│   ├── logo_ubeats.png
	│   ├── map-2.js
	│   ├── map.js
	│   ├── prod.png
	│   ├── pub.jpg
	│   ├── pub.png
	│   └── waiting.gif
	├── templates
	│   ├── carte.html
	│   ├── coucou
	│   ├── home.html
	│   └── produit.html
	└── ubeats.wsgi

	
   ./ubeats contient l'ensemble des fichiers pour le commercant ainsi que pour le site web (__init__.py pour ne citer que lui)

Pour consommateur :

	Commercant/
	├── Commercant.py
	└── boiteAoutils.py

   Communication des commercants avec les autres composants du projet

