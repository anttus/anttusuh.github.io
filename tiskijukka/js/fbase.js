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
var ID = function() {
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
    } else {
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

  firebase.database().ref('Tasks').orderByChild('uid').equalTo(user.uid).once('value', snap => {
    snap.forEach(data => {
      firebase.database().ref('Tasks/' + data.val().taskid).update({
        username: username
      });
    });
    location.reload();
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

function removeUserTasks() {
  let user = firebase.auth().currentUser;
  firebase.database().ref('Tasks').orderByChild('uid').equalTo(user.uid).once('value', snap => {
    snap.forEach(data => {
      console.log(data.val().taskid);
      firebase.database().ref('Tasks/' + data.val().taskid).remove();
    });
    location.reload();
  });
}

//Writing the tasks
function writeTask(tasktype) {

  //Returns the running id of tasks
  firebase.database().ref('Tasks').limitToLast(1).once("value", function(snap) {
    let count = 0;
    snap.forEach(function(data) {
      if (data.key) {
        count = data.key;
        count++;
      }
    });
    taskid = count;
    // Set the task into the database
    setTask(taskid, tasktype);
  });
}


//Sets a single task
function setTask(taskid, tasktype) {
  let user = firebase.auth().currentUser;

  firebase.database().ref('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
    let groupid;
    snap.forEach(data => {
      let dbValue = data.val();
      groupid = dbValue.groupid;
    });
    //Sets a new Task table with task id as an identifier
    firebase.database().ref('Tasks/' + taskid).set({
      username: user.displayName,
      email: user.email,
      uid: user.uid,
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

// function returnTaskID() {
//   firebase.database().ref('Tasks').orderByValue().on("value", function(snap) {
//     snap.forEach(function(data) {
//       taskID = data.key;
//     });
//   });
//   return taskID++;
// }

//Reading and listing the tasks
function readTasks() {
  let user = firebase.auth().currentUser;

  if (user) {
    $("#curUser").html("<p></p>" + getCurUser() + "<br><p></p>");

    firebase.database().ref().child('Users/User').orderByChild('uid').equalTo(user.uid).once('value', snap => {
      const dbUserData = snap.val();
      let groupid;
      if (dbUserData) {
        snap.forEach(data => {
          groupid = data.val().groupid;
        });
        //New task functionality
        firebase.database().ref('Tasks').orderByChild('groupid').equalTo(groupid).on("child_added", function(snap) {
          // Update latest task to navbar
          getTaskData(groupid);
          // Update the task listing
          updateTaskList(groupid);
        });
        // Calculate the scores.
        calculateScores(groupid);
      }
       else {
        $('#task').html("");
      }
    });
  }
}

function calculateScores(groupid) {
  // Get tasks based on groupid
  firebase.database().ref('Tasks').orderByChild('groupid').equalTo(groupid).on('value', function(snap) {
    // Arrays to store users and names.
    let userArr = [], uniqueNames = [];

    // Variables to hold total tasks by type.
    let totalTasks = {total: 0, dishes: 0, cleaning: 0, vacuuming: 0, laundry: 0};
    let i = 0;

    // Get users and total tasks by type.
    snap.forEach(function(data) {
      let dbData = data.val();
      userArr[i++] = dbData.username;

      totalTasks.total++;
      switch (dbData.tasktype) {
        case 'Tiskit':
          totalTasks.dishes++;
          break;
        case 'Siivous':
          totalTasks.cleaning++;
          break;
        case 'Imurointi':
          totalTasks.vacuuming++;
          break;
        case 'Pyykit':
          totalTasks.laundry++;
          break;
      }
    });

    firebase.database().ref('Users/User/').orderByChild('groupid').equalTo(groupid).once('value', snap => {
      snap.forEach(data => {
        uniqueNames.push(data.val().username);
      });

      // Show unique group members.
      showGroupMembers(uniqueNames);
      // Update the total score count.
      updateScoreCount(totalTasks);
      // Calculate each group members scores.
      calculatePersonalScore(uniqueNames, totalTasks, groupid);
      // console.log(uniqueNames);
    });
  });
}

function calculatePersonalScore(uniqueNames, totalTasks, groupid) {
  for (var j = 0; j < uniqueNames.length; j++) {
    //Variables for each user.
    let tasks = {total: 0, dishes: 0, cleaning: 0, vacuuming: 0, laundry: 0,
      totalPercent: 0, dishPercent: 0, cleanPercent: 0, vacuumPercent: 0, laundryPercent: 0
    };
    let name = uniqueNames[j];

    // Generate Single users in a group
    // Generate tasks for each user by tasktype
    firebase.database().ref('Tasks').orderByChild('username').equalTo(uniqueNames[j]).once('value', snap => {
      snap.forEach((data => {
        let dbTask = data.val();
        tasks.total++;
        if (dbTask.groupid == groupid) {
          switch (dbTask.tasktype) {
            case 'Tiskit':
              tasks.dishes++;
              break;
            case 'Siivous':
              tasks.cleaning++;
              break;
            case 'Imurointi':
              tasks.vacuuming++;
              break;
            case 'Pyykit':
              tasks.laundry++;
              break;
          }
        }
      }));
      // Calculate percentages from total tasks

      tasks.totalPercent = calcPercents(totalTasks.total, tasks.total);
      tasks.dishPercent = calcPercents(totalTasks.dishes, tasks.dishes);
      tasks.cleanPercent = calcPercents(totalTasks.cleaning, tasks.cleaning);
      tasks.vacuumPercent = calcPercents(totalTasks.vacuuming, tasks.vacuuming);
      tasks.laundryPercent = calcPercents(totalTasks.laundry, tasks.laundry);

      updateScoreCountList(name, tasks);
    });
  }
}

function calcPercents(totalTasks, total) {
  if (total === 0) {
    percent = 0;
  } else {
    percent = ((totalTasks / total) * 100).toFixed(1);
  }
  return percent;
}

function updateScoreCount(totalTasks) {
  //NEEDS A BETTER IMPLEMENTATION
  $('#scoreCountList').empty();
  $('#scoreCount').html(
    'TJ-PISTEET:<br>' + '<strong>Yhteensä: ' + totalTasks.total +
    '</strong><br>Tiskit: ' + totalTasks.dishes +
    '<br>Siivous: ' + totalTasks.cleaning +
    '<br>Imurointi: ' + totalTasks.vacuuming +
    '<br>Pyykit: ' + totalTasks.laundry +
    '<p></p>');
}

function updateScoreCountList(name, tasks) {
  $('#scoreCountList').append(
    "<strong>" + name + "</strong>" + ":<br>Tiskit: " +
    tasks.dishes + " (" + tasks.dishPercent + "%)<br>Siivous: " +
    tasks.cleaning + " (" + tasks.cleanPercent + "%)<br>Imurointi: " +
    tasks.vacuuming + " (" + tasks.vacuumPercent + "%)<br>Pyykit: " +
    tasks.laundry + " (" + tasks.laundryPercent + "%)<p></p>"
  );
}

function showGroupMembers(uniqueNames) {
  $('#groupMembers').empty();
  if (uniqueNames.length < 2) {
    $('#groupMembers').html('<br /><p>Ryhmäsi jäsenet:</p>Ryhmässäsi ei ole vielä muita jäseniä.<br>');
  } else {
    $('#groupMembers').html('<br /><p>Ryhmäsi jäsenet:</p>');
  }
  for (var x = 0; x < uniqueNames.length; x++) {
    if (x === 0) {
      $('#groupMembers').append("<strong>" + uniqueNames[x] + "<strong>");
    } else {
      $('#groupMembers').append("<strong>, " + uniqueNames[x] + "<strong>");
    }
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
