/*
 * Starter Project for Messenger Platform Quick Start Tutorial
 *
 * Remix this as the starting point for following the Messenger Platform
 * quick start tutorial.
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 */

'use strict';

// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

var fs = require('fs');
var lineReader = require('./line_reader.js');
      
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// handler receiving messages
app.post('/webhook', function (req, res) {
  
  var shoplist = new Array();
  var roomlist = new Array();
  try {
    var shopdata = fs.readFileSync('shops.txt', 'utf8');
    var roomdata = fs.readFileSync('talkrooms.txt', 'utf8');
  } catch (ex) {
    console.log(ex)
  }
  shoplist = shopdata.split(/\r?\n/);
  roomlist = roomdata.split(/\r?\n/);
  var events = req.body.entry[0].messaging;
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    //console.log(event);
    if (shoplist.indexOf(event.sender.id != -1)){
        console.log(shoplist.indexOf(event.sender.id);
        if (event.message && event.message.text == "#bye") {
            sendMessage(event.sender.id, {text: shoplist[1] + roomlist[0]});
            res.sendStatus(200);
        }
        if (event.message && event.message.text == "#shop") {
            sendMessage(event.sender.id, {text: "Your newly registered shop name is: " + event.message.text});
            res.sendStatus(200);
        } 
    }else{
      fs.writeFile('shops.txt', event.sender.id, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        res.sendStatus(200);
      });
    } 
  }
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "interchat";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
  
  data = [];
});