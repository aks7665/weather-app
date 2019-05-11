const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express(); // Initializing express

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public'); 
// path join is function which accepts string array and join all these in order to create a path.
// __dirname is used to get current directory path.
const viewsPath = path.join(__dirname,'../templates/views'); 
const partialsPath = path.join(__dirname,'../templates/partials');
hbs.registerPartials(partialsPath);

app.set('view engine', 'hbs'); // Setting view engine to hbs -- hbs is a way to render dynamic views, it is 3rd party package.
app.set('views', viewsPath); // Defining directory for views.

app.use(express.static(publicDirPath));  // it adds public folder to our file 
// Now from here it will search for index.html file and set this file for base url(app.com)
// use -- is a method to configure the middleware used by the routes of the Express HTTP server object. 
// express.static -- is used to serve static files like css, html, images.

// app.com (base url) // Now this is not going to be run because we had set static html page for this using app.use method.
// app.get('', (req, res) => {
//     res.send("Hello express");
// })

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Amit'
    }); // Rendering view file with some values. By default it checks in Views folder to search view file, here it is index
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Amit'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Amit',
        helpText: 'This is help text.'
    });
});

// 404 Error page for help child route 
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        name: 'Amit',
        errorMsg: 'Help article not found.'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        });
    }

    // res.send({
    //     value: 'forecast',
    //     address: req.query.address
    // });

    geocode.getGeocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({
                error
            });
        } 
        
        forecast.getForecast(latitude, longitude, (forecastData) => {
            const forecast = 'It is currently ' + forecastData.currently.temperature + ' degrees out. There is a ' + forecastData.currently.precipProbability + '% chance of rain.';
            return res.send({
                forecastData,
                forecast,
                location,
                address: req.query.address
            });
            // console.log('Forecast for location - ' + location);
            // console.log('It is currently ' + forecastData.currently.temperature + ' degrees out. There is a ' + forecastData.currently.precipProbability + '% chance of rain.');
        });
    });
});

// 404 Error page 
app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        name: 'Amit',
        errorMsg: 'Page not found.'
    });
});

// Listening express on port
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});