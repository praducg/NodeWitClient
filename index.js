'use strict';
module.exports = {
  log: require('./lib/log'),
  Wit: require('./lib/wit'),
}
let log = null;
const bodyParser = require('body-parser');
log = require('./lib/log.js').log;
// Webserver parameter
const PORT = process.env.PORT || 8445;

var express = require('express')
  , cors = require('cors')
  , app = express();
//fix for security format exception from browser.
app.use(cors());

// Starting our webserver and putting it all together
var path = require("path");
app.set('port', PORT);
app.listen(app.get('port'));
app.use(bodyParser.json());

console.log("Server is running at  @" + PORT);

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
  say(sessionId, context, message, cb) {
    console.log(message);
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
    if (loc) {
      context.loc = loc;
	  console.log("location::" + loc);
    }
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
};

const sessions = {};

const findOrCreateSession = () => {
  var sessionId;
    // No session found, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      sessionId: sessionId,
      context: {
        _sessionId_: sessionId
      }
    }; // set context, _sessionId_
  return sessionId;
};

app.get('/botTest.html', function(request, response, next){
    response.sendFile(path.join(__dirname+'/botTest.html'));
});

// callwit is the main service which takes care of calling wit.ai
app.post('/callwit', (req, res) => {
	// Parsing the Messenger API response
	const messaging = getFirstMessagingEntry(req.body);
	const wit = new Wit({
	  accessToken: 'W47X2VGODXS4P22XQHCPHGD2X7RDQTY7',
	  actions,
	  logger: new log.Logger(log.INFO)
	});
	
	
	//const wit = new Wit('W47X2VGODXS4P22XQHCPHGD2X7RDQTY7', actions);
	console.log('wit client object: ' + wit);
	
    // We retrieve the user's current session, or create one if it doesn't exist
    // This is needed for our bot to figure out the conversation history
    const sessionId = findOrCreateSession();
	console.log('sessionID: ' + sessionId);
	// We retrieve the message content
    const msg = messaging.message.text;
	console.log('user message: ' + msg);
	if (msg) {
      // We received a text message
      // Let's forward the message to the Wit.ai Bot Engine, This will run all actions until our bot has nothing left to do
      wit.runActions(
        sessionId, // the user's current session
        msg, // the user's message 
        sessions[sessionId].context, // the user's current session state
        (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            console.log('Waiting for futher messages.');
            // Updating the user's current session state
            sessions[sessionId].context = context;
          }
		  console.log('final msg: '+wit.respMsg());
		  res.send(wit.respMsg())
        }
      );
    }
	console.log('Response Object: ' + res);
	
  //res.send('"Only those who will risk going too far can possibly find out how far one can go." - Chandra');
 // next();
});

// another example post service
app.post('/webhook', (req, res, next) => {
  res.send('"Only those who will risk going too far can possibly find out how far one can go." - Chandra');
  next();
});

// Webhook get method sends status 400
app.get('/webhook', (req, res, next) => {
    res.sendStatus(400);
	next();
});

