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
}());

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
      // console.log('creating a new user for the database.');
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

function updateUserGroup(uid, groupid) {
  firebase.database().ref('Users/User/' + uid).update({
    groupid: groupid
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

function updateUsername(username) {
  let user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: username
  });

  firebase.database().ref('Users/User/' + user.uid).update({
    username: username
  });
}

function inviteUser(dbUser, invGroupId, invByUser) {
  firebase.database().ref('Users/User/' + dbUser.uid).set({
    username: dbUser.username,
    uid: dbUser.uid,
    email: dbUser.email,
    groupid: dbUser.groupid,
    invitedToGroup: invGroupId,
    invitedBy: invByUser
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
  const leaveGroup = document.getElementById('btnGroupLeave');

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
          let groupid = ID();
          updateUser(dbUser.username, dbUser.uid, dbUser.email, groupid);
          firebase.database().ref('Users/User/').orderByChild('groupid').equalTo(dbUser.invitedToGroup).once('value', snap => {
            snap.forEach(data => {
              updateUserGroup(data.val().uid, groupid)});
          });
          showInvitation.innerHTML = "Sinulla ei ole kutsuja...";
          acceptDecline.style.display = 'none';
          groupForm.style.display = 'none';
          mainBody.style.display = 'block';
        //  location.reload();
        });

        declineInvite.addEventListener('click', e => {
          updateUser(dbUser.username, dbUser.uid, dbUser.email, dbUser.groupid);
          acceptDecline.style.display = 'none';
          showInvitation.innerHTML = "Sinulla ei ole kutsuja...";
          location.reload();
        });
      }
    });
  });

  // Invite button
  groupInvite.addEventListener('click', e => {

    let txtEmail = document.getElementById('txtInviteEmail').value;
    let inviter, dbUser, dbInvGroupId, dbInvBy;

    firebase.database().ref('Users/User').orderByChild('email').equalTo(txtEmail).once('value', snap => {

      if(snap.val()) {
        $('#inviteMessage').html("<br>Kutsu lähetetty!");
        $('#inviteError').html("");
        setTimeout(function() {
          $('#inviteMessage').fadeOut();
        }, 3000);
        snap.forEach(data => {
            let dbData = data.val();
            dbUser = {
              username: dbData.username,
              uid: dbData.uid,
              email: dbData.email,
              groupid: dbData.groupid
            }
        });
        firebase.database().ref().child('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
          const dbUserData = snap.val();
          if(dbUserData) {
            snap.forEach((childSnap) => {
              let dbValue = childSnap.val();
              dbInvGroupId = dbValue.groupid;
              dbInvBy = dbValue.username;
            });
            inviteUser(dbUser, dbInvGroupId, dbInvBy);
          }
        });
      }
      else {
        $('#inviteError').html("<br>Tarkista osoite.");
        $('#inviteMessage').html("");
      }
    });

    txtEmail.value = "";
  });

  leaveGroup.addEventListener('click', e => {
    groupid = ID();
    updateUserGroup(user.uid, groupid);
    updateTaskList(groupid);
    $('#groupClose').click();
  });

  //Close group view
  closeGroup.addEventListener('click', e => {
    groupForm.style.display = 'none';
    mainBody.style.display = 'block';
  });
});

//Writing the tasks
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

    // console.log("Username: " + uname + " email: " + email + " user id: " + uid + " group id: " + groupid + " task id: " + taskid);

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

