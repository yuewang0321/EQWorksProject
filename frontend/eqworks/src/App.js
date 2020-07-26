import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Home from './components/Home.js';
import HourlyEvents from './components/HourlyEvents.js';
import DailyEvents from './components/DailyEvents.js';
import HourlyStats from './components/HourlyStats.js';
import DailyStats from './components/DailyStats.js';
import MapChart from "./components/Map.js";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Nav() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Home" {...a11yProps(0)} />
          <Tab label="Hourly Events" {...a11yProps(1)} />
          <Tab label="Daily Events" {...a11yProps(2)} />
          <Tab label="Hourly Stats" {...a11yProps(3)} />
          <Tab label="Daily Stats" {...a11yProps(4)} />
          <Tab label="Geo Visualization" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Home />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HourlyEvents />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DailyEvents />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <HourlyStats />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <DailyStats />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <MapChart />
      </TabPanel>
    </div>
  );
}
