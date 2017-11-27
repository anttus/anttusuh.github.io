const auth = firebase.auth();

// auth.signInWithEmailAndPassword(email, pass);
// auth.createUserWithEmailAndPassword(email, pass);
// auth.onAuthStateChanged(firebaseUser => {});
const modalLogin = document.getElementById('modalLogin');
const btnLogInTab = document.getElementById('btnLogInTab');
const btnSignUpTab = document.getElementById('btnSignUpTab')

const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');

const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');

const btnSignIn = document.getElementById('btnSignIn');

const btnSignUp = document.getElementById('btnSignUp');
const btnFbSignUp = document.getElementById('btnFbSignUp');
const btnGSignUp = document.getElementById('btnGSignUp');

const mainBody = document.getElementById('mainBody');

btnSignUpTab.addEventListener('click', e=> {
  loginForm.style.display = 'none';
  signUpForm.style.display = 'block';
  btnLogInTab.style.background = '#cccccc';
  btnSignUpTab.style.background = 'white';
});

btnLogInTab.addEventListener('click', e => {
  signUpForm.style.display = 'none';
  loginForm.style.display = 'block';
  btnLogInTab.style.background = 'white';
  btnSignUpTab.style.background = '#cccccc';
});

mainBody.style.display = 'none';

function verifyUser() {
  var user = firebase.auth().currentUser;

  if (!user.emailVerified) {
    user.sendEmailVerification().then(function() {
      console.log('email sent');
    }).catch(function(error) {
      console.log('error');
    });

    user.updateProfile({
      displayName: txtUsername.value
    }).then(function() {
      console.log('username set');
    }).catch(function(error) {
      console.log('username error');
    });
  }
}

//Sign in
btnSignIn.addEventListener('click', e => {
  //Get email and pass
  //TO DO: CHECK FOR REAL EMAIL
  var email = txtEmail.value;
  var pass = txtPassword.value;

  //Sign in
  var promise = auth.signInWithEmailAndPassword(email, pass).then(function(user) {
    // user signed in

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
  //TO DO: CHECK FOR REAL EMAIL
  var email = txtEmail.value;
  var pass = txtPassword.value;

  //Sign up
  var promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));

});

//Real time listener
firebase.auth().onAuthStateChanged(function(checkUser) {
  if (checkUser) {
    readTasks();
    verifyUser();
    modalLogin.style.display = 'none';
    mainBody.style.display = 'initial';
    console.log('logged in');
  } else {
    modalLogin.style.display = 'block';
    mainBody.style.display = 'none';
    signUpForm.style.display = 'none';
    btnSignUpTab.style.background = '#cccccc';
    console.log('logged out');
  }
});

//Logout
btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();
  modalLogin.style.display = 'block';
  mainBody.style.display = 'none';
  txtEmail.innerHTML = "";
});

// btnGoogle.addEventListener('click', e => {
//   var  provider = new firebase.auth.GoogleAuthProvider();
//   provider.setCustomParameters({
//     'login_hint': 'user@example.com'
//   });
//   auth.signInWithRedirect(provider);
//
//   firebase.auth().getRedirectResult().then(function(result) {
//     var user = result.user;
//     console.log(user);
//
//   }).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//     // ...
//     console.log("Error: " + errorCode +" " + errorMessage + " " + email + credential);
//   });
// });
