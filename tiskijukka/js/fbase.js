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
  const dbRefObject = db.ref().child('Tasks');

  //EXAMPLE
  //Sync object changes
  dbRefObject.on('value', snap => {
    console.log(snap.val());
    var obj = snap.val();
    var task = obj.Task;
    // var objString = JSON.stringify(obj);
    preObject.innerText = (task.username + ": " + task.date + " | " + task.time + "\n");
    // preObject.innerText = JSON.stringify(snap.val(), null, 3);
  });

  //EXAMPLE
  writeTask("4", "Anttu3", "23.11.2017", "12:57", "3");

  //WRITING THE TASKS
  function writeTask(userId, username, date, time, groupid) {
    db.ref('Tasks/Task' + userId).set({
      username: username,
      userid: userId,
      date: date,
      time: time,
      groupid: groupid
    });
  }

}());
