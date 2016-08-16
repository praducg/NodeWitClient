module.exports = {
  log: require('./lib/log'),
  Wit: require('./lib/wit'),

  interactive: require('./lib/interactive')
}
const bodyParser = require('body-parser');
//const Wit = require('./').Wit
var AWS = require('aws-sdk');
var lambda = new AWS.Lambda();
var msg = '';
// Webserver parameter
const PORT = process.env.PORT || 8005;

const crypto = require('crypto');
const fetch = require('node-fetch');
const request = require('request');

var express = require('express')
  , cors = require('cors')
  , app = express();
//fix for security format exception from browser.
app.use(cors());

let log = null;
let Wit = null;
try {
  Wit = require('./').Wit;// if running from repo
  log = require('./').log;
} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
}
// Starting our webserver and putting it all together
var path = require("path");
app.set('port', PORT);
app.listen(app.get('port'));
app.use(bodyParser.json());

console.log("Server is wating for you @" + PORT);

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const getFirstMessagingEntry = (body) => {
  const val = body.object === 'msg' &&
    body.entry &&
    Array.isArray(body.entry) &&
    body.entry.length > 0 &&
    body.entry[0] &&
    body.entry[0].messaging &&
    Array.isArray(body.entry[0].messaging) &&
    body.entry[0].messaging.length > 0 &&
    body.entry[0].messaging[0];
  return val || null;
};

const actions = {
  send(request, response) {
	  msg='';
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
	return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
	  let resl = resolve();
	  msg = msg + JSON.stringify(text) + '\n' + JSON.stringify(entities);
      return resl;
    });
  },
};

const sessions = {};
const findOrCreateSession = (sid) => {
  let sessionId;
  // Let's see if we already have a session for the user
  Object.keys(sessions).forEach(k => {
    if (sessions[k].sid === sid) {
      // Yep, got it!
      sessionId = k;
    }
  });
    // No session found, let's create a new one
	if (!sessionId) {
    sessionId = new Date().toISOString();
    sessions[sessionId] = { sessionId: sessionId,  context: { sid: sessionId } }; // set context, sessionId
	}
  return sessionId;
};

app.get('/lambdaServiceCall.html', function(request, response, next){
    response.sendFile(path.join(__dirname+'/lambdaServiceCall.html'));
});
function handleResponseFromLamda(err,response)
{
	if(err)
	{
		console.log("Problem calling the lambda service");
		return;
	}
	console.dir(response);
}
function runFunctionOnLambda(userKey){
	lambda.invoke(userKey,handleResponseFromLamda);
}

// Message handler

app.post('/DEV/bankingbot/accountsummary', (req, res) => {
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // Parse the Messenger payload
  // See the Webhook reference
  // https://developers.facebook.com/docs/messenger-platform/webhook-reference
  const data = req.body;
  //const wit = new Wit({accessToken: 'W47X2VGODXS4P22XQHCPHGD2X7RDQTY7', actions, logger: new log.Logger(log.INFO)});
AWS.config.update({accessKeyId: '', secretAccessKey: ''});
runFunctionOnLambda({userKey:data.userKey});


    
});
