import React, { Component } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker,
} from "react-simple-maps";
import API from '../API/api.js';
import '../css/Map.css';
import { MDBDataTable } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

const apiCall = new API();
const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


export default class MapChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats:null,
            limitReached:false
        }
    }

    componentDidMount() {
        apiCall.getPoiDailyStats()
        .then(response => {
            if (typeof response!=='undefined'){
                this.setState({stats: response});
            }
            else {
                this.setState({limitReached: true});
            }
        })
    }

    render() {
      var {stats, limitReached} = this.state;
      var markers = [];
      var names = {};

      if (stats!==null) {
        for (var i=0; i<stats.length; i++) {
          if (names[stats[i]['name']]==null) {
            names[stats[i]['name']] = 1;
          } else {
            names[stats[i]['name']] += 1;
          }
          markers.push( { markerOffset: 15, name: stats[i]['name'], coordinates: [stats[i]['lon'], stats[i]['lat']] },)
        }
      }
      var locations = [];
      for (var key in names) {
        locations.push({"names": key, "count":names[key]});
      }
      
      const data = {
        columns: [
            {
                label: 'Location',
                field: 'names',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Count',
                field: 'count',
                sort: 'asc',
                width: 200
            }
        ],
        rows: locations
      };
      console.log("here");
      return(
        <div>
        {!limitReached ? <div>
          <div>
          <ComposableMap className='map'>
              <ZoomableGroup zoom={1}>
              <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                  geographies.map(geo => (
                      <Geography key={geo.rsmKey} geography={geo} />
                  ))
                  }
              </Geographies>

              {markers.map(({ name, coordinates, markerOffset }) => (
                <Marker key={coordinates} coordinates={coordinates}>
                  <g
                    fill="none"
                    stroke="#FF5533"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(-12, -24)"
                  >
                    <circle cx="12" cy="10" r="2" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                  </g>
                </Marker>))}
              </ZoomableGroup>
          </ComposableMap>
          <div className="TableEvents">
          <MDBDataTable
              striped
              bordered
              small
              data={data}
          />
          </div>
        </div>
          </div>
          : 
        <div className='limit'>
            Geo Call Limit Reached
        </div>}
      </div>
      );
    };
};