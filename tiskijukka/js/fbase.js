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

  // Get a reference to the database service
  const db = firebase.database();

  //Get elements
  const preObject = document.getElementById('task');

  //Create references
  const refObject = db.ref('Tasks').orderByChild('Tasks');

  //EXAMPLE
  // writeTask("6", "Heikki", "39.11.2017", "16:43", "1");
  readTasks();

  //WRITING THE TASKS
  function writeTask(userId, username, date, time, groupid) {
    db.ref('Tasks/Task' + userId).set({
      username: username,
      date: date,
      time: time,
      userid: userId,
      groupid: groupid,
    });
  }

  function readTasks() {
    refObject.on("child_added", function(snap) {
      var node = document.createElement("p");
      var task = snap.val().username + ": " + snap.val().date + " | " + snap.val().time;
      var textNode = document.createTextNode(task);
      node.appendChild(textNode);
      preObject.prepend(node);
      // preObject.append(snap.val().username + ": " + snap.val().date + " | " + snap.val().time + "\n");
    });
  }

}());
