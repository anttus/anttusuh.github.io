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

// BUTTONS
// "Tiskit tehty!" -button
const btnDish = document.getElementById('btnDish');
var cdBool = false;
btnDish.addEventListener('click', function () {
  if(!cdBool) {
    writeTask(document.getElementById('dropdownDish').value);
    cdBool = true;
    setTimeout(function() {
      cdBool = false;
      $('#dishSuccess').hide();
    }, 3000);
  }
  else {
    $('#dishSuccess').show();
  }
});

//function setProfImg()

// Dropdown menu
function dropdown() {
  $('.dropdown').on('show.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
  });
}

function dropdownUp() {
  $('.dropdown').on('hide.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
  });
}

$("#scoreButton").click(function() {
  $('#scoreCountList').toggle();
});

// function play() {
//   $(document).ready(function() {
//     $("#audio").get(0).play();
//   });
// }
