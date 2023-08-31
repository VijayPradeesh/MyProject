window.onload=function()
        {
			var arr = [];
			
            document.onkeydown=
                    function(e)
                    {
						if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode == 16 || e.keyCode == 187 || e.keyCode == 8)) { 
						console.log(e.keyCode);
						return true;
						}
						else if(e.keyCode == 187) {
							solve();
						}
						else {
							console.log(e.keyCode);
                        return false;
						}
						
                    }

            document.getElementById("solve").addEventListener("click",solve,false);
            document.getElementById("clr").addEventListener("click",clr,false);
            document.getElementById("bsp").addEventListener("click",bsp,false);
        }
function ins(input)
{

    document.disp.inp.value=document.disp.inp.value+input;
}

function solve()
{
    try
        {
        var y=document.disp.inp.value; // empty string
        // y="";
        if(y)
            {
                document.disp.inp.value=eval(y);
            }
         else
         {
            alert("invalid");
         }
        }
    catch(err)
        {
            alert("Invalid format.");
        }
}
function clr()
{
    document.disp.inp.value="";
}
function bsp()
{
    var x = document.disp.inp.value;
    document.disp.inp.value=x.substring(0,x.length-1);
}