import os
import sqlite3
import pandas as pd
from flask import Flask, jsonify, render_template, json, url_for
import requests as req
import json


# Create a SQL connection to our SQLite database
con = sqlite3.connect("data.db")

c = con.cursor()





app = Flask(__name__)
# Return all results of query

@app.route("/")
def index():

    return render_template('index.html')   

## this one is in the works as of now but not currently working
@app.route("/geoJsonBoundary")
def geoJsonBound():
     #url end point
    url = 'https://bubinga.co/wp-content/uploads/jsonstates.min_.js'
    #create url enpoint to read in json
    json_file = req.get(url).json()
    #create emply list that will be used to create dictonary
    yelp_list_sql=[]

    #sql loop for statement 
    for data in c.execute("SELECT State , count(name) as location_count, avg (sentiment) as average_sentiment FROM yelp WHERE state in ('AL', 'AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY') group by State  LIMIT 1000000"):
            yelp_Dict_sql_loop = {
                'STATE':data[0],
                'location_Count':data[1],
                'Average_Sentiment':data[2]}
        
        
        
            yelp_list_sql.append(yelp_Dict_sql_loop)

    #make a data frame off of the json url
    json_df = pd.read_json(url)

    
    #take json file and make state append
    json_states = []
    json_geometry = []
   
    for i in json_df['features']:
        abrrev_Variable= (i['properties']['abbr'])
        geometry_variable= (i['geometry'])
        json_states.append(abrrev_Variable)
        json_geometry.append(geometry_variable)
    
    #reset the index and drop the old one
    json_df.reset_index(drop=True)
    
    #add to json df new columns
    json_df['State'] = json_states
    json_df['Geometry'] = json_geometry
    
    #take sql dictonary find the states
    empty_state_dict = []
    for i in yelp_list_sql:
        stateDict_Variable = i['STATE']
        empty_state_dict.append(stateDict_Variable)

    # create a data frame off of the dictonary on line 71
    yelp_sql_dict = pd.DataFrame.from_dict(yelp_list_sql)
    
    yelp_sql_dict['State']= empty_state_dict
    
    
    #merge the two data frames on added state column
    combined_state = pd.merge(yelp_sql_dict,json_df,how='inner', on='State' )
    
    #drop state column
    combined_state=combined_state.drop(['STATE'],axis=1)
    combined_state = combined_state.drop(['features'], axis=1)
    
    #create an empty list
    polygon_list =[]
    
    #itterate through each row and make a dictonary out of the each column/row
    for index, row in combined_state.iterrows():
        poly_Dict = {
            'STATE':row['State'],
            'Location_Count':row['location_Count'],
            'Average_Sentiment':row['Average_Sentiment'],
            'Geometry':row['Geometry']
            }
        polygon_list.append(poly_Dict)
    
    return jsonify(polygon_list[0])

    
#endpoint is to create markets for each location in the list..
#currentl it's limited to 500 but that can be changed by chaning the sql statement on line 31 limit clause
@app.route("/geoJson")
def geoJson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    #create a list that will be added to 
    for data in c.execute("SELECT NAME, City, State, Latitude, Longitude, Stars, Review_Count, Bucket, Sentiment FROM yelp WHERE  state in ('AL', 'AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY')  LIMIT 5000 OFFSET 1"):
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
    
    return jsonify(yelp_list)
    
    
@app.route("/cityjson")
def cityjson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    
    #
    for data in c.execute("SELECT State , count(name) as location_count, avg (sentiment) as average_sentiment FROM yelp WHERE state in ('AL', 'AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY') group by State  LIMIT 1000000"):
        yelp_Dict = {
            'STATE':data[0],
            'location_Count':data[1],
            'Average_Sentiment':data[2]}
    
       
       
        yelp_list.append(yelp_Dict)
    
    return jsonify(yelp_list)
    
 #endpoint is for a showing which cities have the most number of reviews   
@app.route("/mostReviewedJson")    
def mostReviewedJson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    
    for data in c.execute("select city, sum(review_count) as number_of_reviews , latitude, longitude from yelp WHERE state in ('AL', 'AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY') group by city having count(name) > 3000 Order by number_of_reviews desc limit 9"):
        yelp_Dict = {
            'City':data[0],
            'number_of_reviews':data[1],
            'latitude':data[2],
            'longitude':data[3]}
        yelp_list.append(yelp_Dict)
    
    return jsonify(yelp_list)
 #this is the city that has the best rating with more than 2000 places reviewed    
@app.route("/bestratedCityJson")    
def bestratedcityjson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    #create a dictonary by looping through a sql query 
    for data in c.execute("select city, round(avg(stars),2) as rating , latitude, longitude from yelp WHERE state in ('AL', 'AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY') group by city having count(name) > 2000 order by rating desc"):
        yelp_Dict = {
            'City':data[0],
            'Average_rating':data[1],
            'latitude':data[2],
            'longitude':data[3]}
        yelp_list.append(yelp_Dict)
    #print out the json to the end point
    return jsonify(yelp_list)


#enpoint to show the number each bucket appears
@app.route("/bucketCountJson")    
def bucketCountJson():

    #data = cur.execute('SELECT name, stars FROM yelp')
   
    yelp_list=[]
    #create a dictonary by looping through a sql query 
    for data in c.execute("select bucket, count(bucket) as number_of_occurences from yelp WHERE state in ('AL', 'AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY') group by bucket order by number_of_occurences desc"):
        yelp_Dict = {
            'category':data[0],
            'occurences_Category':data[1]}
        yelp_list.append(yelp_Dict)
    #print out the json to the end point
    return jsonify(yelp_list)


if __name__ == '__main__':
    app.run()

