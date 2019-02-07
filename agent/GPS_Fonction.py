#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sat Dec 29 22:40:09 2018

@author: Alex(
"""

import paho.mqtt.client as mqtt
import time
import json
import matplotlib.pyplot as plt
import math

def GPS(x_velo, y_velo, x_obj, y_obj, carte, carte_GPS, liste):
    chemin_c = []
    point1, point2 = rue_sujet(x_velo, y_velo, carte, carte_GPS, liste)
    point3, point4 = rue_sujet(x_obj, y_obj, carte, carte_GPS, liste)
    
    x_1 = liste[point1-1][1]
    y_1 = -liste[point1-1][2]
    x_2 = liste[point2-1][1]
    y_2 = -liste[point2-1][2]
    x_3 = liste[point3-1][1]
    y_3 = -liste[point3-1][2]
    x_4 = liste[point4-1][1]
    y_4 = -liste[point4-1][2]
    
    distanceV_1 = math.sqrt((x_1 - x_velo)**2+(y_1 - y_velo)**2)
    distanceV_2 = math.sqrt((x_2 - x_velo)**2+(y_2 - y_velo)**2)
    distanceO_3 = math.sqrt((x_3 - x_obj)**2+(y_3 - y_obj)**2)
    distanceO_4 = math.sqrt((x_4 - x_obj)**2+(y_4 - y_obj)**2)
    
    chemin1, distance1 = GPS_pp(point1, point3, carte_GPS, liste)
    chemin2, distance2 = GPS_pp(point1, point4, carte_GPS, liste)
    chemin3, distance3 = GPS_pp(point2, point3, carte_GPS, liste)
    chemin4, distance4 = GPS_pp(point2, point4, carte_GPS, liste)
                
    distance1 += distanceV_1 + distanceO_3
    distance2 += distanceV_1 + distanceO_4
    distance3 += distanceV_2 + distanceO_3
    distance4 += distanceV_2 + distanceO_4
    
    distance = min(distance1, distance2, distance3, distance4)
    
    if distance == distance1:
        chemin = chemin1
    elif distance == distance2:
        chemin = chemin2
    elif distance == distance3:
        chemin = chemin3
    else:
        chemin = chemin4

    for k in range(len(chemin)):
        for l in range(len(liste)):
            if liste[l][0] == chemin[k]:
                chemin_c.append([liste[l][1],-liste[l][2]])
    chemin_c.append([x_obj,y_obj])
    return(chemin, chemin_c, distance)
    
def rue_sujet(x, y, carte, carte_GPS, liste):
    point1 = -1
    point2 = -1
    y = -y
    for k in range(len(liste)):
        if (x == liste[k][1] and y == liste[k][2]):
            point1 = liste[k][0]
            point2 = liste[k][0]
            return(point1, point2)
    for k in range(len(carte)):
        x1 = carte[k]["x1"]
        x2 = carte[k]["x2"]
        y1 = carte[k]["y1"]
        y2 = carte[k]["y2"]
        if(appartient(x1,y1,x2,y2,x,y)):
            point1=carte_GPS[k]["depart"]
            point2=carte_GPS[k]["arrive"]
            return(point1, point2)  
    return(point1, point2)

def appartient(x1,y1,x2,y2,x3,y3):
    if((x3-x1)*(y2-y1)-(x2-x1)*(y3-y1))==0:
        if((x3 <= x1 and x3 >= x2) or (x3 <= x2 and x3 >= x1)):
            if((y3 <= y1 and y3 >= y2) or (y3 <= y2 and y3 >= y1)):
                return True
            else:
                return False
        else:
            return False
    else:
        return False
    
###################---GPS---#########################
        
def GPS_pp(depart, arrivee, carte, liste):
    chemin = []
    tab = []
    new = depart
    distance = 0
    #Initialisation tu tableau
    for k in range(1,len(liste)+1):
        tab.append([k])       #de 1 à 76
    #Recherche du chemin
    while (fin(tab)==0):
        tab = remplir_dist(tab, new, carte)
        new = nouveau(tab)
    #afficher(tab)
    chemin = recuperer_chemin(tab, depart, arrivee)
    distance, pos = minimum(tab, arrivee-1)
    return(chemin, distance)

def nouveau(tab):
    new = 1
    mini = 10000
    for k in range(1,len(tab)+1):
        mini_pos, pos_mini = minimum(tab, k-1)
        if tab[k-1][-1]!=k:
            if tab[k-1][-1][0]!=0:
                if mini_pos < mini:
                    mini = mini_pos
                    new = k
    return(new)
            
def recuperer_chemin(tab, depart, arrivee):
    chemin = []
    position = arrivee
    chemin.append(arrivee)
    while (position != depart):
        mini, pos_mini = minimum(tab, position-1)
        position = tab[position-1][pos_mini][1]
        chemin.append(position)
    chemin.reverse()
    return chemin

def remplir_dist(tab, new, carte):
    tab[new-1].append([0, new])
    mini_new,pos_mini = minimum(tab, new-1)
    if mini_new == 10000:
        mini_new = 0
    for k in range(1,len(tab)+1):
        if k != new:
            dist = 0
            dist = distance(new, k, carte) + mini_new
            if dist > 10000:
                dist = 10000
            if tab[k-1][-1] != k:
                if tab[k-1][-1][0] == 0:
                    tab[k-1].append([0,k])
                else:
                    tab[k-1].append([dist,new])
            else:
                tab[k-1].append([dist,new])
        tab = garde_mini(tab, k-1)
    return tab

def fin(tab):
    fin = 1
    for k in range(1,len(tab)+1):
        if tab[k-1][-1]!=k:
            if (tab[k-1][-1][0] == 0 or tab[k-1][-1][0] == 10000):
                fin = fin
            else:
                fin = 0
        else:
            fin = 0
    return fin

def distance(new, k, carte):
    for l in range(len(carte)):
        if (carte[l]["depart"]==new and carte[l]["arrive"]==k):
            dist = carte[l]["poid"]
            return dist
        elif (carte[l]["depart"]==k and carte[l]["arrive"]==new):
            dist = carte[l]["poid"]
            return dist
        else:
            dist = 10000
    return dist

def minimum(tab, colonne):
    mini = 10000
    pos_mini = -1
    for l in range(1,len(tab[colonne])):
        if (tab[colonne][l][0] < mini and tab[colonne][l][0] > 0):
            mini = tab[colonne][l][0]
            pos_mini = l
    return mini,pos_mini

def garde_mini(tab, colonne):
    mini, pos_mini = minimum(tab, colonne)
    if  (pos_mini == -1):
        return(tab)
    else:
        if (mini != 10000):
            for l in range(1,len(tab[colonne])):
                if (l != pos_mini and tab[colonne][l][0] > 0):
                    tab[colonne][l][0] = -1
        return(tab)

        
#################---FIN-GPS---########################
        
def Map_show(carte, liste):
    x=[]
    y=[]
    for k in range(len(carte)):
        plt.plot([carte[k]["x1"],carte[k]["x2"]],[carte[k]["y1"],carte[k]["y2"]],linewidth=2.0)
    for l in range (len(liste)):  
        #x.append(liste[l][1])
        #y.append(liste[l][2])
        plt.plot(x,y,"o")
        plt.text(liste[l][1],liste[l][2],liste[l][0])
    plt.savefig('Carte.png')
    plt.show()
    
def Map_extract(data):
    # Clean data
    data = data.decode("UTF-8")
    data = data.split("|")
    carte = data[1]
    carte_finis = []
    carte_final = []
    liste = []
    carte_finis_temp = json.loads(carte)
    # Clean map
    for i in range(len(carte_finis_temp)-1, -1, -1):
        if str(carte_finis_temp[i]).find("type") != -1:
            carte_finis_temp.pop(i)
    # Replace value
    for i in range(len(carte_finis_temp)):
        x1 = carte_finis_temp[i]["x1"]
        y1 = -carte_finis_temp[i]["y1"]
        x2 = carte_finis_temp[i]["x2"]
        y2 = -carte_finis_temp[i]["y2"]
        poid = math.sqrt((x2-x1)**2+(y2-y1)**2)
        carte_finis.append({"x1":x1,"y1":y1,"x2":x2,"y2":y2,"poid":poid,"ID":i})
        liste = Coordonee(x1,y1,liste)
        liste = Coordonee(x2,y2,liste)
    # Replace x1,y1 -> A and x2,y2 -> B
    for i in range(len(carte_finis_temp)):
        x1 = carte_finis[i]["x1"]
        y1 = carte_finis[i]["y1"]
        x2 = carte_finis[i]["x2"]
        y2 = carte_finis[i]["y2"]
        poid = carte_finis[i]["poid"]
        ID = carte_finis[i]["ID"]
        for k in liste:
            if (k[1]== x1 and k[2]==y1):
                depart = k[0]
            if (k[1]== x2 and k[2]==y2):
                arrivee = k[0]
        carte_final.append({"depart":depart,"arrive":arrivee,"poid":poid,"ID":ID})
    return(carte_finis, carte_final, liste)

def Coordonee(x,y,liste):
    sous_liste = []
    if len(liste) == 0:
        liste.append([1,x,y])
        return(liste)
    else:
        sous_liste = [liste[-1][0]+1,x,y]
    for k in liste:
        if (k[1] == x and k[2] == y):
            return(liste)
    liste.append(sous_liste)
    return(liste)
