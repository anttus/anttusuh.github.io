// BUTTONS

// Task button
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

// Show more/less info -buttons
$('#scoreButton').click(function() {
  if ($('#scoreCountList').is(":hidden")) {
    $('#scoreCountList').slideDown("fast");
    $('#scoreButton').removeClass('glyphicon-chevron-down');
    $('#scoreButton').addClass('glyphicon-chevron-up');
  } else {
    $('#scoreCountList').slideUp("fast");
    $('#scoreButton').addClass('glyphicon-chevron-down');
    $('#scoreButton').removeClass('glyphicon-chevron-up');
  }
});

$('#showMoreButton').click(function() {
  if ($('#task p:gt(9)').is(":hidden")) {
    $('#task > p').slideDown("fast");
    $('#showMoreButton').removeClass('glyphicon-chevron-down');
    $('#showMoreButton').addClass('glyphicon-chevron-up');
  } else {
    $('#task p:gt(9)').slideUp("fast");
    $('#showMoreButton').removeClass('glyphicon-chevron-up');
    $('#showMoreButton').addClass('glyphicon-chevron-down');
  }
});

// Profile button
$('#btnProfile').click(function() {
  mainBody.style.display = 'none';
  profileForm.style.display = 'block';

  // Accept the new username
  $('#acceptUsername').click(function() {
    var newUsername = $('#newUsername').val();

    updateUsername(newUsername);

    $('#usernameMessage').html('Käyttäjänimi vaihdettu!');
    setTimeout(function() {
      $('#usernameMessage').fadeOut();
    }, 3000);
  });

  // Close the profile window
  $('#profileClose').click(function() {
    profileForm.style.display = 'none';
    mainBody.style.display = 'block';
  });
});

//To be able to press enter on input
$("#txtPassword_SI").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#btnSignIn").click();
  }
});
$("#txtEmail_SI").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#btnSignIn").click();
  }
});
$("#txtUsername").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#btnSignUp").click();
  }
});
$("#txtInviteEmail").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#btnGroupInvite").click();
  }
});
$("#newUsername").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#acceptUsername").click();
  }
});
