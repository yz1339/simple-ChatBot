/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var place;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am Chinabot - a simple chat bot for tour in China."); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Hello ' + input + ' :-)';// output response
  waitTime =2000;
  question = 'Do you like China?';//'How old are you?';			    	// load next question
  }
  else if (questionNum == 1) {
  if (input.toLowerCase() === 'no'){
  answer = 'That is too bad. I like China.';
  } else {
  answer = 'Great!';
  }
  waitTime = 2000;
  question = 'Would you like to travel in China?';			    	// load next question
  }
  else if (questionNum == 2) {
  if (input.toLowerCase() === 'no') {
    answer = 'Are you sure? China is has a lot of beautiful scenes!';
    place = 'other';
    waitTime = 2000;
    question = 'Where do you want to travel then?';
  } else {
    place = 'China';
    answer= 'Cool! I would love to travel to China too!';
    waitTime = 2000;
    question = 'Where do you like to go in China?'; 
  }
  }
  else if (questionNum == 3) {
    if (input.toLowerCase() === 'beijing') {
      answer = 'I heard that the Forbidden City is the place to go!';
    } else if (input.toLowerCase() === 'shanghai') {
      answer = 'The Oriental Pearl Tower is a very famous tourist place!';
    } else {
      answer = input + ' is a great place to visit!';
    }
    waitTime = 2000;
    if (place === 'China') {
      question = 'What is your favorite Chinese food?';			    	// load next question
    } else {
      place = input;
      question = 'What is your favorite food in ' + input;
    }
  }
  else if (questionNum == 4) {
    answer = input + ' sounds delicious!';
    waitTime = 2000;
    question = 'When do you plan to go to ' + place + '?';
  // load next question
  }
  else{
    answer= 'Sounds great! Hope you will have a fun time!';// output response
    waitTime = 0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
