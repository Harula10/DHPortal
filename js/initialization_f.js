function register(){
	var data = document.getElementsByClassName("data");
	if (data[0].value == "" ||data[1].value == "" || data[2].value=="") {
        alert("You have to complete all the fields!");
		return;
    }else{ 
		var	xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4){
				var res = xmlhttp.responseText;
				alert(res);
				if(res=="You successfully signed up!"){
					window.location.replace("php_files/home.php");
				}else{
					return;
				}
			}
		}
		xmlhttp.open("GET","php_files/data_handling/users_handler.php?action=insert&username="+data[0].value+"&email="+data[1].value+"&password="+data[2].value,true);
		xmlhttp.send();
	}
}

function login(){
	var data = document.getElementsByClassName("data");
	if (data[0].value == "" ||data[1].value == "" || data[2].value=="") {
        alert("Insert an email or a password!");
		return;
    }else{ 
		var	xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4){
				var res = xmlhttp.responseText;
				alert(res);
				if(res=="Connected Successfully!"){
					window.location.replace("php_files/home.php");
				}
			}
		}
		xmlhttp.open("GET","php_files/data_handling/users_handler.php?action=session&username="+data[0].value+"&email="+data[1].value+"&password="+data[2].value,true);
		xmlhttp.send();
	}
}