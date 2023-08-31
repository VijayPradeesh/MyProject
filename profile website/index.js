  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBdWWl1qLd0nwV5VrUO18KJFqG737Cx6iE",
    authDomain: "profile-d8341.firebaseapp.com",
    databaseURL: "https://profile-d8341.firebaseio.com",
    projectId: "profile-d8341",
    storageBucket: "profile-d8341.appspot.com",
    messagingSenderId: "528035766629",
    appId: "1:528035766629:web:55a75363e3ea4ed0d8818c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();

  function signUp()
  {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  const promise = auth.createUserWithEmailAndPassword(email.value,password.value);
  promise.catch(e=>alert(e.message));

  alert("Signed Up");
  }

  function signIn()
  {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  const promise = auth.signInWithEmailAndPassword(email.value,password.value);
  promise.catch(e=>alert(e.message));

  //alert("Signed In"+ email.value);
  }

  function signOut()
  {
  auth.signOut();
  //alert("Signed Out");
  }

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("loginblock").style.display="none";
    document.getElementById("homeblock").style.display="block";

  } else {
    document.getElementById("loginblock").style.display="block";
    document.getElementById("homeblock").style.display="none";
  }
});
