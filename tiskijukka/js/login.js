$.validate({
  form : '#modalLogin',
  modules: 'security'
});

const auth = firebase.auth();

// auth.signInWithEmailAndPassword(email, pass);
// auth.createUserWithEmailAndPassword(email, pass);
// auth.onAuthStateChanged(firebaseUser => {});
const modalLogin = document.getElementById('modalLogin');
const btnLogInTab = document.getElementById('btnLogInTab');
const btnSignUpTab = document.getElementById('btnSignUpTab')

const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');

//Sign up
const txtEmail_SU = document.getElementById('txtEmail_SU');
const txtPassword_SU = document.getElementById('txtPassword_SU');
const txtVerifyPassword = document.getElementById('txtVerifyPassword');

//Sign in
const txtEmail_SI = document.getElementById('txtEmail_SI');
const txtPassword_SI = document.getElementById('txtPassword_SI');

const btnSignIn = document.getElementById('btnSignIn');
const btnSignUp = document.getElementById('btnSignUp');
const btnFbSignUp = document.getElementById('btnFbSignUp');
const btnGSignUp = document.getElementById('btnGSignUp');

const mainBody = document.getElementById('mainBody');

var verify;
var fbBool = false;

btnSignUpTab.addEventListener('click', e=> {
  loginForm.style.display = 'none';
  signUpForm.style.display = 'block';
  btnLogInTab.style.background = '#cccccc';
  btnSignUpTab.style.background = 'white';
  txtEmail_SI.value = "";
  txtPassword_SI.value = "";
  txtEmail_SU.value = "";
  txtPassword_SU.value = "";
  txtVerifyPassword.value = "";
  // txtEmail.focus();
});

btnLogInTab.addEventListener('click', e => {
  signUpForm.style.display = 'none';
  loginForm.style.display = 'block';
  btnLogInTab.style.background = 'white';
  btnSignUpTab.style.background = '#cccccc';
  txtEmail_SI.value = "";
  txtPassword_SI.value = "";
  txtEmail_SU.value = "";
  txtPassword_SU.value = "";
  txtVerifyPassword.value = "";
  // txtEmail.focus();
});

function displayLogin() {
  modalLogin.style.display = 'block';
  mainBody.style.display = 'none';
  signUpForm.style.display = 'none';
  loginForm.style.display = 'block';
  btnLogInTab.style.background = 'white';
  btnSignUpTab.style.background = '#cccccc';
  txtEmail_SI.value = "";
  txtPassword_SI.value = "";
  // txtEmail.focus();
}

//To be able to press enter on login
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

function verifyUser() {
  var user = firebase.auth().currentUser;

  if(verify) {
    // Set the provided username
    user.updateProfile({
      displayName: txtUsername.value
    }).then(function() {
      console.log('Username set to ' + txtUsername.value);
    }).catch(function(error) {
      console.log('Error setting username');
    });

    // Send verification email
    user.sendEmailVerification().then(function() {
      console.log('Email sent to ' + txtEmail_SU.value);
    }).catch(function(error) {
      console.log('Error sending email');
    });
    verify = false;
  }

}

//Sign in
btnSignIn.addEventListener('click', e => {
  //Get email and pass
  const email = txtEmail_SI.value;
  const pass = txtPassword_SI.value;

  //Sign in
  var promise = auth.signInWithEmailAndPassword(email, pass).then(function(user) {
    // user signed in
    // modalLogin.style.display = 'none';
    // mainBody.style.display = 'block';
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.');
    } else {
      alert('The email address is not valid.');
    }
    console.log(error);
  });
});

//Sign up
btnSignUp.addEventListener('click', e => {

  //Get email and pass
  const email = txtEmail_SU.value;
  const pass = txtPassword_SU.value;

  verify = true;

  //Sign up
  var promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));

});

//Real time listener
firebase.auth().onAuthStateChanged(function(checkUser) {
  var user = firebase.auth().currentUser;
  var data = checkUser.providerData;

  if (checkUser) {
    verifyUser();
    readTasks();
    if (checkUser.emailVerified || checkUser.providerData[0].providerId == 'facebook.com') {
      writeUser(user.displayName, user.uid, user.email);
      modalLogin.style.display = 'none';
      mainBody.style.display = 'block';
    }
    else {
      //firebase.auth().signOut();
      displayLogin();
    }
    console.log('logged in');
    console.log(data);
    // console.log(providerId[0].);
  } else {
    displayLogin();
    console.log('logged out');
    console.log(data);
  }
});

//Logout
btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();
  modalLogin.style.display = 'block';
  mainBody.style.display = 'none';
  txtEmail_SI.value = "";
  // txtEmail.focus();
  txtPassword_SI.value = "";
});

btnGoogle.addEventListener('click', e => {
  var  provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    'login_hint': 'user@example.com'
  });
  auth.signInWithRedirect(provider);

  firebase.auth().getRedirectResult().then(function(result) {
    var user = result.user;
    console.log(user);

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    console.log("Error: " + errorCode +" " + errorMessage + " " + email + credential);
  });
});

btnFacebook.addEventListener('click', e => {
  var provider = new firebase.auth.FacebookAuthProvider();
  fbBool = true;
  firebase.auth().signInWithRedirect(provider);

  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // ...
    }
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // Show errors
    console.log("Error: " + errorCode +" " + errorMessage + " " + email + credential);
  });

});
