const PORT = process.env.PORT || 8005;
const crypto = require('crypto');
const fetch = require('node-fetch');
var request = require('request');
var express = require('express')
, cors = require('cors'),
favicon = require('serve-favicon')
, app = express();
var bodyParser = require('body-parser');
app.use(cors());

var path = require("path");
app.set('port', PORT);
app.listen(app.get('port'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
console.log("Server is running at " + PORT);
var res = '';
//Function to call lambda service as of now input is hardcoded
function callLambdaService(userKey,accounttype,callback) {
	//To check whether accountType is empty or null or undefined
	if(!accounttype || /^\s*$/.test(accounttype)){
		var options = {
			uri : 'https://hu4xwdeme9.execute-api.us-east-1.amazonaws.com/DEV/bankingbot/accountsummary?userKey='+userKey,
			method : 'GET'
		}; 
		request(options, function (error, response, body) {
			
			console.log(response);
			if (!error && response.statusCode == 200) {
				res = body;
			}
			else {
				res = 'Not Found';
			}
			callback(res);
		});
	}
	else
	{
		var options = {
			uri : 'https://hu4xwdeme9.execute-api.us-east-1.amazonaws.com/DEV/bankingbot/accountsummary?userKey='+userKey+'&accountType='+accounttype,
			method : 'GET'
		}; 
		request(options, function (error, response, body) {
			
			console.log(response);
			if (!error && response.statusCode == 200) {
				res = body;
			}
			else {
				res = 'Not Found';
			}
			callback(res);
		});
		
		
		
	}
}
//Call a method which hits the aws url and get the response back 
callLambdaService("1001","CHECKING", function(resp){
	//Hurray Got response ..Now convert this to string
	body=JSON.stringify(resp);;
});
//To check the response in browser 
//app.get('/',function(req,res){
	//Send this response to browser
//	res.send(body);
//});
