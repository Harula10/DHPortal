function show_requests(){
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			var res = xmlhttp.responseText;
			if(res){
				document.getElementById("files").innerHTML = res;
				document.getElementById("folders").style.display="block";
			}else{
				alert("There are no requests.");
				location.reload();
			}
		}
	}
	xmlhttp.open("GET","../php_files/data_handling/requests_handler.php?action=show&search=",true);
	xmlhttp.send();
}

function search(flag){
	var search = document.querySelector("input[name=search]");
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			var res = xmlhttp.responseText;
			if(res=="yes"){
				if(confirm("Do you wish to add the user '"+search.value+"' to your friends?")){
					request(search.value,flag);
				}
			}else{
				alert("The user with that username or e-mail does not exist.");
			}
			
		}
	}
	xmlhttp.open("GET","../php_files/data_handling/requests_handler.php?action=search&search="+search.value,true);
	xmlhttp.send();
}

//flag is true: the user sent/deleted a requests to/from another user 
//flag is false: the user accepted/declined another user
function request(search,flag){
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			var res = xmlhttp.responseText;
			if(res!="no"){
				if(flag){
					alert("A request has been sent!");
					location.reload();
				}else{
					show_requests();
				}
			}else{
				alert("You have already sent a request to that user.");
				location.reload();
			}
		}
	}
	xmlhttp.open("GET","../php_files/data_handling/requests_handler.php?action=request&search="+search,true);
	xmlhttp.send();
}

function friendsfiles(friend){
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			var res = xmlhttp.responseText;
			document.getElementById("files").innerHTML = res;
			document.getElementById("folders").style.display = "block";
		}
	}
	xmlhttp.open("GET","../php_files/data_handling/file_handler.php?action=loadfriendfile&path="+friend+"&data=null",false);
	xmlhttp.send();
}

function unfriend(friend,flag){
	var conf;
	if(flag){
		conf = confirm("Are you sure you want to remove user '"+friend+"' from your community?");
	}else{
		conf = true;
	}
	if(conf){
		var	xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4){
				var res = xmlhttp.responseText;
				if(flag){
					alert(res);
					location.reload();
				}else{
					show_requests();
				}
			}
		}
		xmlhttp.open("GET","../php_files/data_handling/requests_handler.php?action=unfriend&search="+friend,true);
		xmlhttp.send();
	}	
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
				localStorage.load_fromFriend = true;
				window.location.href = "home.php";
			}else if(path.includes(".csv")){
				localStorage.csv = allText;
				if(confirm("Add these data to Harmonization Page?")){
					//split each row of csv file
					window.location.href = "harmonization.php";
				}else{
					window.location.href = "home.php";
				}
			}else{
				alert("Wrong type!");
				return;
			}
		}
    }
    file.send(null);
}

function clearStorage(){
	localStorage.clear();
}