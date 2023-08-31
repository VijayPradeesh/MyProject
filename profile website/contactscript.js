 var firebaseConfig = {
    apiKey: "AIzaSyCB78P0jgHLnjbdZ-H_-BnRBQEvFfMdIUs",
    authDomain: "feedback-6517b.firebaseapp.com",
    databaseURL: "https://feedback-6517b.firebaseio.com",
    projectId: "feedback-6517b",
    storageBucket: "feedback-6517b.appspot.com",
    messagingSenderId: "727599692821",
    appId: "1:727599692821:web:77bc8bea5a8d56f10d621c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var contactInfo = firebase.database().ref("information");

document.querySelector(".contact-form").addEventListener("submit",submitForm);

function submitForm(e)
{
e.preventDefault();
var name=document.getElementById("name").value;
var email=document.getElementById("email").value;
var message =document.getElementById("message").value
console.log(name,email,message);

saveContactInfo(name,email,message);
}
function saveContactInfo(name,email,message)
{
var newContactInfo=contactInfo.push();

newContactInfo.set({
name:name,
email:email,
message:message,
});

}



