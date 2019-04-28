// create train schedule application at that incorporates Firebase to host arrival and departure data.
// users from many different machines must be able to view same train times.
// FIREBASE
    // initiate Firebase with your unique var config
    // create reference to Firebase
// WEBPAGE DISPLAY

var config = {
    apiKey: "AIzaSyBRLd3FVYKy6MhufKAIIf-c2ZECv6H7AW0",
    authDomain: "fir-ucla-bootcamp.firebaseapp.com",
    databaseURL: "https://fir-ucla-bootcamp.firebaseio.com",
    projectId: "fir-ucla-bootcamp",
    storageBucket: "fir-ucla-bootcamp.appspot.com",
    messagingSenderId: "79682732387"
  };

  firebase.initializeApp(config);

  // Create a variable to reference the database
  var database = firebase.database();

// WEBPAGE DISPLAY
// CAPTURE CLICK OF SUBMIT BUTTON - BUTTON FOR ADDING TRAINS
// event.preventDefault(); to prevent early submission via single character entry
// $("#add-train-btn") is ID for submit button

$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
// CAPTURE value of user input for Train Name, Destination, First Train Time, and Frequency (min) using jQuery.val() method. jQuery.trim() method to remove extra spaces

var trainName = $("#train-name-input").val().trim();
var destination = $("#destination-input").val().trim();
var firstTrainTime = $("#first-train-time-input").val().trim();
//  use moment.js to get military time
var frequency = $("#frequency-input").val().trim();
// CLEAR VALUE OF INPUT TEXT BOXES AFTER SUBMISSION using jQuery .val("") method

$("#train-name-input").val("");
$("#destination-input").val("");
$("#first-train-time-input").val("");
$("#frequency-input").val("");
// METHOD FOR CODE FOR WEBPAGE DISPLAY TO SYNCHRONIZE WITH FIREBASE DATABASE: CREATE OBJECT TO PUSH TO FIREBASE
// FIREBASE: assign object key and value pairs for pushing to FIREBASE; eg: key is name: and value is trainName; values for keys in Firebase equal to value variable used in webpage display
var newTrain = {
    name: trainName,
    endpoint: destination,
    time: firstTrainTime,
    often: frequency
}

// Transfers/pushes data from newTrain object to FIREBASE REALTIME DATABASE
// newTrain object is pushed to ROOT of FIREBASE database
// Ways to Save Data
// set:	Write or replace data to a defined path, like messages/users/<username>
// update:vUpdate some of the keys for a defined path without replacing all of the data
// push: Add to a list of data in the database. Every time you push a new node onto a list, your database generates a unique key, like messages/users/<unique-user-id>/<username>
// transaction: Use transactions when working with complex data that could be corrupted by concurrent updates
    database.ref().push(newTrain);

// Verify pushing correct data to FIREBASE
// REVIEW OF CONCEPTS (below): console for Firebase Database - not for webpage console
console.log(newTrain.name);
console.log(newTrain.endpoint);
console.log(newTrain.time);
console.log(newTrain.often);

alert("Train successfully added.");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry

// REVIEW OF CONCEPTS, FIREBASE (below):
    // Firebase database is a JSON tree.
    // To retrieve data, think in terms of dataSnapshot: pick a key, where key would be a dataSnapshot, and value for key would be everything downstream of the key. EVERY KEY has a dataSnapshot.
    
    // DataSnapshot contains data from a Database location. Any time you read data from the Database, you receive the data as a dataSnapshot. A dataSnapshot is passed to the event callbacks you attach with on() or once(). You can extract the contents of the snapshot as a JavaScript object by calling the val() method. Or you can look into the snapshot by calling child()to return child snapshots (which you could then call val() on).
        
    // on() method: on(eventType: EventType, callback: function)
    // Listens for data changes at a particular location.

// This is the primary way to read data from a Database. Your callback will be triggered for the initial data and again whenever the data changes. 

// VALUE EVENT
// This event will trigger once with the initial data stored at this location, and then trigger again each time the data changes. The DataSnapshot passed to the callback will be for the location at which on() was called. It won't trigger until the entire contents has been synchronized. If the location has no data, it will be triggered with an empty DataSnapshot (val() will return null).

// CHILD_ADDED EVENT 
// This event will be triggered once for each initial child at this location, and it will be triggered again every time a new child is added. The DataSnapshot passed into the callback will reflect the data for the relevant child. For ordering purposes, it is passed a second argument which is a string containing the key of the previous sibling child by sort order, or null if it is the first child.

// Example
// Handle a new value:

// ref.on('value', function(dataSnapshot) {
//   ...
// });

// Example
// Handle a new child:

// ref.on('child_added', function(childSnapshot, prevChildKey) {
//   ...
// });

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().endpoint;
    var firstTrainTime = childSnapshot.val().time;
    var frequency = childSnapshot.val().often;
  
    // Employee Info
    console.log(trainName);
    console.log(destination);
    console.log("first train snapshot " + firstTrainTime);
    console.log(frequency);
  
var frequency = childSnapshot.val().often;
var firstTrainTime = childSnapshot.val().time;

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
console.log(firstTrainTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % frequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = frequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


    // // Current Time
    // var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // // Difference between the times
    // var diffTime = moment().diff(trainTConver, "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // // Time apart (remainder)
    // var tRemainder = diffTime % frequency;
    // console.log("remainder " + tRemainder);

    // // Minute Until Train
    // var tMinutesTillTrain = frequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // // Next Train
    // var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    // console.log("ARRIVAL TIME: " + nextTrain);

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(nextTrain),
      $("<td>").text(tMinutesTillTrain)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

  });





  
    
  
    