# -- coding: utf-8 --
"""
Created on Mon Jan 21 15:17:17 2019

@author:mathieu
        etienne
        nicolas
"""

import paho.mqtt.client as mqtt
import time
import json
import math
from uuid import uuid4

import boiteAoutils as tools
import GPS_Fonction as GPS

broker="51.75.120.244" #51.75.120.244
agentGUID = str(uuid4().hex)



""" ----- FONCTIONS ON_EVENT ----- """

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    if rc ==0:
        print("Connected")
    else:
        print("Not connected")
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe(agentGUID)
    client.publish("GetDeliveryManInfo", agentGUID)

def on_disconnect(client, userdata, rc):
    print("\nDisconnected")


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    #myOutils.configid(msg)
    
    print("\n## NOUVEAU MESSAGE ##")
    print("TOPIC : " + msg.topic)
    #print("INFO : " + str(msg.payload))
    
    if msg.topic == agentGUID:
        print("[TOPIC TYPE] agentGUID")
        topic_agentGUID(client, msg)
    
    if msg.topic == agent["ID"]:
        print("[TOPIC TYPE] agentID")
        topic_agentID(client, msg)
        
    elif msg.topic=="AskForQuote":
        print("[TOPIC TYPE] AskForQuote")
        topic_AskForQuote(client,msg)
        
    elif msg.topic=="ExecOrder":
        print("[TOPIC TYPE] ExecOrder")
        global modeExec 
        modeExec = True
        global msgHack
        msgHack = msg
        global clientHack
        clientHack = client
        
        #topic_ExecOrder(client,msg)
        
    elif msg.topic=="ShopGiveProduct":
        print("[TOPIC TYPE] ShopGiveProduct")
        topic_ShopGiveProduct(client,msg)



""" TRAITEMENT EN FONCTION DU TOPIC """

def topic_agentGUID(client, msg):
    global agent
    global bike
    
    agent = json.loads(msg.payload)
    client.subscribe("AskForQuote")
    client.subscribe("ExecOrder")
    client.subscribe(agent["ID"]) # nécessaire pour récup la map
    client.publish("GetMapInfo", agent["ID"])
    
    bike = {"ID":agent["ID"],"X":agent["X"],"Y":agent["Y"]}
    
    myOutils.configid(msg)
    
    
def topic_agentID(client, msg):
    global map
    global req
    global mapSave
    
    req = str(msg.payload.decode("utf-8")).split("|") # séparer le message de l'entête et décoder
    subtopic = req[0]
    mapSave = req[1]
    
    print("SUBTOPIC: "+ subtopic)
    
    if subtopic == "GetMapInfo":
        map = msg.payload # map = map dégeu
        
        #client.publish("SetOrder", "h1:m1p1") # @test
        #print("\n# Commande passée")
        
    elif subtopic == "ShopGiveProduct":
        global modeDeliver 
        modeDeliver = True
        global msgHack
        msgHack = msg
        global clientHack
        clientHack = client


def topic_Deliver():
    global bike
    global clientHack
    global msgHack
    
    produitID = req[1]
    
    print("\nLivraison en cours...")
    
    carte_show, carte_gps, liste = GPS.Map_extract(map) # clean map extract
    
    chemin_p, chemin_c, distance = GPS.GPS(bike["X"], bike["Y"], commande["CustomerX"], commande["CustomerY"], carte_show, carte_gps, liste)
    
    itineraire = chemin_c
    
    client.publish("chemin:"+ commande["CustomerId"], json.dumps(itineraire))
    client.publish("map:"+ commande["CustomerId"], json.dumps(carte_show))
    client.publish("client:"+ commande["CustomerId"], json.dumps({"x": commande["CustomerX"], "y": commande["CustomerY"]}))
    
    for i in range(len(itineraire)):
        while [bike["X"], bike["Y"]] != itineraire[i]:
            deplacer_velo([bike["X"], bike["Y"]], itineraire[i], agent["Speed"]) # déplacer le vélo
            
            bike_send = {"ID":str(agent["ID"]),"X":str(int(bike["X"])),"Y":str(int(bike["Y"]))}
            
            client.publish("DeliveryManPosition", json.dumps(bike_send))
            time.sleep(0.05)
            client.publish("WebDeliver:"+ commande["CustomerId"], json.dumps(bike_send))
        
    client.publish("DeliveryManGiveProduct", json.dumps(commande))
    print("\n# Commande livrée !")
    print("\n## FIN")
   
   
