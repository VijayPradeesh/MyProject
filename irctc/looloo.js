
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

   var date=localStorage.getItem("date");
    var trNum=localStorage.getItem("TrainNumber");
    var seat=localStorage.getItem("Seat");
    var cls=localStorage.getItem("Class");
    var totalSeat=localStorage.getItem("TotalSeat");

    console.log(date,trNum,seat,cls);

    var ref = firebase.database().ref("trainRec/"+date+"/");
    ref.on("value",getdata,error);
    function getdata(data)
    {
        var info = data.val();
        var keys = Object.keys(info);
        var bool=false;
        for(var i =0; i<keys.length;i++)
        {

            var k = keys[i];

            if(info[k].TrainId==trNum)
            {
                var s = totalSeat-seat;
                console.log(s);

                var rec = firebase.database().ref("trainRec/"+date+"/"+k);
                if(cls=="ACount1")
                {
                    bool=true;

                    rec.update(
                    {
                        ACount1:s,
                    }
                    );
                    break;
                }
                else if(cls=="ACount2")
                {
                    bool=true;
                    document.getElementById("pay").removeEventListener("click",pay,false);
                    rec.update(
                    {
                        ACount2:s,
                    }
                    );
                    break;

                }
                else if(cls=="GCount")
                {
                    bool=true;

                    rec.update(
                    {
                        GCount:s,
                    }
                    );
                    break;

                }


            }
            else
            {
                continue;
            }

        }
        if(bool==true)
        {
            alert("payment successful");
        }
    }
    function error(err)
    {
        console.log(err);
    }