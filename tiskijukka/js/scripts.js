// Loading icon
function onReady(callback) {
  var intervalID = window.setInterval(checkReady, 1300);
  function checkReady() {
    if (document.getElementsByTagName('body')[0] !== undefined) {
      window.clearInterval(intervalID);
      callback.call(this);
    }
  }
}
function show(id, value) {
  document.getElementById(id).style.display = value ? 'block' : 'none';
}
onReady(function () {
  show('mainBody', true);
  show('loading', false);
});

function getDate() {
  var currentdate = new Date();
  var date = ('0' + currentdate.getDate()).slice(-2) + '.' +
  ('0' + (currentdate.getMonth()+1)).slice(-2)  + '.' +
  currentdate.getFullYear();
  return date;
}

function getTime() {
  var currentdate = new Date();
  var time =  + ('0' + currentdate.getHours()).slice(-2) + ":"
  + ('0' + currentdate.getMinutes()).slice(-2) + ":"
  + ('0' + currentdate.getSeconds()).slice(-2);
  return time;
}

function getCurUser() {
  var user = firebase.auth().currentUser;
  var uname, email, photoUrl, uid, emailVerified;

  if (user) {
    // Getting user's information
    if (user != null) {
      uname = user.displayName;
    }
  }
  return uname;
}

window.onload = function() {
  var numOfNodes = $('#task > p').length;
  if (numOfNodes == 0) {
    $('#navbarTitle').html('Aloita kutsumalla muita ryhmääsi.');
    $('#task').html('Et ole vielä merkinnyt tehtäviä.<br><br>Aloita kutsumalla muita ryhmääsi.');
    $('#showMoreGlyph').hide();
    $('#showMoreButton').hide();
  }
}

function getProfileImg() {
  let user = firebase.auth().currentUser;
  let imgUrl = user.providerData[0].photoUrl;

  console.log(user.displayName + " " + imgUrl);

  $("#profileImg").attr("src", imgUrl);

}
