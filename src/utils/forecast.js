const request = require('request');

const forecast = (lat, long, callback) => {
    // darksky api to get weather forecasting
    const url = 'https://api.darksky.net/forecast/bdfd5ef6eb04114ea44053afecc14bb9/' + lat + ',' + long + '?units=si';
    request({ 
        url, 
        json: true
    // }, (error, response) => { // to use destructuring
    }, (error, {body} = {}) => {
        if (error) {
            console.log('Unable to connect to internet.');
        } else if (body.error) {
            console.log(body.error);
        } else {
            callback(body);
        }
    });
}

module.exports = {
    getForecast: forecast
}