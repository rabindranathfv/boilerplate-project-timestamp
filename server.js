// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.all('/:timestamp', function (request, response) {

    var timeStamp = request.params.timestamp;
    
    var timeObj = {
        "unix" : null,
        "natural": null
    };
    
    try {
        
        var naturalTime = timeStamp.toString().split(' ');
        
        if (naturalTime.length === 3) {
            
            var dt = new Date(timeStamp.toString());
            timeObj["natural"] = timeStamp.toString(); 
            timeObj["unix"] = dt.valueOf() / 1000;
            //response.write('Natural Date!');

        } else {
            throw new Error('Not Natural Date!'); 
        }

    } catch (err1) {
        console.log(err1);
        try {
            
            var unixTime = Number(timeStamp);
            
            if (isNaN(unixTime))  { 
                throw new Error('Not Unix Timestamp!');
            } else {
                timeObj["unix"] = unixTime;
                
                var dt = new Date(unixTime * 1000);
                timeObj["natural"] = monthNames[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear();
            } 
        } catch (err2) {
            console.log(err2);
        }
    }

    response.send(timeObj);
});



// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
