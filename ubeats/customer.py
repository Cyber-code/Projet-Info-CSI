#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sat Dec 29 22:40:09 2018

@author: clement
+Clotilde + Alexis + Lucas

###########################################Partie consommateur#############################################################################
"""

import paho.mqtt.client as mqtt
import time
import json
import boiteAoutils as myTools
from uuid import uuid4
	#creation d'un guid pour l'utilisateur se connectant

import sys

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):


    if rc ==0:        
        print("Connected")
    else:
        print("Not connected")
        
    
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe(consommateurGUID)
    client.publish("GetCustomerInfo",consommateurGUID)
    

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):

    topicEnCours=msg.topic
    print("\n## NEW MESSAGE ##")
    print("Topic :"+msg.topic)
    #print("Topic :"+msg.topic+" "+ "message : "+str(msg.payload))
  
    if msg.topic == consommateurGUID:       #si le topic est le GUID du conso, on récupère ses infos
        topic_consommateurGUID(client, msg)
    if msg.topic == (consommateurInfos["ID"]):
        topic_getProducts(client,msg)
    if msg.topic == ("DeliveryManGiveProduct"):
	    topic_DeliveryManGiveProduct(client,msg)
    if msg.topic == ("webBeats:"+consommateurGUID):
        webBeats(client)
    if msg.topic == ("setCommande:"+consommateurGUID):
        setOrder(client,msg)

def webBeats(client):
    global sec
    sec = 0
    print("HeartBeat")
    client.publish("CustomerPing",consommateurInfos["ID"])

def  topic_getProducts(client,msg):
    global listeProduits
    global commandePasse
    
    print("GetProduct")

    req=str(msg.payload.decode("utf-8")).split("|")
    #print(req[1])
    i = len(listeProduits) #permet d'avoir la position
    for k in json.loads(req[1]):
        k['id'] = i
        i+=1
        listeProduits.append(k)              #on récupère la liste des produits disponibls
    print(listeProduits)
    envoye = json.dumps({"liste":listeProduits,"user":consommateurInfos})
    client.publish("prod:"+consommateurGUID,envoye)
    
    client.subscribe("setCommande:"+consommateurGUID)

    print("Prod envoye")

#client.publish("DeliveryManGiveProduct",json.dumps({'ID': '52bb1434-fde6-4ede-b450-eb697053f8a2', 'ProductId': 'm1p1', 'ShopId': 'm1', 'ShopX': 50, 'ShopY': 50, 'CustomerId': 'h1', 'CustomerX': 140, 'CustomerY': 10, 'DeliveryManId': 'dm1', 'Delay': 293})) #simulation d'une reception de commande par l'agent


#passage d'une commande avec une liste de produit
def setOrder(client,msg):
    #on passe la commande
    print("#####Passage de la commande#######")

    #Selection d'un produit
    
    global listeProduits
    choix = int(msg.payload)
    print("Vous avez commande ",listeProduits[choix]['Name'])
    
    commande=str(consommateurInfos["ID"])+":"+str(listeProduits[choix]['ID'])
    
    print("commande passe = ",commande)
    
    #la commande est passée, on l'envoie
    client.publish("SetOrder",commande)
    print("La commande a été envoyée sur le serveur")
    
    client.subscribe("DeliveryManGiveProduct")




def topic_consommateurGUID(client, msg):
    global consommateurInfos
    consommateurInfos = json.loads(msg.payload)
    #myOutils.configid(msg)
    print("Nom du client :",consommateurInfos["Name"]) 

    #print(type(consommateurInfos))
    client.subscribe(consommateurInfos["ID"])
    client.subscribe("DeliveryManGiveProduct")
    client.subscribe("webBeats:"+consommateurGUID)
    client.publish("GetProducts",consommateurInfos["ID"])
    
    #Pour simuler :
#client.publish(consommateurInfos["ID"],"GetProducts|"+json.dumps([{'ID': 'm1p1', 'Name': 'Pizza Reine', 'Price': 7.5, 'Delay': 300, 'Width': 20, 'Height': 5, 'Depth': 20},{'ID': 'm1p2', 'Name': 'Pizza Calzone', 'Price': 8.0, 'Delay': 360, 'Width': 20, 'Height': 12, 'Depth': 20},{'ID': 'm1p3', 'Name': 'Du Caca', 'Price': 0.01, 'Delay': 360, 'Width': 20, 'Height': 12, 'Depth': 20}]))

#client.publish("GetProducts",consommateurGUID)

def topic_DeliveryManGiveProduct(client,msg):
    global commandeRecue
    commandeRecue = json.loads(msg.payload)
    print(commandeRecue)
    print("\nBon appetit !")
    client.loop_stop()

def topic_agentGUID(client, msg):
    consommateurInfos = json.loads(msg.payload)
    print(consommateurInfos)

def on_disconnect(client, userdata, flags,rc=0):
    print("Disconnected result code"+str(rc))
def on_log(client,userdata,level,buf):
    print("log: "+buf)


###########################################################################################################################################    
 
broker="51.75.120.244"	#IP broker Clement
#broker="127.0.0.1"


#consommateurGUID = str(uuid4().hex)       #on génère un GUID pour l'utilisateur
consommateurGUID = sys.argv[1]
print(consommateurGUID)

consommateurInfos ={}
listeProduits=[]

newClient = mqtt.Client(consommateurGUID)     #création d'un nouveau client

myOutils = myTools.outils

newClient.on_connect = on_connect
newClient.on_disconnect = on_disconnect
#client.on_log=on_log
newClient.on_message = on_message
print("connexion au broker...",broker)

#time.sleep(4)

newClient.connect(broker,1883,60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.

newClient.loop_start()

sec = 0
while sec < 20:
    sec+=1
    time.sleep(1)
    print sec
newClient.loop_stop()
#newClient.loop_forever()
newClient.publish("ExitCustomer", consommateurInfos["ID"])
newClient.disconnect()
