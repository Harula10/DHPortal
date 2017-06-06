var to_match;
window.onload = function(){	
	initializeSVG(480);
	var y = document.querySelectorAll(".navlink");
	y[2].addEventListener("click",uploadCSV);
	y[3].addEventListener("click",showload);
	y[4].addEventListener("click",showshare);
	
	if(localStorage.JSONobj){
		JSONobj = JSON.parse(localStorage.JSONobj);
		draw();
	}
	
	if(localStorage.to_match_var){
		if(localStorage.variables){
			to_match = JSON.parse(localStorage.to_match_var);
			for (var i = 0; i < to_match.length; i++){
				initVar(to_match[i]);	
				load_options();	
				load_functions();
			}
		}
	}else{
		to_match = [];
	}
}

function uploadCSV(){
	event.preventDefault();
	document.getElementById("inputfilecsv").click();	
}

function showload(){	
	var dropdown = document.querySelectorAll(".dropdown-content");
	dropdown[0].style.display = "block";
}

function showshare(){
	var dropdown = document.querySelectorAll(".dropdown-content");
	dropdown[1].style.display = "block";
}

function hidemenu(d){
	var dropdown = document.querySelectorAll(".dropdown-content");
	dropdown[d].style.display = "none";
}

function loadData(folder){
	if(folder.includes(".json")){
		alert("Please choose a file with .csv extension!");
		return;
	}
	document.getElementById("folders").style.display = "block";
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			var res = xmlhttp.responseText;
			document.getElementById("files").innerHTML = res;
		}
	}
	xmlhttp.open("GET","../php_files/data_handling/file_handler.php?action=upload&path="+folder+"&data=null",true);
	xmlhttp.send();
}

function shareData(folder){
	var filename = prompt("Save as...");
	var data = encodeURIComponent(CSVtobeTransformed().trim());
	if (filename != null) {
		var	xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4){
				var res = xmlhttp.responseText;
				alert(res+"The file is saved with a .csv extension.");
			}
		}
		xmlhttp.open("GET","../php_files/data_handling/file_handler.php?action=sharecsv&path="+folder+"/"+filename+".csv"+"&data="+data,true);
		xmlhttp.send();
	}
}

var _func="";
function CSVtobeTransformed(){
	var table = document.querySelectorAll("#table");
	var str = "";
	var new_var,old_var,func;
	for (var i = 1, row; row = table[2].rows[i]; i++) {
		old_var = table[2].rows[i].cells[1].firstChild.value;
		new_var = table[2].rows[i].cells[0].innerHTML;
		func = table[2].rows[i].cells[3].firstChild.value;
		if(old_var!="none"){
			str = str + old_var +","+ new_var;
			//Transform function
			transform(func.trim());
			if(_func!=""){
				str = str +","+_func+"<br>";
			}else{
				str = str + "<br>";
			}
		}
	}
	return str;
}

function transform(_function){
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			var transformed_func = xmlhttp.responseText;
			setFunc(transformed_func);
		}
	}
	xmlhttp.open("GET","../php_files/data_handling/func_transform.php?&func="+encodeURIComponent(_function),false);
	xmlhttp.send();
}

function setFunc(_function){
	_func = _function;
}

function chooseFile(path){
	document.getElementById("folders").style.display="none";
	var file = new XMLHttpRequest();
    file.open("GET", path, false);
    file.onreadystatechange = function (){
        if(file.readyState === 4){
			var allText = file.responseText;
			if(path.includes(".csv")){
				//split each row of csv file
				rows = allText.split("\n");
				readCSV();
			}else{
				alert("Wrong type!");
			}
        }
    }
    file.send(null);
}


function getFile(){
	var files = document.getElementById(id).files;
	if (files.length <= 0) return;
	var fr = new FileReader();
	fr.onload = function() { 
		rows = fr.result.split("\n");
		readCSV();
		
	}
	fr.readAsText(files.item(0));
}

