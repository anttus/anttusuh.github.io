const auth = firebase.auth();

// auth.signInWithEmailAndPassword(email, pass);
// auth.createUserWithEmailAndPassword(email, pass);
// auth.onAuthStateChanged(firebaseUser => {});

const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogIn = document.getElementById('btnLogIn');
const btnClose = document.getElementById('btnClose');
const btnSignIn = document.getElementById('btnSignIn');
// const btnCancel = document.getElementById('btnCancel');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnSignOut');
const modalLogin = document.getElementById('modalLogin');
const mainBody = document.getElementById('mainBody');

// btnLogIn.addEventListener('click', e => {
//   modalLogin.style.display = 'block';
// });

// btnClose.addEventListener('click', e => {
//   btnClose.style.display = 'none';
// });

btnSignIn.addEventListener('click', e => {
  //Get email and pass
  //TO DO: CHECK FOR REAL EMAIL
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  //Sign in
  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
  modalLogin.style.display = 'none';
  mainBody.style.display = 'initial';
});

// btnCancel.addEventListener('click', e => {
//   modalLogin.style.display = 'none';
// });

// btnSignUp.addEventListener('click', e => {
//   //Get email and pass
   //TO DO: CHECK FOR REAL EMAIL
//   const email = txtEmail.value;
//   const pass = txtPassword.value;
//   const auth = firebase.auth();
//   //Sign in
//   const promise = auth.createUserWithEmailAndPassword(email, pass);
//   promise.catch(e => console.log(e.message));
// });

// btnLogout.addEventListener('click', e => {
//   firebase.auth().signOut();
// });

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

//Add a realtime listener
// firebase.auth().onAuthStateChanged(firebaseUser => {
//   if(firebaseUser) {
//     console.log(firebaseUser);
//     btnLogout.classList.remove('hide');
//
//   }
//   else {
//     console.log('not logged in');
//   }
// });

// window.onclick = function(event) {
//   if(event.target == modalLogin) {
//     modalLogin.style.display = 'none';
//   }
// }

window.onload = function() {
  modalLogin.style.display = 'block';
  mainBody.style.display = 'none';
}