//Returns the latest task to the navbar
function returnLatestTask() {
  var latestTask_ = latestTask;
  if (latestTask_ != undefined) {
    $('#navbarTitle').html("Viimeisin: <p></p>" + latestTask_);
  } else {
    $('#navbarTitle').html("Aikoja ei ole vielä merkitty");
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
  let user = firebase.auth().currentUser;

  if(user) {
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

          //New task functionality
          firebase.database().ref('Tasks').orderByChild('groupid').equalTo(dbUser.groupid).on("child_added", function(snap) {
            // Update latest task to navbar
            getTaskData(dbUser.groupid);
            // Update the task listing
            updateTaskList(dbUser.groupid);
          });

          firebase.database().ref('Tasks').orderByChild('groupid').equalTo(dbUser.groupid).on('value', function(snap) {
            let userArr = [], uniqueNames = [];

            let totalTasks = 0, totalDishes = 0, totalCleaning = 0, totalVacuuming = 0, totalLaundry = 0;
            let i = 0;

            snap.forEach(function(data) {
              let dbData = data.val();
              userArr[i++] = dbData.username;

              totalTasks++;
              switch(dbData.tasktype) {
                case 'Tiskit':
                totalDishes++;
                break;
                case 'Siivous':
                totalCleaning++;
                break;
                case 'Imurointi':
                totalVacuuming++;
                break;
                case 'Pyykit':
                totalLaundry++;
                break;
              }
            });

            $.each(userArr, function(i, el) {
              if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
            });

            let counter = 0;
            $('#scoreCountList').empty();

            for (var j = 0; j < uniqueNames.length; j++) {
              let dishes = 0, cleaning = 0, vacuuming = 0, laundry = 0;
              let dishPercent, cleanPercent, vacuumPercent, laundryPercent;
              let name = uniqueNames[j];
              firebase.database().ref('Tasks').orderByChild('username').equalTo(uniqueNames[j]).once('value', snap =>{
                snap.forEach((data => {
                  let dbTask = data.val();
                  if(dbTask.groupid == dbUser.groupid) {
                    switch(dbTask.tasktype) {
                      case 'Tiskit':
                      dishes++;
                      break;
                      case 'Siivous':
                      cleaning++;
                      break;
                      case 'Imurointi':
                      vacuuming++;
                      break;
                      case 'Pyykit':
                      laundry++;
                      break;
                    }
                  }
                }));

                dishPercent = ((dishes/totalDishes)*100).toFixed(1);
                cleanPercent = ((cleaning/totalCleaning)*100).toFixed(1);
                vacuumPercent = ((vacuuming/totalVacuuming)*100).toFixed(1);
                laundryPercent = ((laundry/totalLaundry)*100).toFixed(1);

                //NEEDS A BETTER IMPLEMENTATION
                $('#scoreCount').html(
                'TJ-PISTEET:<br>' + '<strong>Yhteensä: ' + totalTasks +
                '</strong><br>Tiskit: ' + totalDishes +
                '<br>Siivous: ' + totalCleaning +
                '<br>Imurointi: ' + totalVacuuming +
                '<br>Pyykit: ' + totalLaundry + '<p></p>');

                $('#scoreCountList').append(
                uniqueNames[counter++] + ":<br>Tiskit: " + dishes + " (" + dishPercent + "%)<br>Siivous: " +
                cleaning + " (" + cleanPercent + "%)<br>Imurointi: " +
                vacuuming + " (" + vacuumPercent + "%)<br>Pyykit: " +
                laundry + " (" + laundryPercent + "%)<p></p>"
              );
            });
          }
        });
      });
    } else {
      $('#task').html("");
    }
  });
}
}

function updateTaskList(groupid) {
  $('#task').empty();
  firebase.database().ref('Tasks').orderByChild('groupid').equalTo(groupid).once('value', snap => {
    snap.forEach(data => {
      var task = "<p>" + data.val().username + " -> " + data.val().tasktype + ": " + data.val().date + " | " + data.val().time + "</p>";
      $('#task').prepend(task);

      // Shows only the 10 latest tasks
      var numOfNodes = $('#task > p').length;
      if (numOfNodes > 10) {
        $('#task p:gt(9)').hide();
        $('#showMoreGlyph').show();
        $('#showMoreButton').show();
      } else {
        $('#showMoreGlyph').hide();
        $('#showMoreButton').hide();
      }
    });
  });
}

//Read the total number of users
function readUsers(groupid) {
  firebase.database().ref('Users').on("child_added", function(snap) {
    numUsers = snap.numChildren();
  });
}
