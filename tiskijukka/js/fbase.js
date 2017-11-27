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

//Writing the tasks
//Need to implement a way to separate groups (Group#X/Tasks/Task#X)?
function writeTask() {
  var user = firebase.auth().currentUser;
  var uname, email, photoUrl, uid, emailVerified;

  if (user) {
    //Getting user's information
    if (user != null) {
      uname = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;
    }
  }

  console.log(uname + " " + email + " " + emailVerified + " " + uid);

  //TEMPORARY
  var groupid = 1;

  //Returns the number of tasks
  var taskid = returnTaskID();
  taskid++;

  firebase.database().ref('Group' + groupid + '/' + taskid).set({ //Sets a new Task table with the task number
    username: uname,
    date: getDate(),
    time: getTime(),
    uid: uid,
    groupid: groupid,
    taskid: taskid
  });
}

//Get (latest) task's data
function getTaskData() {
  firebase.database().ref('Group1').on("value", function(snap) {
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
  $("#curUser").html("Logged in as:</br>" + getCurUser());
  getTaskData();
  firebase.database().ref('Group1').orderByValue().on("child_added", function(snap) {
    var node = document.createElement("p");
    var task = snap.val().username + ": " + snap.val().date + " | " + snap.val().time;
    var textNode = document.createTextNode(task);
    node.appendChild(textNode);
    document.getElementById('task').prepend(node); //Prepend so that the newest task is first on the list
  });
}
