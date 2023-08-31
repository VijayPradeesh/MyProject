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



  document.getElementById("submit").addEventListener("click",submitTrainrec,false);
  (function()
  {
      document.getElementById("signIn").addEventListener("click",signIn,false);
      document.getElementById("logout").addEventListener("click",signOut,false);
      document.getElementById("addTrain").addEventListener("click",addTrain,false);
      document.getElementById("cancelTrain").addEventListener("click",cancelTrain,false);
      document.getElementById("close").addEventListener("click",close,false);
      document.getElementById("close2").addEventListener("click",close2,false);
      document.getElementById("updateTrain").addEventListener("click",update,false);
      document.getElementById("Uclose").addEventListener("click",uClose,false);
      document.getElementById("Update").addEventListener("click",updateTrain,false);
      document.getElementById("cancel").addEventListener("click",cancelTr,false);

  }
  )();

   function signIn()
  {
      var email = document.getElementById("email");
      var password = document.getElementById("password");

      const promise = auth.signInWithEmailAndPassword(email.value,password.value);
      promise.catch(e=>alert(e.message));
    //console.log(email.value,password.value);
    document.getElementById("email").value="";
    document.getElementById("password").value="";


  }
 firebase.auth().onAuthStateChanged(function(user) {
  if (user)
  {
    document.getElementById("options").style.display="block";
    document.getElementById("login-box").style.display="none";

  }
  else
  {
    document.getElementById("login-box").style.display="block";
  }
});

 function signOut()
  {
     auth.signOut();
     location.reload();
  }

function addTrain()
{
    document.getElementById("adtrform").style.display="block";
}

function cancelTrain()
{
    document.getElementById("cncltrform").style.display="block";
}

function close()
{
    document.getElementById("adtrform").style.display="none";
}

function close2()
{
    document.getElementById("cncltrform").style.display="none";
}

function update()
{
    document.getElementById("Uadtrform").style.display="block";
}

