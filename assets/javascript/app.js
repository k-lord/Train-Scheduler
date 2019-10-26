// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCvzykr5PNHScGILtGUmQR5Kw1YYTkN3JQ",
    authDomain: "train-scheduler-9c619.firebaseapp.com",
    databaseURL: "https://train-scheduler-9c619.firebaseio.com",
    projectId: "train-scheduler-9c619",
    storageBucket: "train-scheduler-9c619.appspot.com",
    messagingSenderId: "226869110716",
    appId: "1:226869110716:web:0e3d23e26b3ce2d0986db9",
    measurementId: "G-PHW99PCW12"
    };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// set variable to reference database
var database = firebase.database();

//set initial global variables and values
var trainName = "";
var trainDestination = "";
var firstTime = "";
var frequency = "";

//on-click event when current user clicks submit button
$("#submit").on("click", function(event){
    //prevents page from reloading
    event.preventDefault();
    //sets variable values to the input data submitted by the user
    trainName = $("#train-name").val().trim();
    trainDestination = $("#train-destination").val().trim();
    firstTime = $("#first-time").val().trim();
    frequency = $("#train-frequency").val().trim();

    // Utilizing Moments.js to calculate values for Next Arrival and Minutes Away

    //First Time pushed back 1 month to guarantee the first time is before current time
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "months");
    // Current Time
    var currentTime = moment();
    // Difference between the start and current times
    var difference = moment().diff(moment(firstTimeConverted), "minutes");
    // Time passed since last train
    var timeRemainder = difference % frequency;
    // Minutes left Until Train
    var minutesTillTrain = frequency - timeRemainder;
    // Next Train
    var nextTrain = moment().add(minutesTillTrain, "minutes");
   

    //console log the input data submitted by the user
    console.log("user submitted train name: " + trainName);
    console.log("user submitted train destination: " + trainDestination);
    console.log("user submitted first time: " + firstTime);
    console.log("user submitted frequency: " + frequency);
    console.log("Current time is: " + moment(currentTime).format("hh:mm"));
    console.log("Next Arrival Time: " + moment(nextTrain).format("hh:mm"));
    console.log("The minutes since the last train: " + timeRemainder);
    console.log("The minutes until the next train: " + minutesTillTrain);

    //push the submitted data as a child object to the firebase database
    database.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        firstTime: firstTime,
        frequency: frequency,
        minutesTillTrain: minutesTillTrain,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
});

// Firebase watcher .on("child_added")
database.ref().on("child_added", function(snapshot) {
    // storing the snapshot.val() as a variable
    var snap = snapshot.val();

    // Console.logging the last user's JSON
    console.log(snap);

    var newRow = "<tr><td>" + snap.trainName + "</td><td>" + snap.trainDestination + "</td><td>Every " + snap.frequency + " minutes</td><td>" + moment().add(snap.minutesTillTrain, "minutes").format("hh:mm A") + "</td><td>" + snap.minutesTillTrain + " minutes</td></tr>"

    $(".train-table").append(newRow);

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });



