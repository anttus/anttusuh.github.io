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
  // console.log(user);
  // var uname, email, uid, groupid, ingroup;
  let groupid;

  firebase.database().ref().child('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
    const userData = snap.val();
    if (userData) {
      snap.forEach((data) => {
        if (data.val().invitedToGroup) {
          $('#notification').show();
        } else {
          $('#notification').hide();
        }
      });
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

function inviteUser(dbUser, inviter) {
  firebase.database().ref('Users/User/' + dbUser.uid).set({
    username: dbUser.username,
    uid: dbUser.uid,
    email: dbUser.email,
    groupid: dbUser.groupid,
    invitedToGroup: inviter.groupid,
    invitedBy: inviter.username
  });
}

//Adding people to the group
document.getElementById('btnGroup').addEventListener('click', e => {
  const mainBody = document.getElementById('mainBody');
  const groupForm = document.getElementById('groupForm');
  const closeGroup = document.getElementById('groupClose');
  const groupInvite = document.getElementById('btnGroupInvite');
  const showInvitation = document.getElementById('showInvitation');
  const acceptDecline = document.getElementById('divAcceptDecline');
  const acceptInvite = document.getElementById('btnAcceptInvite');
  const declineInvite = document.getElementById('btnDeclineInvite');

  mainBody.style.display = 'none';
  groupForm.style.display = 'block';

  let user = firebase.auth().currentUser;
  let dbUser, inviter;

  //Pending invite functionality
  firebase.database().ref().child('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
    snap.forEach((childSnap) => {
      let dbValue = childSnap.val();
      if(dbValue.invitedToGroup) {
        showInvitation.innerHTML = dbValue.invitedBy + " kutsui sinut ryhmään";
        acceptDecline.style.display = 'block';
        dbUser = {
          username: dbValue.username,
          uid: dbValue.uid,
          email: dbValue.email,
          groupid: dbValue.groupid,
          invitedToGroup: dbValue.invitedToGroup,
          invitedBy: dbValue.invitedBy
        }
        acceptInvite.addEventListener('click', e => {
          updateUser(dbUser.username, dbUser.uid, dbUser.email, dbUser.invitedToGroup);
          acceptDecline.style.display = 'none';
          location.reload();
        });

        declineInvite.addEventListener('click', e => {
          updateUser(dbUser.username, dbUser.uid, dbUser.email, dbUser.groupid);
          acceptDecline.style.display = 'none';
          location.reload();
        });
      }
    });
  });

  // Invite button
  groupInvite.addEventListener('click', e => {

    let txtEmail = document.getElementById('txtInviteEmail').value;
    firebase.database().ref('Users/User').orderByChild('email').equalTo(txtEmail).once('value', snap => {
      if(snap.val()) {
        $('#inviteMessage').html("<br>Kutsu lähetetty!");
        $('#inviteError').html("");
      }
      else {
        $('#inviteError').html("<br>Tarkista osoite.");
        $('#inviteMessage').html("");
      }
    });

    let inviter, dbUser;

    firebase.database().ref().child('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
      const dbUserData = snap.val();
      if(dbUserData) {
        snap.forEach((childSnap) => {
          let dbValue = childSnap.val();
          inviter = {
            username: dbValue.username,
            uid: dbValue.uid,
            email: dbValue.email,
            groupid: dbValue.groupid
          };
        });
        setupInvite(inviter);
      }
    });
    firebase.database().ref().child('Users/User').orderByChild('email').equalTo(txtEmail).once('value', snap => {
      snap.forEach(function(data) {
        let dbData = data.val();
        dbUser = {
          username: dbData.username,
          uid: dbData.uid,
          email: dbData.email,
          groupid: dbData.groupid
        }
        //inviteUser(dbUser, inviter);
        setupInvite(dbUser);
      });
    });
    // console.log(inviter);
    // console.log(dbUser);
  });

  //Close group view
  closeGroup.addEventListener('click', e => {
    groupForm.style.display = 'none';
    mainBody.style.display = 'block';
  });

  // bootbox.prompt({
  //   title: "Lisää käyttäjiä ryhmään käyttäjätunnuksella tai sähköpostilla",
  //
  //   callback: function (result) {
  //   }
  // });
});

let groupArr = [];
function setupInvite(obj) {
  groupArr.push(obj);
  if (groupArr.length >= 2) {
    inviteUser(groupArr[1], groupArr[0]);
    console.log(groupArr[1]);
    console.log(groupArr[0]);
    groupArr = [];
  }
}

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
            // console.log(snap.val());
            var task = snap.val().username + " -> " + snap.val().tasktype + ": " + snap.val().date + " | " + snap.val().time;
            // document.getElementById('task').insertAdjacentHTML("beforeend", task + "<p></p>");
            $('#task').append(task + "<p></p>");
          });

          firebase.database().ref('Tasks').orderByChild('groupid').equalTo(dbUser.groupid).on('value', function(snap) {
            let userArr = [], uniqueNames = [];

            let totalTasks = 0, totalTiskit = 0, totalSiivous = 0, totalImurointi = 0, totalPyykit = 0;
            let i = 0;

            snap.forEach(function(data) {
              let dbData = data.val();
              userArr[i++] = dbData.username;

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

            $.each(userArr, function(i, el) {
              if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
            });

            $('#scoreCount').html('TJ-PISTEET:<br>' + 'Yhteensä: ' + totalTasks +
            '<br>Tiskit: ' + totalTiskit +
            '<br>Siivous: ' + totalSiivous +
            '<br>Imurointi: ' + totalImurointi +
            '<br>Pyykit: ' + totalPyykit +
            '<p></p>Ryhmä:<br>'
          );

          for (var j = 0; j < uniqueNames.length; j++) {
            $('#scoreCount').append("<li>" + uniqueNames[j] + "</li>");
          }

        });
      });
    } else {
      // document.getElementById('task').innerHTML = "";
      $('#task').html("");
    }
  });
}
}

//Read the total number of users
function readUsers() {
  firebase.database().ref('Users').on("child_added", function(snap) {
    numUsers = snap.numChildren();
  });
}