function check(a)
{
    var f = true;
    for(var i=0;i<a.length;i++)
    {
        if(a[i].match(/^[A-Za-z]+$/))
        {
            continue;
        }
        else
        {
            f=false;
        }
    }
    if(f==true)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function submitTrainrec()
{
    var date = document.getElementById("dat").value
    var trainId=document.getElementById("trainId").value;
    var From=document.getElementById("from").value;
    var To=document.getElementById("to").value;
    var DeptTime=document.getElementById("deptTime").value;
    var ArrivalTime=document.getElementById("arrivalTime").value;
    var ACount2=document.getElementById("2aCount").value;
    var APrice2=document.getElementById("2aPrice").value;
    var A1Count=document.getElementById("1aCount").value;
    var A1Price=document.getElementById("1aPrice").value;
    var gCount=document.getElementById("gCount").value;
    var gPrice=document.getElementById("gPrice").value;
    var c = check(From);
    var d = check(To);
    var c1 = chck(From);
    var d1=chck(To);
    var dt=chck(DeptTime);
    var at=chck(ArrivalTime);
    var ac2=chck(ACount2);
    var ap2=chck(APrice2);
    var ac1=chck(A1Count);
    var ap1=chck(A1Price);
    var gc= chck(gCount);
    var gp =chck(gPrice);
    var da = chck(date);
    console.log(c,d,dt,at,ac2,ap2,ac1,ap1,gc,gp,da,c1,d1);
    if(c && d && dt && at && ac2 && ap2 && ac1 && ap1 && gc && gp && da && c1 && d1)
    {

    console.log(date,trainId,From,To,DeptTime,ArrivalTime,ACount2,APrice2,A1Count,A1Price,gCount,gPrice);
   console.log(A1Count);
   var re=firebase.database().ref('trainRec/'+date);
    re.on("value",getdat,errorr);
    function getdat(data)
    {

            var info=data.val();
            console.log(info);
            if(info==null)
            {
                saveContactInfo(date,trainId,From,To,DeptTime,ArrivalTime,ACount2,APrice2,A1Count,A1Price,gCount,gPrice);
                location.reload();
            }
            else
            {
                var keys=Object.keys(info);
                //console.log(keys);
                var boo = false;
                for(var i =0; i<keys.length;i++)
                {
                    var k = keys[i];
                    if(trainId==info[k].TrainId)
                    {
                       boo=true;
                    }

                    else
                    {
                        continue;
                    }
                }
                if(boo==false)
                {
                     saveContactInfo(date,trainId,From,To,DeptTime,ArrivalTime,ACount2,APrice2,A1Count,A1Price,gCount,gPrice);
                     location.reload();
                }
                else
                {
                    alert("train id already exists");
                }
          }


       document.getElementById("Uadtrform").style.display="none";
        }

        function errorr(err)
{
   console.log(err);
 }
    }
    else
    {
        alert("input format mismatch");
    }



}

function saveContactInfo(date,trainId,From,To,DeptTime,ArrivalTime,ACount2,APrice2,A1Count,A1Price,gCount,gPrice)
{
var dat=firebase.database().ref('trainRec/'+date);
var newdat=dat.push();
newdat.set({
TrainId:trainId,
From:From,
To:To,
Departure:DeptTime,
Arrival:ArrivalTime,
ACount2:ACount2,
APrice2:APrice2,
ACount1:A1Count,
APrice1:A1Price,
GCount:gCount,
GPrice:gPrice,
Status:"Active",
});

}

function uClose()
{
    document.getElementById("Uadtrform").style.display="none";
}

function chck(a)
{
    if(a.length>0)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function updateTrain()
{
    var date=document.getElementById("uDate").value;
    var da=chck(date);
    var trainId=document.getElementById("UtrainId").value;
    var tr=chck(trainId);
    var From=document.getElementById("Ufrom").value;
    var To=document.getElementById("Uto").value;
    var c = check(From);
    var d = check(To);
    var DeptTime=document.getElementById("UdeptTime").value;
    var ArrivalTime=document.getElementById("UarrivalTime").value;
    var ACount2=document.getElementById("U2aCount").value;
    var APrice2=document.getElementById("U2aPrice").value;
    var A1Count=document.getElementById("U1aCount").value;
    var A1Price=document.getElementById("U1aPrice").value;
    var gCount=document.getElementById("UgCount").value;
    var gPrice=document.getElementById("UgPrice").value;
    var dt=chck(DeptTime);
    var at=chck(ArrivalTime);
    var ac2=chck(ACount2);
    var ap2=chck(APrice2);
    var ac1=chck(A1Count);
    var ap1=chck(A1Price);
    var gc= chck(gCount);
    var gp =chck(gPrice);
    var c1 = chck(From);
    var d1=chck(To);
    console.log(c,d,dt,at,ac2,ap2,ac1,ap1,gc,gp,da,c1,d1);
    if(c && d && dt && at && ac2 && ap2 && ac1 && ap1 && gc && gp && da && c1 && d1)
    {
                console.log("hi");
            //updateData(trainId,From,To,DeptTime,ArrivalTime,ACount2,APrice2,A1Count,A1Price,gCount,gPrice);
            var ref = firebase.database().ref('trainRec/'+date);
            ref.on("value",getdata,error);
            function getdata(data)
            {
                var info = data.val();
                var keys=Object.keys(info);
                if(info==null)
                {
                    alert("no such record found");
                    location.reload();
                }
                else
                {
                    for(var i =0;i<keys.length;i++)
                    {
                        var k = keys[i];
                        if(info[k].TrainId==trainId)
                        {
                            updateData(date,trainId,From,To,DeptTime,ArrivalTime,ACount2,APrice2,A1Count,A1Price,gCount,gPrice,k);
                            location.reload();
                        }
                        else
                        {
                            continue;
                        }
                    }
                }


            }
            function error(err)
            {
                console.log(err);
            }

    }

    else
    {
        alert("input format mismatch");
    }

}

function updateData(date,trainId,From,To,DeptTime,ArrivalTime,ACount2,APrice2,A1Count,A1Price,gCount,gPrice,k)
{
    var trainrec = firebase.database().ref('trainRec/'+date+"/"+k);
    trainrec.update({
    TrainId:trainId,
    From:From,
    To:To,
    Departure:DeptTime,
    Arrival:ArrivalTime,
    ACount2:ACount2,
    APrice2:APrice2,
    ACount1:A1Count,
    APrice1:A1Price,
    GCount:gCount,
    GPrice:gPrice,
    Status:"Active",
});
}
function cancelTr()
{

    var trainId=document.getElementById("trainNo").value;
    var date= document.getElementById("cnclDate").value;
    var tr = chck(trainId);
    var dt = chck(date);
    if(tr && dt)
    {
        var ref = firebase.database().ref('trainRec/'+date);
    ref.on("value",getdata,error);
    function getdata(data)
    {
        var info = data.val();
        var keys=Object.keys(info);
        if(info==null)
        {
            alert("no such record found");
        }
        else
        {
            for(var i =0;i<keys.length;i++)
            {
                var k = keys[i];
                if(info[k].TrainId==trainId)
                {
                     updateStatus(trainId,date,k);
                     location.reload();
                }
                else
                {
                    continue;
                }
            }
        }


    }
    function error(err)
    {
        console.log(err);
    }

   //updateStatus(trainId,date,k);
   document.getElementById("cncltrform").style.display="none";
   location.reload();


    }

    else
    {
        alert("input format mismatch");
    }



}
function updateStatus(trainId,date,k)
{
    var trainrec = firebase.database().ref('trainRec/'+date+"/"+k);
    trainrec.update({
    Status:"Cancel",
});
}

var clockElement = document.getElementById('clock');

    function clock()
    {
        clockElement.textContent = new Date().toString().substring(3,24);
    }

setInterval(clock, 1000);