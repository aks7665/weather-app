const request = require('request');

const geocode = (address, callback) => {
    // mapbox api to get lat and log on the basis of address
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +'.json?access_token=pk.eyJ1IjoiYWtzbWFwIiwiYSI6ImNqdmV0bGZsbTA5bG4zeXA0djFjZWNwZWYifQ.nEH0OAWsK1bpnoq-gHodIQ';
    request({
        url,
        json: true
    // }, (error, response) => { // to use destructuring
    }, (error, {body} = {}) => {
        if(error) {
            callback('Unable to connect to internet.', undefined);
        } else {
            if (body.features[0]) {
                const data = {
                    latitude: body.features[0].center[1],
                    longitude: body.features[0].center[0],
                    location: body.features[0].place_name
                };
                callback(undefined, data);
            } else {
                callback('Unable to fetch location. Try another search.', undefined);
            }
        }
    })
}

module.exports = {
    getGeocode: geocode
}