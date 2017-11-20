(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCqiuxQhyWc3voH49Zh2j3ze83s73DHaXk",
    authDomain: "tiskijukka-1.firebaseapp.com",
    databaseURL: "https://tiskijukka-1.firebaseio.com",
    projectId: "tiskijukka-1",
    storageBucket: "tiskijukka-1.appspot.com",
    messagingSenderId: "591860487071"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

  //DATABASE SAMPLE
  //Get elements
  const preObject = document.getElementById('object');

  //Create references
  const dbRefObject = database.ref().child('object');

  //Sync object changes
  dbRefObject.on('value', snap => {
    console.log(snap.val());
    preObject.innerHTML = JSON.stringify(snap.val(), null, 3);
  });

}());