function readCSV(){
	for (var i = 1; i < rows.length-1; i++) {
		var cells = rows[i].split(";");
		if(cells[2].trim()!="Polynominal" && cells[2].trim()!="Binominal" && cells[2].trim()!="Real" ){
			alert("Please, upload a valid CSV!");
			return;
		}					
		var variable = {
			"code" : cells[0],
			"label" : cells[1],
			"type" : cells[2].trim(),
			"group" : "",
			"description" : cells[3],
			"methodology" : cells[4],
		};
		var_push(variable);
	}
	//variables to match are added-now set the options
	load_options();	
	load_functions()
}

function load_options(){
	//for each new variable set the options
	var variable = document.getElementsByClassName("match-with");
	for (var i = 0; i < variable.length; i++) {
		if(localStorage.variables){
			vars = [];
			vars = JSON.parse(localStorage.variables);
			for (var j = 0; j < vars.length; j++){
				add_option(variable[i],vars[j].code);
			}
		}
	}
}

function load_functions(){
	//for each new variable set the options
	var func = document.getElementsByClassName("functions");
	for (var i = 0; i < func.length; i++) {
		for (var j = 0; j < functionArray.length; j++){
			add_option(func[i],functionArray[j].name);
		}
	}
}

function fillTextArea(){
	var textarea,pos,newPos,val;
	for (var j = 0; j < functionArray.length; j++){
		if(this.value==functionArray[j].name){
			//add the function to where the cursor is pointing
			textarea = document.querySelector("textarea[id='"+this.id+"']");
			pos = textarea.selectionStart;
			newPos = pos + functionArray[j].func_name.length;
			val = textarea.value;
			textarea.value = val.slice(0, pos) + functionArray[j].func_name + val.slice(pos);
		}
	}
}

function var_push(data){
	var f = true;
	for (var i = 0; i < to_match.length; i++) { //if a variable already exists
		if (to_match[i].code == data.code) { //don't add it in array
			f = false;
		}
	}
	if(f){ //if it doesn't exists add it in array AND table
		to_match.push(data);
		localStorage.to_match_var = JSON.stringify(to_match);
		initVar(data);
	}
}

function initVar(data){
	document.getElementById("data").style.visibility = "hidden";
	var table = document.querySelectorAll("#table");	
	var tr = document.createElement("tr");	//<td>to_matched variable code</td>
	var td = document.createElement("td");
	td.innerHTML = data.code;
	tr.appendChild(td);	
	
	td = document.createElement("td");
	var select = document.createElement("select");
	select.setAttribute("class","match-with");
	var option = document.createElement("option");
	option.setAttribute("value","none");
	option.innerHTML="Select none...";
	select.appendChild(option);
	td.appendChild(select);
	tr.appendChild(td);	
	
	
	td = document.createElement("td");
	select = document.createElement("select");
	select.setAttribute("class","functions");
	select.addEventListener("change",fillTextArea);
	select.setAttribute("id",data.code);
	option = document.createElement("option");
	option.setAttribute("value","none");
	option.innerHTML="Select none...";
	select.appendChild(option);
	td.appendChild(select);
	tr.appendChild(td);	
	
	
	td = document.createElement("td");
	text = document.createElement("textarea");
	text.setAttribute("min-width","300px");
	text.setAttribute("rows",2);
	text.setAttribute("cols",40);
	text.setAttribute("id",data.code);
	td.appendChild(text);
	tr.appendChild(td);	
	table[2].appendChild(tr);
}

function addVars(json){
	for (obj in json){
        var node = json[obj]; 
		if(node.type){
			var_push(node,'inputfile',"uploaded");
		}
        if (node.children){
            var sub_json = addVars(node.children);
        }
    }
}

function clearStorage(){
	localStorage.clear();
}

function clearDataa(){
	localStorage.removeItem("to_match_var");
	window.location.href = "harmonization.php";
}