def topic_ExecOrder():
    global bike
    global clientHack
    global msgHack
    
    commande = json.loads(msgHack.payload)
    
    if commande["DeliveryManId"] == agent["ID"]:
        
        print("\nNouvelle commance reçue !")
        print("\nDéplacement vers le magasin...")
        
        carte_show, carte_gps, liste = GPS.Map_extract(map) # clean map extract
        
        chemin_p, chemin_c, distance = GPS.GPS(bike["X"], bike["Y"], commande["ShopX"], commande["ShopY"], carte_show, carte_gps, liste)
        
        itineraire = chemin_c
        
        for i in range(len(itineraire)):
            while [bike["X"], bike["Y"]] != itineraire[i]:
                deplacer_velo([bike["X"], bike["Y"]], itineraire[i], agent["Speed"]) # déplacer le vélo
                
                bike_send = {"ID":str(agent["ID"]),"X":str(int(bike["X"])),"Y":str(int(bike["Y"]))}
                clientHack.publish("DeliveryManPosition",json.dumps(bike_send))
                time.sleep(0.05)
            
        clientHack.publish("DeliveryManAskProduct", json.dumps(commande))
        print("\nArrivée au magasin")
        
        #client.publish(agent["ID"], "ShopGiveProduct|m1p1") # @test
        #print("\nProduit récupéré")
 

def topic_AskForQuote(client, msg):
    global commande
    
    commande = json.loads(msg.payload)
    
    # Calcul chercher produit magasin
    deltaX = abs(commande["ShopX"] - agent["X"])
    deltaY = abs(commande["ShopY"] - agent["Y"])
    distance_agent_mag = math.sqrt(deltaX**2 + deltaY**2)
    
    temps_agent_mag = distance_agent_mag / agent["Speed"]
    # Calcul livrer produit customer
    deltaX = abs(commande["CustomerX"] - commande["ShopX"])    
    deltaY = abs(commande["CustomerY"] - commande["ShopY"])
    distance_mag_cust = math.sqrt(deltaX**2 + deltaY**2)
    
    temps_mag_cust = distance_mag_cust / agent["Speed"]
    
    # update infos commande
    commande["DeliveryManId"] = agent["ID"]    
    commande["Delay"] = round(temps_agent_mag + temps_mag_cust)
    
    client.publish("Quote", json.dumps(commande))
    print("\n# Réponse envoyée...")
    

def deplacer_velo(coord_depart, coord_arrivee, vit_bike):
    global bike
    
    #vit_bike *= 5
    
    deltaX = abs(bike["X"] - coord_arrivee[0])
    deltaY = abs(bike["Y"] - coord_arrivee[1])
    dist_restante = math.sqrt(deltaX**2 + deltaY**2)
    
    if dist_restante > vit_bike:
        deplacement_x = (vit_bike / dist_restante) * deltaX
        deplacement_y = (vit_bike / dist_restante) * deltaY
        
        if bike["X"] > coord_arrivee[0]:
            bike["X"] = bike["X"] - deplacement_x
        else:
            bike["X"] = bike["X"] + deplacement_x
        
        if bike["Y"] > coord_arrivee[1]:
            bike["Y"] = bike["Y"] - deplacement_y
        else:
            bike["Y"] = bike["Y"] + deplacement_y
    else:
        bike["X"] = coord_arrivee[0]
        bike["Y"] = coord_arrivee[1]

""" ---- CONFIGURATION ---- """

client = mqtt.Client(agentGUID)

client.on_connect = on_connect
client.on_message = on_message
client.on_disconnect = on_disconnect

print("agentGUID: "+ agentGUID)
myOutils=tools.outils("agent", agentGUID, client)

continuer = True
modeExec = False
modeDeliver = False
clientHack = None
msgHack = None

"""" ----- DEBUT CODE ---- -"""

client.connect(broker,1883,60)

client.loop_start()

while continuer:
    time.sleep(1)
    
    if modeExec: # buffer hack
        topic_ExecOrder()
        modeExec = False
        
    if modeDeliver: # buffer hack
        topic_Deliver()
        modeDeliver = False

myOutils.deconnection()