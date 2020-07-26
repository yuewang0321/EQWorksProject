class API {
    constructor() {
    //   this.root = 'http://localhost:5000';
      this.root = 'https://eqworks.herokuapp.com/'
      this.eventsApiPath = `${this.root}/events`;
      this.statsApiPath = `${this.root}/stats`;
      this.poiApiPath = `${this.root}/poi`;
    }
  
    callAPI(url) {

        return fetch(url)
        .then(
            response => {
            if (response.status !== 200) {
                console.log('Something is wrong: ' + response.status);
                return;
            }
        
            return response.json().then(data => {
                return data;
            });
            }
        )
        .catch(err => {
            console.log(err);
        });
    }

    getHourlyEvents() {
        return this.callAPI(this.eventsApiPath+'/hourly');
    }

    getDailyEvents() {
        return this.callAPI(this.eventsApiPath+'/daily');
    }

    getHourlyStats() {
        return this.callAPI(this.statsApiPath+'/hourly');
    }

    getDailyStats() {
        return this.callAPI(this.statsApiPath+'/daily');
    }
    getPoiDailyStats() {
        return this.callAPI(this.poiApiPath+'/stats/daily');
    }
  }
  
  export default API;