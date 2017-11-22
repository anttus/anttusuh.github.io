// var username, email, photoUrl, uid, emailVerified;
var taskID = 0;
var latestTask;

(function() {

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCqiuxQhyWc3voH49Zh2j3ze83s73DHaXk",
    authDomain: "tiskijukka-1.firebaseapp.com",
    databaseURL: "https://tiskijukka-1.firebaseio.com",
    projectId: "tiskijukka-1",
    storageBucket: "tiskijukka-1.appspot.com",
    messagingSenderId: "591860487071"
  };
  firebase.initializeApp(config);

  readTasks();

  // // Get a reference to the database service
  // const db = firebase.database();
  //
  // //Get elements
  // const preObject = document.getElementById('task');
  //
  // //Create references
  // const refObject = db.ref('Tasks').orderByChild('Tasks');

  //Getting user's information
  // var user = firebase.auth().currentUser;
  //
  // if (user != null) {
  //   username = user.displayName;
  //   email = user.email;
  //   photoUrl = user.photoURL;
  //   emailVerified = user.emailVerified;
  //   uid = user.uid;
  // }

}());

//Writing the tasks
//Need to implement a way to separate groups (Group#X/Tasks/Task#X)?
function writeTask(username) {

//TEMPORARY
  var groupid = 1;
  var uid = 1;

  var taskid = returnTaskID();
  taskid++;
  firebase.database().ref('Group' + groupid + '/' + taskid).set({ //Sets a new Task table with the task number
    username: username,
    date: getDate(),
    time: getTime(),
    uid: uid,
    groupid: groupid,
    taskid: taskid
  });
}

function getTaskID() {
  firebase.database().ref('Group1').on("value", function(snap) {
    snap.forEach(function(data) {
      taskID = data.key;
    });
    returnTaskID();
  });
}
function returnTaskID() {
  var taskID_ = taskID;
  return taskID_;
}

//Reading and listing the tasks
function readTasks() {
    getTaskID();
    getLatestTask();
    firebase.database().ref('Group1').orderByValue().on("child_added", function(snap) {
      var node = document.createElement("p");
      var task = snap.val().username + ": " + snap.val().date + " | " + snap.val().time;
      var textNode = document.createTextNode(task);
      node.appendChild(textNode);
      document.getElementById('task').prepend(node); //Prepend so that the newest task is first on the list
  });
}

function getLatestTask() {
  firebase.database().ref('Group1').on("value", function(snap) {
    snap.forEach(function(data) {
      latestTask = data.val().username + ": " + data.val().date + " | " + data.val().time;
    });
    returnLatestTask();
  });
}
function returnLatestTask() {
  var latestTask_ = latestTask;
  var navbarTitle = document.getElementById('navbarTitle');
  navbarTitle.append(latestTask_);
}
