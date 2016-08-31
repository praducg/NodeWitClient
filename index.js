const PORT = process.env.PORT || 5000;
const crypto = require('crypto');
const fetch = require('node-fetch');
var express = require('express')
, cors = require('cors')
, app = express();
var bodyParser = require('body-parser');
app.use(cors());

var path = require("path");
app.set('port', PORT);
app.listen(app.get('port'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
console.log("Server is running at " + PORT);

app.get('/lambdaServiceCall.html', function(request, response, next){
response.sendFile(path.join(__dirname+'/lambdaServiceCall.html'));
});


app.get('/test', function(request, response, next){
    response.sendFile(path.join(__dirname+'/lambdaServiceCall.html'));
});
