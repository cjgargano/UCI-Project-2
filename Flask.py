import os
import sqlite3
import pandas as pd
from flask import Flask, jsonify

import json


# Create a SQL connection to our SQLite database
con = sqlite3.connect("data.db")

c = con.cursor()



app = Flask(__name__)
# Return all results of query

@app.route("/json")
def geoJson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    for data in c.execute('SELECT NAME, City, State, Latitude, Longitude, Stars, Review_Count, Bucket, Sentiment FROM yelp LIMIT 5'):
        yelp_Dict = {
            'Name':data[0],
            'City':data[1],
            'State':data[2],
            'Lattitude':data[3],
            'Longitude':data[4],
            'Stars':data[5],
            'Review_Count':data[6],
            'Bucket':data[7],
            'Sentiment':data[8]}
        yelp_list.append(yelp_Dict)
    
    return json.dumps(yelp_list)

if __name__ == '__main__':
    app.run()

