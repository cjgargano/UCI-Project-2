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


#endpoint is to create markets for each location in the list..
#currentl it's limited to 500 but that can be changed by chaning the sql statement on line 31 limit clause
@app.route("/geoJson")
def geoJson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    
    for data in c.execute('SELECT NAME, City, State, Latitude, Longitude, Stars, Review_Count, Bucket, Sentiment FROM yelp LIMIT 500 OFFSET 1'):
        yelp_Dict = {
            'properties': {'Name':data[0],
            'address': {'City':data[1],
            'State':data[2]},
            'Stars':data[5],
            'Review_Count':data[6],
            'Bucket':data[7],
            'Sentiment':data[8]},
            'type' : 'Feature', 
            'geometry':{
            "coord" : [data[3],data[4]], 'type':'Point'
            
            }
            }
        yelp_list.append(yelp_Dict)
    
    return jsonify.dumps(yelp_list)
    
    
@app.route("/cityjson")
def cityjson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    
    for data in c.execute('SELECT State , count(name) as location_count, avg (sentiment) as average_sentiment FROM yelp group by State LIMIT 100 OFFSET 5'):
        yelp_Dict = {
            'STATE':data[0],
            'location_Count':data[1],
            'Average_Sentiment':data[2]}
        yelp_list.append(yelp_Dict)
    
    return jsonify.dumps(yelp_list)
    
 #endpoint is for a showing which cities have the most number of reviews   
@app.route("/mostReviewedJson")    
def mostReviewedJson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    
    for data in c.execute('select city, sum(review_count) as number_of_reviews , latitude, longitude from yelp group by city having count(name) > 3000 Order by number_of_reviews desc limit 9'):
        yelp_Dict = {
            'City':data[0],
            'number_of_reviews':data[1],
            'latitude':data[2],
            'longitude':data[3]}
        yelp_list.append(yelp_Dict)
    
    return jsonify.dumps(yelp_list)
 #this is the city that has the best rating with more than 2000 places reviewed    
@app.route("/bestratedCityJson")    
def bestratedcityjson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    #create a dictonary by looping through a sql query 
    for data in c.execute('select city, round(avg(stars),2) as rating , latitude, longitude from yelp group by city having count(name) > 2000 order by rating desc'):
        yelp_Dict = {
            'City':data[0],
            'Average_rating':data[1],
            'latitude':data[2],
            'longitude':data[3]}
        yelp_list.append(yelp_Dict)
    #print out the json to the end point
    return jsonify.dumps(yelp_list)


#enpoint to show the number each bucket appears
@app.route("/bucketCountJson")    
def bucketCountJson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    #create a dictonary by looping through a sql query 
    for data in c.execute('select bucket, count(bucket) as number_of_occurences from yelp group by bucket order by number_of_occurences desc'):
        yelp_Dict = {
            'category':data[0],
            'occurences_Category':data[1]}
        yelp_list.append(yelp_Dict)
    #print out the json to the end point
    return jsonify.dumps(yelp_list)


if __name__ == '__main__':
    app.run()

