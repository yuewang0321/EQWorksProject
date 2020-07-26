import React, { Component } from 'react';
import API from '../API/api.js';
import '../css/Stats.css';
import { MDBDataTable } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label
  } from 'recharts';

const apiCall = new API();
var moment = require('moment');

class DailyStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats:null,
            limitReached:false
        }
    }
    componentDidMount() {
        apiCall.getDailyStats()
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
        var { stats, limitReached } = this.state;
        const data = {
            columns: [
                {
                    label: 'Clicks',
                    field: 'clicks',
                    sort: 'asc',
                    width: 500
                },
                {
                    label: 'Date',
                    field: 'date',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'Impressions',
                    field: 'impressions',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Revenue',
                    field: 'revenue',
                    sort: 'asc',
                    width: 200
                }
            ],
            rows: stats
        };
        return(
            <div>
                {!limitReached ? <div>
                    <div>
                        <div className="LineGraph">
                            <h1>Hourly Stats</h1>
                            <LineChart width={600} height={200} data={stats}
                                margin={{top: 10, right: 30, left: 20, bottom: 20}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="date" tickFormatter={timeStr => moment(timeStr).format('MM/DD')}>
                                <Label style={{ textAnchor: 'middle' }} dy={10}>
                                    Date
                                </Label>
                            </XAxis>
                            <YAxis>
                                <Label angle={270} style={{ textAnchor: 'middle' }} dx={-30}>
                                    Clicks
                                </Label>
                            </YAxis>
                            <Tooltip/>
                            <Line connectNulls={true} type='monotone' dataKey='clicks' stroke='#8884d8' fill='#8884d8' />
                            </LineChart>

                            <LineChart width={600} height={300} data={stats}
                                margin={{top: 10, right: 30, left: 20, bottom: 20}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="date" tickFormatter={timeStr => moment(timeStr).format('MM/DD')}>
                                <Label style={{ textAnchor: 'middle' }} dy={10} >
                                    Date
                                </Label>
                            </XAxis>
                            <YAxis>
                                <Label angle={270} style={{ textAnchor: 'middle' }} dx={-40}>
                                    Impressions
                                </Label>
                            </YAxis>
                            <Tooltip/>
                            <Line connectNulls={true} type='monotone' dataKey='impressions' stroke='#8884d8' fill='#8884d8' />
                            </LineChart>

                            <LineChart width={600} height={200} data={stats}
                                margin={{top: 10, right: 30, left: 20, bottom: 20}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="date" tickFormatter={timeStr => moment(timeStr).format('MM/DD')}>
                                <Label style={{ textAnchor: 'middle' }} dy={10}>
                                    Date
                                </Label>
                            </XAxis>
                            <YAxis>
                                <Label angle={270} style={{ textAnchor: 'middle' }} dx={-30}>
                                    Revenue
                                </Label>
                            </YAxis>
                            <Tooltip/>
                            <Line connectNulls={true} type='monotone' dataKey='revenue' stroke='#8884d8' fill='#8884d8' />
                            </LineChart> 
                        </div>
                        <div className="TableStats">
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
                <div>
                    Daily Stats Call Limit Reached
                </div>}
            </div>
        );
    }
}

export default DailyStats;