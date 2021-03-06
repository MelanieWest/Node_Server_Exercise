var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var colors = require('colors');

var rp = require('request-promise');

var Promise = require('bluebird');

// Configure
Promise.config({
    longStackTraces: true,
    warnings: true // note, run node with --trace-warnings to see full stack traces for warnings
})

exports.findServer=function(serverArray){

    validUrl = [];      // because valid servers will be returned at different times, collect them

    var chosenOne="no available servers found";     //placeholder for url of lowest priority available server

    var minPriority = 100;      //start with a high priority number for comparison

    //I chose to use Bluebird since it supports promises, timers, and concurrency

    //iterate through the array of server objects using Promise.map

    Promise.map(serverArray, function(server) {

    //set up options for request-promise get request

        var options = {
            method: 'GET',
            uri: server.url,           //extract the url of the next server in the array of servers
            resolveWithFullResponse: true       //body, status and/or error code
        };
     
        var priority = server.priority;     //identify the priority number of the server

        return rp(options).then(function(response,body) {        //request server response
            return Promise.delay(5000, JSON.parse(body));
        })
    }).then(function(response){
        if(response.statusCode>=200 && response.statusCode<=299){

            console.log("I found a server!".blue);

            validUrl.push(response.url);
            if(priority < minPriority){
                chosenOne = response.url;
            }
        } 

         console.log('chosen one: '+chosenOne.green);

    }).catch(function(error){
        console.log('error: '+error.message.red);        
    });

}       //end of export block

app.listen(8000,function(){
    console.log('server started on port 8000'.blue);
});



