function changecurrency()
{
    var fr = document.getElementById("from").value;
    var to = document.getElementById("tocur").value;
    if(isNaN(fr)||isNaN(to))

    //console.log(fr+" "+to);
    var xmlhttp = new XMLHttpRequest();
    var url="data.json";
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
    xmlhttp.onreadystatechange=function()
                                    {
                                       if((xmlhttp.readyState==4)&&(xmlhttp.status==200))//response is ready
                                       {
                                            var response = xmlhttp.responseText;
                                            var jObj=JSON.parse(response);
                                            var g=select(jObj,fr);
                                            var k = select(jObj,to);
                                            //console.log(g+","+k);
                                            var rat=evaluate(g,k);
                                            //console.log(rat);
                                            val(rat);
                                       }

                                    }

    function select(objct,fr)
    {
        switch(fr)
        {
            case("INR"):
            {
                return objct.INR;
                break;
            }
            case("USD"):
            {
                return objct.USD;
                break;
            }
            case("AUD"):
            {
                return objct.AUD;
                break;
            }
            case("BGN"):
            {
                return objct.BGN;
                break;
            }
            case("CAD"):
            {
                return objct.CAD;
                break;
            }
            case("CHF"):
            {
                return objct.CHF;
                break;
            }
            case("DKK"):
            {
                return objct.DKK;
                break;
            }
            case("GBP"):
            {
                return objct.GBP;
                break;
            }
            case("GLS"):
            {
                return objct.GLS;
                break;
            }
            case("ILS"):
            {
                return objct.ILS;
                break;
            }
            case("JPY"):
            {
                return objct.JPY;
                break;
            }
            case("PHP"):
            {
                return objct.PHP;
                break;
            }
            case("RUB"):
            {
                return objct.RUB;
                break;
            }
            case("AED"):
            {
                return objct.AED;
                break
            }

        }
    }
    function evaluate(g,k)
    {
        var m = 1/g;
        var a = 1/k;
        var j =m/a;
        //console.log(m+","+a+","+j);
        return j;
    }

    function val(rat)
    {
        var a=document.getElementById("fr").value;
        if(isNaN(a))
        {
            alert("invalid");
        }
        else
        {
            var res=a*rat;
            document.getElementById("to").value=res.toFixed(2);
        }

    }

}