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


  // // Get a reference to the database service
  // const db = firebase.database();
  //
  // //Get elements
  // const preObject = document.getElementById('task');
  //
  // //Create references
  // const refObject = db.ref('Tasks').orderByChild('Tasks');

}());

var taskID = 0;
var latestTask;

//ID generator
var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

function writeUser(uname, uid, email) {
  var ingroup = false;
  firebase.database().ref('Users' + '/User/' + uid).set({
    username: uname,
    uid: uid,
    email: email,
    ingroup: ingroup
  });
}

function updateGroupStatus(boolean) {
  var user = firebase.auth().currentUser;
  user.updateProfile({
    ingroup: boolean
  });
}

//Writing the tasks
//Need to implement a way to separate groups (Group#X/Tasks/Task#X)?
function writeTask() {
  var user = firebase.auth().currentUser;
  var uname, email, uid, groupid;

  if (user) {
    //Getting user's information
    if (user != null) {
      uname = user.displayName;
      email = user.email;
      uid = user.uid;
      groupid = user.groupid;
    }
  }

  //Returns the running id of tasks
  var taskid = returnTaskID();
  taskid++;

  console.log("Username: " + uname + " email: " + email + " user id: " + uid + " group id: " + groupid);

  //Sets a new Task table with task id as an identifier
  firebase.database().ref('Tasks/' + taskid).set({
    username: uname,
    email: email,
    uid: uid,
    // groupid: groupid,
    taskid: taskid,
    date: getDate(),
    time: getTime()
  });
}

//Get (latest) task's data
function getTaskData() {
  firebase.database().ref('Tasks').on("value", function(snap) {
    snap.forEach(function(data) {
      taskID = data.key;
      latestTask = data.val().username + ": " + data.val().date + " | " + data.val().time;
    });
    returnTaskID();
    returnLatestTask();
  });
}

function returnLatestTask() {
  var latestTask_ = latestTask;
  var navbarTitle = document.getElementById('navbarTitle');
  if (latestTask_ != undefined) {
    navbarTitle.innerHTML = "Viimeisin: <p></p>" + latestTask_;
  } else {
    navbarTitle.innerHTML = "Aikoja ei ole vielä merkitty"
  }
}

function returnTaskID() {
  var taskID_ = taskID;
  return taskID_;
}

//Reading and listing the tasks
function readTasks() {
  readUsers();
  $("#curUser").html("<p></p>" + getCurUser() + "<br><p></p>");
  getTaskData();
  firebase.database().ref('Tasks').orderByValue().on("child_added", function(snap) {
    var task = snap.val().username + ": " + snap.val().date + " | " + snap.val().time;
    document.getElementById('task').insertAdjacentHTML("afterbegin", task + "<p></p>");
  });
}

function readUsers() {
  firebase.database().ref('Users').orderByValue().on("child_added", function(snap) {
    console.log(snap.numChildren());
  });
}
