const bodyParser = require('body-parser');
var AWS = require('aws-sdk');
var lambda = new AWS.Lambda();
const PORT = process.env.PORT || 8005;
const crypto = require('crypto');
const fetch = require('node-fetch');


var express = require('express')
  , cors = require('cors')
  , app = express();
  var responseObj={};
//fix for security format exception from browser.
app.use(cors());
var path = require("path");
app.set('port', PORT);
app.listen(app.get('port'));
app.use(bodyParser.json());

console.log("Server is wating for you @" + PORT);

app.get('/lambdaServiceCall.html', function(request, response, next){
	
    response.sendFile(path.join(__dirname+'/lambdaServiceCall.html'));
});

app.post('https://hu4xwdeme9.execute-api.us-east-1.amazonaws.com/DEV/bankingbot/accountsummary', (req, res) => {
	var userKey = req.body.userKey;
	console.log(userKey);
	res.send(userKey);
});
