import React, { Component } from 'react';
import API from '../API/api.js';
import '../css/Events.css';
import { MDBDataTable } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label
  } from 'recharts';

const apiCall = new API();

class HourlyEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events:null,
            limitReached:false
        }
    }
    componentDidMount() {
        apiCall.getHourlyEvents()
        .then(response => {
            if (typeof response!=='undefined'){
                this.setState({events: response});
            }
            else {
                this.setState({limitReached: true});
            }
        })
    }

    render() {
        var { events, limitReached } = this.state;
        const data = {
            columns: [
                {
                    label: 'Date',
                    field: 'date',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'Events',
                    field: 'events',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Hour',
                    field: 'hour',
                    sort: 'asc',
                    width: 200
                }
            ],
            rows: events
        };
        return(
            <div>
                {!limitReached ? <div>
                    <div className="BarChart">
                    <h1>Hourly Events</h1>
                    <BarChart width={700} height={400} data={events}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="hour">
                        <Label style={{ textAnchor: 'middle' }} dy={10}>
                        Hours
                        </Label>
                    </XAxis>
                    <YAxis>
                    <Label angle={270} position='left' style={{ textAnchor: 'middle' }}>
                        Events
                    </Label>
                    </YAxis>
                    <Tooltip/>
                    <Bar dataKey="events" fill="#8884d8" />
                    </BarChart></div>
                    <div className="TableEvents">
                    <MDBDataTable
                        striped
                        bordered
                        small
                        data={data}
                    />
                    </div>
                </div>
                 : 
                <div>
                    Hourly Events Call Limit Reached
                </div>}
            </div>
        );
    }
}

export default HourlyEvents;