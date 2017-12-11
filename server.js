var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var findServer = require('bt-find-server');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var serverArray = [
{
    "url": "http://doesNotExist.boldtech.co",
    "priority": 1
},
 {
    "url": "http://boldtech.co",
    "priority": 7
},
 {
    "url": "http://offline.boldtech.co",
    "priority": 2
},
 {
    "url": "http://npmjs.com",
    "priority": 4
}
];

//this is boldtech's module that already does what they are asking me to do!!  I need to build it.
findServer(serverArray).then(function(results) {
    //console.log('i=',i);
    console.log(results);
    // If successful, results will be an object containing: 
    // { url: 'http://npmjs.com', priority: 4, statusCode: 200 } 
    // status codes between 200 and 299 are successful finds
    if(results.statusCode>=200 && results.statusCode<=299){
        validUrl.push(results.url);
        console.log('valid server: '+results.url);
    }
}).catch(function(error) {
    // If unsuccessful, error contains message: 
      // Failed, all servers offline - If no servers responded with valid status code. 
      // Invalid server array - If no valid urls/priority values were provided. 
      // Fatal error, findserver() failed with message: \n + error.message
      //console.log('i=',i);
      console.log('error: '+error.message); 
});

//}   //end of for loop that will iterate through array of servers

app.listen(3000,function(){
    console.log('server started on port 3000');
})
