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
      
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// handler receiving messages
app.post('/shophook', function (req, res) {
  console.log('shophook');
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
    console.log(shoplist.findReg(event.sender.id));
    if (shoplist.findReg(event.sender.id).length > 0){
      if (event.message && event.message.text == "#bye") {
          sendMessage(event.sender.id, {text: "さようなら"}, 'shop');
          res.sendStatus(200);
      } else {
          sendMessage(event.sender.id, {text: "こんにちは"}, 'shop');
          res.sendStatus(200);
      }
    }else{
      if (event.message && event.message.text == "#bye") {
          sendMessage(event.sender.id, {text: "入力されたコードは登録できません。他のコードを入力してください。"}, 'shop');
          res.sendStatus(200);
      }
      else if (shoplist.findReg(event.message.text).length > 0){
          sendMessage(event.sender.id, {text: "入力されたコード " + event.message.text + "は既に登録されています。他のコードを入力してください。"}, 'shop');
          res.sendStatus(200);
      }
      else if (event.message && event.message.text[0] != "#") {
          sendMessage(event.sender.id, {text: '# から始まるコードを入力して下さい。'}, 'shop');
          res.sendStatus(200);
      }  
      else if (event.message && event.message.text[0] == "#") {
        fs.appendFile('shops.txt', '\n'+event.sender.id+':'+event.message.text, (err) => {
            if (err) throw err;
            sendMessage(event.sender.id, {text: 'コード ' + event.message.text + ' で登録しました。こちらのコードをQRコードに添えてご案内下さい。'}, 'shop');
            res.sendStatus(200);
        });
      }  
      else {
          console.log('where am i');
          res.sendStatus(200);
      }
    }
  }
});

// Accepts GET requests at the /webhook endpoint
app.get('/shophook', (req, res) => {
  
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
});

// handler receiving messages
app.post('/patronhook', function (req, res) {
  console.log('patronhook');
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
    console.log(roomlist);
    console.log(event.sender.id+':'+event.message.text);
    if (roomlist.findReg(event.sender.id+':'+event.message.text).length > 0){
      if (event.message && event.message.text == "#bye") {
          sendMessage(event.sender.id, {text: "さようなら"}, 'patron');
          res.sendStatus(200);
      } else {
          sendMessage(event.sender.id, {text: "こんにちは"}, 'patron');
          res.sendStatus(200);
      }
    }else{
      console.log('step2')
      if (event.message && event.message.text == "#bye") {
        console.log('step3')
          sendMessage(event.sender.id, {text: "入力されたコードは登録できません。他のコードを入力してください。"}, 'patron');
          res.sendStatus(200);
      }
      else if (event.message && event.message.text[0] != "#") {
        console.log('step4')
          sendMessage(event.sender.id, {text: 'InterChatより : 会話がまだスタートしていません。 # から始まる店舗IDを入力してください'}, 'patron');
          res.sendStatus(200);
      }  
      else if (event.message && event.message.text[0] == "#" && shoplist.findReg(event.message.text).length > 0) {
        console.log('step5')
        fs.appendFile('talkrooms.txt', '\n'+event.sender.id+':'+event.message.text, (err) => {
            if (err) throw err;
            sendMessage(event.sender.id, {text: 'InterChatより : '+event.message.text+' 店舗名：と会話を開始します。話しかけてください。会話を終了する場合は #bye と入力して下さい。'}, 'patron');
            res.sendStatus(200);
        });
      }  
      else if (event.message && event.message.text[0] == "#" && shoplist.findReg(event.message.text).length < 1) {
        console.log('step6')
          sendMessage(event.sender.id, {text: 'InterChatより: ' + event.message.text + ' の店舗は存在しません。'}, 'patron');
          res.sendStatus(200);
      }  
      else {
          console.log('where am i');
          res.sendStatus(200);
      }
    }
  }
});

// Accepts GET requests at the /webhook endpoint
app.get('/patronhook', (req, res) => {
  
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
});

// generic function sending messages
function sendMessage(recipientId, message, tokenType) {
  if (tokenType == 'patron'){
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PATRON_ACCESS_TOKEN},
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
    })
  } else if (tokenType == 'shop'){
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.SHOP_ACCESS_TOKEN},
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
  }
};

Array.prototype.findReg = function(match) {
    var reg = new RegExp(match);

    return this.filter(function(item){
        return typeof item == 'string' && item.match(reg);
    });
}