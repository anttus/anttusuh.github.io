var taskid = 1;
// var username, email, photoUrl, uid, emailVerified;

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

  //TESTING
  // writeTask("7", "Petri", "5");
  // for (var i = 0; i < 10; i++) {
  //   writeTask(1, "Anttu", 1);
  // }

  readTasks();

}());

//Writing the tasks
//Need to implement a way to separate groups (Group#X/Tasks/Task#X)?
function writeTask(uid, username, groupid) {
  firebase.database().ref('Tasks/Task' + taskid++).set({ //Sets a new Task table with the task number
    username: username,
    date: getDate(),
    time: getTime(),
    uid: uid,
    groupid: groupid,
    taskid: taskid
  });
}

//Reading and listing the tasks
function readTasks() {
    firebase.database().ref('Tasks').orderByChild('Tasks').on("child_added", function(snap) {
    var node = document.createElement("p");
    var task = snap.val().username + ": " + snap.val().date + " | " + snap.val().time;
    var textNode = document.createTextNode(task);
    node.appendChild(textNode);
    document.getElementById('task').prepend(node); //Prepend so that the newest task is first on the list
    // preObject.append(snap.val().username + ": " + snap.val().date + " | " + snap.val().time + "\n");
  });
}
