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

// var taskID = 0;
var latestTask;
let dbUser;

//ID generator
var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

function writeUser(uname, uid, email) {
  var user = firebase.auth().currentUser;
  // user.testValue = "dingdong";
  console.log(user);
  // var uname, email, uid, groupid, ingroup;
  let groupid;

  firebase.database().ref().child('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
    const userData = snap.val();
    if (userData) {

    }
    else {
      console.log('creating a new user for the database.');
      groupid = ID();
      firebase.database().ref('Users' + '/User/' + uid).set({
        username: uname,
        uid: uid,
        email: email,
        groupid: groupid,
      });
    }
  });
}

function setDBUser() {
  let user = firebase.auth().currentUser;
  firebase.database().ref().child('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
    const dbUserData = snap.val();
    if(dbUserData) {
      snap.forEach((childSnap) => {
        let dbValue = childSnap.val();
        dbUser = {
          username: dbValue.username,
          uid: dbValue.uid,
          email: dbValue.email,
          groupid: dbValue.groupid,
        };
      });
    }
  });
}

function updateUser(uname, uid, email, groupid) {
  firebase.database().ref('Users' + '/User/' + uid).set({
    username: uname,
    uid: uid,
    email: email,
    groupid: groupid,
  });
}

//Adding people to the group
document.getElementById('btnGroup').addEventListener('click', function() {
  var user = firebase.auth().currentUser;

  bootbox.prompt({
    title: "Lisää käyttäjiä ryhmään käyttäjätunnuksella tai sähköpostilla",

    callback: function (result) {
      firebase.database().ref().child('Users/User').orderByChild('email').equalTo(result).once('value', snap => {
        firebase.database().ref().child('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
          const dbUserData = snap.val();
          if(dbUserData) {
            snap.forEach((childSnap) => {
              let dbValue = childSnap.val();
              dbUser = {
                username: dbValue.username,
                uid: dbValue.uid,
                email: dbValue.email,
                groupid: dbValue.groupid,
              };
            });
          }
        });
        snap.forEach(function(data) {
          updateUser(data.val().username, data.val().uid, data.val().email, dbUser.groupid);
        });
      });
    }
  });
});


//Writing the tasks
//Need to implement a way to separate groups (Group#X/Tasks/Task#X)?
function writeTask(tasktype) {
  setDBUser();
  var user = firebase.auth().currentUser;
  var uname, email, uid, groupid, taskid;

  if (user) {
    //Getting user's information
    if (user != null) {
      uname = user.displayName;
      email = user.email;
      uid = user.uid;
      groupid = dbUser.groupid;
    }
  }

  //Returns the running id of tasks
  firebase.database().ref('Tasks').once("value", function(snap) {
    let count = 0;

    snap.forEach(function(data) {
      if (data.key) {
        count++;
      }
    });

    taskid = count + 1;
    // console.log(count);
    console.log("Username: " + uname + " email: " + email + " user id: " + uid + " group id: " + groupid + " task id: " + taskid);

    //Sets a new Task table with task id as an identifier
    firebase.database().ref('Tasks/' + taskid).set({
      username: uname,
      email: email,
      uid: uid,
      groupid: groupid,
      taskid: taskid,
      tasktype: tasktype,
      date: getDate(),
      time: getTime()
    });
  });
}

//Get (latest) task's data
function getTaskData(groupid) {
  firebase.database().ref('Tasks').orderByChild('groupid').equalTo(groupid).on("value", function(snap) {
    snap.forEach(function(data) {
      latestTask = data.val().username + ": " + data.val().date + " | " + data.val().time;
    });
    returnLatestTask();
  });
}
//
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
  firebase.database().ref('Tasks').orderByValue().on("value", function(snap) {
    snap.forEach(function(data) {
      taskID = data.key;
    });
  });
  return taskID++;
}

//Reading and listing the tasks
function readTasks() {
  // setDBUser();
  let user = firebase.auth().currentUser;
  if(user) {
    // readUsers();
    // readGroupTasks();
    $("#curUser").html("<p></p>" + getCurUser() + "<br><p></p>");
    firebase.database().ref().child('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
      const dbUserData = snap.val();
      if(dbUserData) {
        snap.forEach((childSnap) => {
          let dbValue = childSnap.val();
          dbUser = {
            username: dbValue.username,
            uid: dbValue.uid,
            email: dbValue.email,
            groupid: dbValue.groupid,
          };
          firebase.database().ref('Tasks').orderByChild('groupid').equalTo(dbUser.groupid).on("child_added", function(snap) {
            getTaskData(dbUser.groupid);
            console.log(snap.val());
            var task = snap.val().username + " -> " + snap.val().tasktype + ": " + snap.val().date + " | " + snap.val().time;
            // document.getElementById('task').insertAdjacentHTML("beforeend", task + "<p></p>");
            $('#task').append(task + "<p></p>");
          });

          firebase.database().ref('Tasks').orderByChild('groupid').equalTo(dbUser.groupid).on('value', function(snap) {
            let userArr = [];
            let totalTasks = 0, totalTiskit = 0, totalSiivous = 0, totalImurointi = 0, totalPyykit = 0;

            snap.forEach(function(data) {
              let dbData = data.val();

              totalTasks++;
              switch(dbData.tasktype) {
                case 'Tiskit':
                totalTiskit++;
                break;
                case 'Siivous':
                totalSiivous++;
                break;
                case 'Imurointi':
                totalImurointi++;
                break;
                case 'Pyykit':
                totalPyykit++;
                break;
              }
            });

            $('#scoreCount').html('TJ-PISTEET:<br>' + 'Yhteensä: ' + totalTasks +
             '<br>Tiskit: ' + totalTiskit +
             '<br>Siivous: ' + totalSiivous +
             '<br>Imurointi: ' + totalImurointi +
             '<br>Pyykit: ' + totalPyykit
            );

          });
        });
      } else {
        // document.getElementById('task').innerHTML = "";
        $('#task').html("");
      }
    });
  }
}

// function readUsers() {
//   firebase.database().ref('Users').on("child_added", function(snap) {
//     numUsers = snap.numChildren();
//     $('#scoreCount').html('TJ-PISTEET:<br>' + 'Käyttäjiä on ' + numUsers);
//   });
// }
