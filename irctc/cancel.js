
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

  var date=localStorage.getItem("c_date");
  var kk = localStorage.getItem("c_kk");
  var clss=localStorage.getItem("c_clss");
  var seat=localStorage.getItem("c_seat");
  var Seat=localStorage.getItem("c_Seat");

  console.log(date,kk,clss,seat,Seat);

                            var tt = firebase.database().ref("trainRec/"+date+"/"+kk);
                            if(clss="ACount1")
                            {
                                tt.update(
                                {
                                    ACount1:Seat,
                                }
                                );


                            }
                            else if(clss="ACount2")
                            {
                                tt.update(
                                {
                                    ACount2:Seat,
                                }
                                );


                            }
                            else if(clss="GCount")
                            {
                                tt.update(
                                {
                                    GCount:Seat,
                                }
                                );
                               ;

                            }
