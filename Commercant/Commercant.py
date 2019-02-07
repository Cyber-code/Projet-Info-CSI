#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sat Dec 29 22:40:09 2018

@author: clement
"""
import boiteAoutils as tools
import paho.mqtt.client as mqtt
import time
import json
import math
from uuid import uuid4


broker = "51.75.120.244"
# broker="127.0.0.1"

produitID = {}
ShopInfo = {}
Produits = {}
commerce = ""

commerceGUID = str(uuid4().hex)

# The callback for when the client receives a CONNACK response from the server.


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected")
    else:
        print("Not connected")
        
    client.subscribe(commerceGUID)
    client.publish("GetShopInfo", commerceGUID)

# The callback for when a PUBLISH message is received from the server.


def on_message(client, userdata, msg):
    global ShopInfo
    global Produits
    global commerce

    print("\n## NOUVEAU MSG ##")
    print("TOPIC: ", msg.topic)
    
    if msg.topic == commerceGUID:
        # print("\n"+msg.topic +str(msg.payload))
        
        ShopInfo = tools.recupJSON(msg.payload)
        print(ShopInfo)
        commerce = tools.recupJSON(msg.payload)["ID"]
        myOutils.configid(msg)
        client.subscribe("GetProducts")
        client.subscribe("ExecOrder")
        client.subscribe("DeliveryManAskProduct")
        ##_A_ENLEVER(ligne_suivante)##
        # client.publish("DeliveryManAskProduct", tools.createJSON({'ID': '697c8fcd-8400-4730-bd68-f4758d2eb432', 'ProductId': 'm1p1', 'ShopId': 'm1', 'ShopX': 50, 'ShopY': 50, 'CustomerId': 'h1', 'CustomerX': 140, 'CustomerY': 10, 'DeliveryManId': 'dm1', 'Delay': 293} ))
        ##############################
    elif msg.topic == "GetProducts":
        GetProducts(client, msg)
    elif msg.topic == "ExecOrder":
        ExecOrder(client, msg)
    elif msg.topic == "DeliveryManAskProduct":
        DeliveryManAskProduct(client, msg)


def GetProducts(client, msg):

    custoID = msg.payload.decode()
    print(custoID)
    print(type(custoID))
    client.publish(custoID, "GetProducts|"+json.dumps(ShopInfo["Products"]))
    print("envoye")
    

def ExecOrder(client, msg):
    a = 0
    global commande
    commande = tools.recupJSON(msg.payload)
    produitID = commande["ProductId"]
    produit = False
    print(ShopInfo)
    print("\n"+str(commande))
    for i in range(len(ShopInfo["Products"])):
         if ShopInfo["Products"][i]["ID"] == produitID:
             print("\nProduit trouvé\n")
             produit = ShopInfo["Products"][i]
    if produit is not False:
        print("produitDelay: {}".format(produit["Delay"]))
        while a < produit["Delay"]/100:     # A diviser par 100
            a = a + 1
            print(a)
            time.sleep(1)
            if a%30:      
                dest = "ShopPing"
                client.publish(dest, commerce)
    else:
        print("\nProduit non trouvé\n")

    # On lance la conception du produit


def DeliveryManAskProduct(client, msg):
    commande = tools.recupJSON(msg.payload)
    client.publish(commande["DeliveryManId"], "ShopGiveProduct|"+commande["ProductId"])
    print(commande)


client = mqtt.Client(commerceGUID)
client.on_connect = on_connect
client.on_message = on_message


# time.sleep(4)

myOutils = tools.outils("commerce", commerceGUID, client)
client.connect(broker, 1883, 60)

client.loop_start()

while True:
    time.sleep(30)
    dest = "ShopPing"
    client.publish(dest, commerce)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
#ok


client.publish("ExitShop", commerceGUID)

client.disconnect()
