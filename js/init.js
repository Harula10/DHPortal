window.onload = function(){
	if(document.getElementById("login")==null){
		mainpage();
	}
}

function register(){
	var data = document.getElementsByClassName("data");
	if (data[0].value == "" || data[1].value=="") {
        alert("You have to complete all the fields!");
		return;
    }else{ 
		var	xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4){
				var res = xmlhttp.responseText;
				alert(res);
				if(res=="You successfully signed up!"){
					document.getElementById("login").style.display = "none";
					mainpage();
				}else{
					return;
				}
			}
		}
		xmlhttp.open("GET","others/user.php?action=insert&email="+data[0].value+"&password="+data[1].value,true);
		xmlhttp.send();
	}
}

function login(){
	var data = document.getElementsByClassName("data");
	if (data[0].value == "" || data[1].value=="") {
        alert("Insert an email or a password!");
		return;
    }else{ 
		var	xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4){
				var res = xmlhttp.responseText;
				alert(res);
				if(res=="Connected Successfully!"){
					document.getElementById("login").style.display = "none";
					mainpage();
				}
			}
		}
		xmlhttp.open("GET","others/user.php?action=session&email="+data[0].value+"&password="+data[1].value,true);
		xmlhttp.send();
	}
}

function mainpage(){
	document.getElementById("elements").style.filter = "none";
	document.getElementById("logout").style.visibility = "visible";
	
	var x = document.querySelectorAll(".field_buttons");
	x[0].addEventListener("click",resetG);
	x[1].addEventListener("click",deleteG);
	x[2].addEventListener("click",saveG);
	x[3].addEventListener("click",resetV);
	x[4].addEventListener("click",deleteV);
	x[5].addEventListener("click",saveV);
	
	var y = document.querySelectorAll(".navlink");
	y[0].addEventListener("click",uploadJSON);
	y[1].addEventListener("click",downloadJSON);
	y[2].addEventListener("click",uploadCSV);
	
	var li = document.querySelectorAll("#varbar > ul > li");
	for(var i = 0; i < li.length; i++){
		li[i].addEventListener("click",select_tab);
	}
	initializeSVG();
}