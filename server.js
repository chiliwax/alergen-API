var express = require('express');
var app = express();
const apiRouter = require('./api')
const bodyParser = require('body-parser')

//SET MIDDLEWARE
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//SET ROUTER(S)
app.use("/api", apiRouter);

//DOCUMENTATION
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/public/views/readme.html')
})

//404 handle API and Web
app.get('*', function(req, res) {
    if (req.accepts('html')) {
        res.status(404).sendFile(__dirname + '/public/views/404.html');
        return;
    }

    // respond with json (API REQUEST)
    if (req.accepts('json')) {
        res.status(404).send({ error: 'Not found' });
        return;
    }
});

//Start the server on the actual IP with the PORT 8081
var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running AlergApp API at http://' + host + ':' + port)
});