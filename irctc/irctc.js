
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
 //user data


  const auth = firebase.auth();
  var contactInfo = firebase.database().ref("information");


  var clockElement = document.getElementById('clock');

    function clock()
    {
        clockElement.textContent = new Date().toString().substring(3,24);
    }

    setInterval(clock, 1000);


  (function()
{

document.getElementById("login").addEventListener("click",login);
document.getElementById("signIn").addEventListener("click",signIn);
document.getElementById("logout").addEventListener("click",signOut);
document.getElementById("signup").addEventListener("click",show);
document.getElementById("submit").addEventListener("click",submitForm);
document.getElementById("close").addEventListener("click",close);
document.getElementById("close1").addEventListener("click",close1);
document.getElementById("findTrain").addEventListener("click",findTrain,false);
document.getElementById("trclose").addEventListener("click",cltrain,false);
document.getElementById("bookTickets").addEventListener("click",bookTickets,false);
document.getElementById("bkclose").addEventListener("click",bkclose,false);
document.getElementById("bookNow").addEventListener("click",bookNow,false);
document.getElementById("pay").addEventListener("click",pay,false);
document.getElementById("paymentClose").addEventListener("click",payClose,false);
document.getElementById("ticketClose").addEventListener("click",refresh,false);
document.getElementById("tickets").addEventListener("click",myTickets,false);
document.getElementById("closeTicket").addEventListener("click",closeTickets,false);
document.getElementById("trainSearch").addEventListener("click",searchTickets,false);
document.getElementById("tktClose").addEventListener("click",refresh,false);
document.getElementById("cancelBtn").addEventListener("click",cancelTrain,false);
document.getElementById("cancelTrainClose").addEventListener("click",refresh,false);
document.getElementById("cancelTrainSearch").addEventListener("click",cancelTrainSearch,false);
var Email;
var Dte;
var TrainNumber;
var Name;
var Price;
var UniqueNumber;
var Seat;
var Clss;
var totalSeat;
var contactInfo = firebase.database().ref("information");
}

)();

function myTickets()
{
    document.getElementById("myTickets").style.display="block";
}


function refresh()
{
    location.reload();
}


function payClose()
{
    document.getElementById("paymentWindow").style.display="none";
}

function bkclose()
{
    document.getElementById("bkPortal").style.display="none";
}
function bookTickets()
{
    document.getElementById("bkPortal").style.display="block";
}
function cltrain()
{
   document.getElementById("booking").style.display="none";

}
function close()
{
document.getElementById("signupForm").style.display="none";
}
function close1()
{
document.getElementById("login-box").style.display="none";
}

function show()
{
document.getElementById("signupForm").style.display="block";
}

function closeTickets()
{
    document.getElementById("myTickets").style.display="none";
}

  function signUp()
  {
      var email = document.getElementById("mail");
      var password = document.getElementById("pass");
      var name=document.getElementById("name").value;
      var number =document.getElementById("number").value;
      var gender=document.getElementById("gender").value;
      var dob = document.getElementById("dat").value;
      console.log(name+","+email+","+number+","+gender+","+dob);
      const promise = auth.createUserWithEmailAndPassword(email.value,password.value);
                 promise.catch(e=>alert(e.message));

  }

  function signIn()
  {
      var email = document.getElementById("email");
      var password = document.getElementById("password");
      const promise = auth.signInWithEmailAndPassword(email.value,password.value);
      promise.catch(e=>alert(e.message));
  }

  function signOut()
  {
      document.getElementById("welcome").innerHTML="";
      auth.signOut();
      document.getElementById("box").style.display="none";
      location.reload();
  }
var g;
  firebase.auth().onAuthStateChanged(function(user) {
  if (user)
  {
            g=user.email;
            Email=user.email;
            document.getElementById("box").style.display="block";
            document.getElementById("login-box").style.display="none";
            users();
           // document.getElementById("welcome").innerHTML="Welcome "+user.password;
           // document.getElementById("login-box").style.display="none";

  }
  else
  {
            document.getElementById("box").style.display="none";
  }
});


function login()
{
        document.getElementById("login-box").style.display="block";
}








function submitForm(e)
{
    e.preventDefault();
    var name=document.getElementById("name").value;
    var email=document.getElementById("mail").value;
    var number =document.getElementById("number").value;
    var gender=document.getElementById("gender").value;
    var dob = document.getElementById("dat").value;
    var d1 = new Date(dob);
    var d = new Date();
    var k = d.getTime()-d1.getTime();//used getTime method to get period in milliseconds
    var g = k/(1000*3600*24);
    g=g/365;
    if(g>=18)
    {
             console.log(name+","+email+","+number+","+gender+","+dob);
            //saveContactInfo(name,email,number,gender,dob);

            var re=firebase.database().ref("information");
            re.on("value",getdat,errorr);
            function getdat(data)
            {

                    var info=data.val();
                    //console.log(info);
                    var keys=Object.keys(info);
                    //console.log(keys);
                    var boo = false;
                    for(var i =0; i<keys.length;i++)
                    {
                        var k = keys[i];
                        if(email==info[k].email)
                        {
                            console.log("true")
                           boo=true;
                        }
                        else
                        {
                            continue;
                        }
                    }
                    if(boo==false)
                    {
                      signUp();
                      saveContactInfo(name,email,number,gender,dob);
                      location.reload();
                    }
            }
             function errorr(err)
                {
                    console.log(err)
                }
    }
    else
    {
        alert("too young to have an account");
    }

}

