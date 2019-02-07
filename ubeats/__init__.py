#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
    Created on Thu Oct  22/01/2019 22:35

@author: clement
"""

from flask import Flask,render_template,redirect,url_for,request,jsonify,send_file,session
from celery import Celery

from uuid import uuid4

import json

import os

app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/1'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

app.secret_key = 'UBEATS'

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/carte')
def carte():
    return render_template('carte.html',GUID=session['GUID'],userID=session['userID'])
@app.route('/setUserID/',methods=['POST'])
def setUserID():
    session['userID'] = request.form['userID']
    return 'ok'
@app.route('/newClient/',methods=['POST'])
def newClient():
    clientGUID = str(uuid4().hex)
    session['GUID'] = clientGUID
    task = creeNewClien.delay(clientGUID)
    #task.wait()
    return clientGUID
@app.route('/getProduct/',methods=['POST'])
def getProduct():
    print(request.form['produits'])
    for k in json.loads(request.form['produits']):
        print k
    return jsonify({"prod":render_template('produit.html',Listeproduits = json.loads(request.form['produits']))})


@celery.task(name='newClient')
def creeNewClien(userGUID):
    os.system("python customer.py "+userGUID)

@app.errorhandler(401)
@app.errorhandler(404)
def ma_page_erreur(error):
    return "Vous êtes sur une page d'erreur "

if __name__ == "__main__":  
    app.run(debug=True)
