function search(){
	var search = document.querySelector("input[name=search]");
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			var res = xmlhttp.responseText;
			if(res=="yes"){
				if(confirm("Do you wish to add the user '"+search.value+"' to your friends?")){
					request(search.value);
				}
			}else{
				alert("Insert a valid username or e-mail!");
			}
			
		}
	}
	xmlhttp.open("GET","requests_handler.php?action=search&search="+search.value,true);
	xmlhttp.send();
}
	
function request(search){
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			var res = xmlhttp.responseText;
			if(res!="no"){
				alert("A request has been sent!");
			}else{
				location.reload();
			}
		}
	}
	xmlhttp.open("GET","requests_handler.php?action=request&search="+search,true);
	xmlhttp.send();
}

function friendsfiles(friend){
	document.getElementById("folders").style.display = "block";
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			var res = xmlhttp.responseText;
			document.getElementById("files").innerHTML = res;
		}
	}
	xmlhttp.open("GET","../php_files/data_handling/file_handler.php?action=loadfriendfile&path="+friend+"/public"+"&data=null",false);
	xmlhttp.send();
}

//it opens the file of friend's public folder
//and posts it at the home.php
function chooseFFile(path){ //../users/user2/public/meta-dataaaa.json
	document.getElementById("folders").style.display="none";
	var file = new XMLHttpRequest();
    file.open("GET", path, false);
    file.onreadystatechange = function (){
        if(file.readyState === 4){
			var allText = file.responseText;
			if(path.includes(".json")){
				localStorage.JSONobj = allText;
				window.location.href = "home.php";
			}else if(path.includes(".csv")){
				//split each row of csv file
				localStorage.csv = allText;
				window.location.href = "home.php";
			}else{
				alert("Wrong type!");
				return;
			}
		}
    }
    file.send(null);
}
