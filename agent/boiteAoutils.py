#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Mon Jan 21 15:29:44 2019

@author: clement
"""
import paho.mqtt.client as mqtt
import json
from uuid import uuid4


def recupJSON(msg):
    return json.loads(msg)

def createJSON(dictt):
    return json.dumbs(dictt)


class outils():
    
    def __init__(self,whoIs,userGUID,client):
        self.whoIs = whoIs
        self.userGUID = userGUID
        self.client = client
    
    def beat(self):
        if self.whoIs == "agent":
            self.dest = "DeliveryManPing"
        elif self.whoIs == "consommateur":
            self.dest = "CustomerPing"
        elif self.whoIs == "commerce":
            self.dest = "ShopPing"
        self.client.publish(self.dest,self.id)
        
    def configid(self,msg):
        self.id = str(json.loads(msg.payload)["ID"])
        
    def deconnection(self):
        if self.whoIs == "agent":
            dest = "ExitDeliveryMan"
        elif self.whoIs == "consommateur":
            dest = "ExitCustomer"
        elif self.whoIs == "commerce":
            dest = "ExitShop"
        self.client.publish(dest,self.id)
        self.client.disconnect()
    
    def returnClient(self):
        return self.client
    
    def myAgentID(self):
        return self.id
    def myCommerceID(self):
        return self.id
    def myConsommateurID(self):
        return self.id
    
    def myGUID(self):
        return self.userGUID
        
            