function saveContactInfo(name,email,number,gender,dob)
{
    var newContactInfo=contactInfo.push();

    newContactInfo.set({
    name:name,
    email:email,
    number:number,
    gender:gender,
    dob:dob,
});
}
function users()
{
    var ref=firebase.database().ref("information");
    ref.on("value",getData,error);
    function getData(data)
    {
            var info=data.val();
            //console.log(info);
            var keys=Object.keys(info);
            //console.log(keys);
            for(var i =0; i<keys.length;i++)
            {
            //console.log(g);
                var k = keys[i];
                if(g==info[k].email)
                {
                    //console.log("welcome "+info[k].name);
                    document.getElementById("welcome").innerHTML="Welcome "+info[k].name;
                    Name=info[k].name;
                }
                else
                {
                    continue;
                }
            }
        }

        function error(err)
        {
            console.log(err)
        }
}

function displayBooking(array)
{
    document.getElementById("booking").style.display="block";

}
function findTrain()
{
   var from = document.getElementById("from").value;
   from=from.toLowerCase();
   var to = document.getElementById("to").value;
   to=to.toLowerCase();
   console.log(from,to);
   if(isNaN(from) && isNaN(to))
   {
       var cls= document.getElementById("train").value;
       //console.log(from,to,cls);
       var date = document.getElementById("dt").value;
       Dte=date;
       var get = firebase.database().ref("trainRec/"+date);
       get.on("value",getdata,error);
       function getdata(data)
       {
            var d=data.val();
            if(d==null)
            {
                alert("No Trains Found");
            }
            else
            {
                var keys=Object.keys(d);
                var str="";
                var bool=false;

                //console.log(keys);
                for(var i =0;i<keys.length;i++)
                {
                    var k = keys[i];
                    var j = match(cls);
                    var f = d[k].From;
                    f=f.toLowerCase();

                    var t = d[k].To;
                    t=t.toLowerCase();
                    console.log(f,t);
                    if(from==f && to==t && d[k][cls]>0 && d[k].Status!="Cancel")
                    {
                        bool=true;

                        str= "\nTrain no: "+d[k].TrainId+" "+"Arrival: "+d[k].Arrival+" "+"Departure: "+d[k].Departure+" "+"Ticket Price: "+d[k][j]+"\n";


                    }
                    else
                    {
                        continue;
                    }
                }
                if(bool==false)
                {
                    alert("no trains available");
                }
                else
                {
                    document.getElementById("span").innerText=str;
                    document.getElementById("booking").style.display="block";

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
        alert("Enter a String");
   }

}

function match(cls)
{
    switch(cls)
    {
        case "ACount1":
        {
            var k = "APrice1";
            return k;
            break;
        }
        case "ACount2":
        {
            var k = "APrice2";
            return k;
            break;
        }
        case "GCount":
        {
            var k = "GPrice";
            return k;
            break;
        }
    }
}

function bookNow()
{
      document.getElementById("findTrain").removeEventListener("click",findTrain,false);
      //document.getElementById("bkPortal").style.display="none";
      document.getElementById("span").innerText="";
      var trNum=document.getElementById("bookingTrainNumber").value;
      TrainNumber=trNum;
      var seat=document.getElementById("seat").value;
      Seat=seat;
      var date=document.getElementById("dt").value;
      var cls= document.getElementById("train").value;
      Clss=cls;
      var ref = firebase.database().ref("trainRec/"+date);
      ref.on("value",getdata,error);
      function getdata(data)
      {
            var bool=false;
            var price;
            var info = data.val();
            var keys=Object.keys(info);
            for(var i=0; i<keys.length;i++)
            {
                var k =keys[i];
                var j = match(cls);
                var st=info[k][cls];
                totalSeat=st;

                if(trNum==info[k].TrainId && parseInt(st)>parseInt(seat))
                {
                         bool=true;
                        console.log(info[k][cls],seat);
                        Price=info[k][j]*seat;
                        console.log("Price "+Price);
                }
                else
                {
                    continue;
                }
            }
            if(bool==true)
            {
                document.getElementById("bkPortal").style.display="none";
                document.getElementById("booking").style.display="none";
                document.getElementById("paymentWindow").style.display="block";
                //document.getElementById("booking").style.display="none";
            }
            else
            {
                alert("few number of seats");
            }
      }
      function error(err)
      {
            console.log(err);
      }
}
function bookTicket()
{

    var ticket=firebase.database().ref("ticket/"+Dte);
    var newTicket=ticket.push();
    newTicket.set(
    {
    TrainId:TrainNumber,
    Email:Email,
    Name:Name,
    Date:Dte,
    Price:Price,
    Seats:Seat,
    Status:"Confirmed",
    Class:Clss,
    UniqueId:TrainNumber+Name,
    });
    console.log("ticket added");
    document.getElementById("box").style.display="block";
    document.getElementById("paymentWindow").style.display="none";
     //document.getElementById("findTrain").addEventListener("click",findTrain,false);
     document.getElementById("ticket").style.display="block";
     var inf = document.getElementById("ticketInfo");

     inf.innerText="TrainId :"+TrainNumber+"\n\n"+"Name :"+Name+"\n\n"+"Date :"+Dte+"\n\n"+"Seats :"+Seat+"\n\n"+"UniqueId :"+TrainNumber+Name;

    localStorage.setItem("date",Dte);
    localStorage.setItem("TrainNumber",TrainNumber);
    localStorage.setItem("Seat",Seat);
    localStorage.setItem("Class",Clss);
    localStorage.setItem("TotalSeat",totalSeat);

}



function pay()
{

    document.getElementById("bookNow").removeEventListener("click",bookNow,false);
    document.getElementById("box").style.display="none";
    var paymentMode = document.getElementById("payment").value;
    var cardNumber = document.getElementById("cardNo").value;
    var cvv = document.getElementById("cvv").value;
    var date = document.getElementById("expDate").value;
    var dat = date.substring(0,7);
    //console.log(paymentMode,cardNumber,cvv,dat);
    var ref = firebase.database().ref(paymentMode+"/");
    ref.on("value",getData,error);

    function getData(data)
    {
        var kk;
        var info = data.val();
        var keys = Object.keys(info);
        var bool = false;
        //console.log(keys);
        for(var i = 0;i<keys.length;i++)
        {
            var k = keys[i];
            //console.log(info[k].number,info[k].cvv,info[k].date);
            if(info[k].number==cardNumber && info[k].cvv==cvv && info[k].date==dat)
            {
                console.log("hello");
                bool = true;
                kk=k;
            }
            else
            {
                continue;
            }
        }

        if(bool==true)
        {
            //alert("payment successful");
           bookTicket();

        }
        else
        {
            alert("invalid credentials");
        }
    }

    function error(err)
    {
        console.log(err);
    }
}

function searchTickets()
{

    var date = document.getElementById("da_te").value;
    //console.log(train_id,date);
    var ref = firebase.database().ref("ticket/"+date);
    ref.on("value",getdata,error);
    function getdata(data)
    {
        var info=data.val();
        console.log(info);
        console.log(Email);
        var keys=Object.keys(info);
        var inf=document.getElementById("ticketContent");
         inf.innerText="";
        var str="";
        var bool=false;
        document.getElementById("myTickets").style.display="none";
        document.getElementById("displayTickets").style.display="block";
        for(var i=0;i<keys.length;i++)
        {
            var k = keys[i];
            if(Email==info[k].Email)
            {
                bool=true;
                str+="Train No :"+info[k].TrainId+" "+"Date :"+info[k].Date+" "+"Price :"+info[k].Price+" "+"Tickets :"+info[k].Seats+"\n\n";

            }
        }
        if(bool==true)
        {
            console.log(str);
            inf.innerText=str;
        }
        else
        {
            console.log("No Records Found..!");
            inf.innerText="No Records Found..!"
        }

    }
    function error(err)
    {
        console.log(err);
    }
}
function cancelTrain()
{
    document.getElementById("cnclTrainDisplay").style.display="block";

}

function cancelTrainSearch()
{
    var trainId=document.getElementById("cnclTrainId").value;
    var date = document.getElementById("cnclDate").value;
    //console.log(trainId,date);
    if(trainId!="" && date!="")
    {
    var ref = firebase.database().ref("ticket/"+date+"/");
    ref.on("value",getdata,error);
    function getdata(data)
    {
        var info = data.val();
        console.log(info);
        if(info==null)
        {
        console.log();

        }
       else
       {
        var keys=Object.keys(info);
        for(var i=0;i<keys.length;i++)
        {
            var k = keys[i];
            if(trainId==info[k].TrainId)
            {
                var seat=info[k].Seats;
                var clss=info[k].Class;
                var rec = firebase.database().ref("ticket/"+date+"/"+k);
                rec.remove();
                console.log(seat,clss);
                var re = firebase.database().ref("trainRec/"+date+"/");
                re.on("value",getdata,error);
                function getdata(data)
                {
                    var inf = data.val();
                    var key=Object.keys(inf);
                    for(var i =0;i<key.length;i++)
                    {
                        var kk = key[i];
                        console.log(inf[kk]);
                        if(trainId==inf[kk].TrainId)
                        {
                             var Seat=inf[kk][clss]+parseInt(seat);

                            localStorage.setItem("c_Seat",Seat);
                            localStorage.setItem("c_seat",seat);
                            localStorage.setItem("c_clss",clss);
                            localStorage.setItem("c_date",date);
                            localStorage.setItem("c_kk",kk);



                        }
                    }
                }

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
        alert("invalid format");
    }

}









