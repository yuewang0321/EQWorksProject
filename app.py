# -*- coding: utf-8 -*-

import os
from flask import Flask, jsonify
import sqlalchemy

import time
from RateLimit import RateLimit

from flask import Flask
from flask_cors import CORS, cross_origin

# web app
app = Flask(__name__,)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# database engine
engine = sqlalchemy.create_engine(os.getenv('SQL_URI'))

events_hr = RateLimit(100, 60*60)
events_da = RateLimit(100, 60*24*60)
stats_hr = RateLimit(100, 60*60)
stats_da = RateLimit(100, 60*24*60)

events_hr_poi = RateLimit(100, 60*60)
events_da_poi = RateLimit(100, 60*24*60)
stats_hr_poi = RateLimit(100, 60*60)
stats_da_poi = RateLimit(100, 60*24*60)

@app.route('/')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def index():
    return 'Welcome to EQ Works 😎'

@app.route('/events/hourly')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def events_hourly():
    if (events_hr.checkLimit()):
        return queryHelper('''
            SELECT date, hour, events
            FROM public.hourly_events
            ORDER BY date, hour
            LIMIT 168;
        ''')
    else:
        return "Events Hourly Call Limit Reached"

@app.route('/events/daily')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def events_daily():
    if (events_da.checkLimit()):
        return queryHelper('''
            SELECT date, SUM(events) AS events
            FROM public.hourly_events
            GROUP BY date
            ORDER BY date
            LIMIT 7;
        ''')
    else:
        return "Events Daily Call Limit Reached"

@app.route('/stats/hourly')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def stats_hourly():
    if (stats_hr.checkLimit()):
        return queryHelper('''
            SELECT date, hour, impressions, clicks, CAST(revenue AS float)
            FROM public.hourly_stats
            ORDER BY date, hour
            LIMIT 168;
        ''')
    else:
        return "Stats Hourly Call Limit Reached"

@app.route('/stats/daily')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def stats_daily():
    if (stats_da.checkLimit()):
        return queryHelper('''
            SELECT date,
                SUM(impressions) AS impressions,
                SUM(clicks) AS clicks,
                CAST(SUM(revenue) AS float) AS revenue
            FROM public.hourly_stats
            GROUP BY date
            ORDER BY date
            LIMIT 7;
        ''')
    else:
        return "Stats Daily Call Limit Reached"

@app.route('/poi')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def poi():
    return queryHelper('''
        SELECT *
        FROM public.poi;
    ''')

@app.route('/poi/events/hourly')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def poi_events_hourly():
    if (events_hr_poi.checkLimit()):
        return queryHelper('''
            SELECT date, events, hour, lat, lon, name
            FROM public.hourly_events
            LEFT JOIN public.poi
            ON public.hourly_events.poi_id = public.poi.poi_id
            ORDER BY date, hour
            LIMIT 168;
        ''')
    else:
        return "POI Events Hourly Call Limit Reached"

@app.route('/poi/events/daily')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def poi_events_daily():
    if (events_da_poi.checkLimit()):
        return queryHelper('''
            SELECT date, SUM(events) AS events, lat, lon, name
            FROM public.hourly_events
            LEFT JOIN public.poi
            ON public.hourly_events.poi_id = public.poi.poi_id
            GROUP BY date, name, lat, lon
            ORDER BY date
            LIMIT 7;
        ''')
    else:
        return "POI Events Daily Call Limit Reached"

@app.route('/poi/stats/hourly')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def poi_stats_hourly():
    if (stats_hr_poi.checkLimit()):
        return queryHelper('''
            SELECT clicks, date, hour, impressions, CAST(revenue AS float), lat, lon, name
            FROM public.hourly_stats
            LEFT JOIN public.poi
            ON public.hourly_stats.poi_id = public.poi.poi_id
            ORDER BY date, hour
            LIMIT 168;
        ''')
    else:
        return "POI Stats Hourly Call Limit Reached"

@app.route('/poi/stats/daily')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def poi_stats_daily():
    if (stats_da_poi.checkLimit()):
        return queryHelper('''
            SELECT SUM(clicks) AS clicks, date, SUM(impressions) AS impressions, 
                CAST(SUM(revenue) AS float) AS revenue, lat, lon, name
            FROM public.hourly_stats
            LEFT JOIN public.poi
            ON public.hourly_stats.poi_id = public.poi.poi_id
            GROUP BY date, name, lat, lon
            ORDER BY date
            LIMIT 7;
        ''')
    else:
        return "POI Stats Daily Call Limit Reached"

def queryHelper(query):
    with engine.connect() as conn:
        result = conn.execute(query).fetchall()
        return jsonify([dict(row.items()) for row in result])
