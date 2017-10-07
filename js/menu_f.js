var rows;
var vars;

window.onload = function(){	
	var x = document.querySelectorAll(".field_buttons");
	x[0].addEventListener("click",resetG);
	x[1].addEventListener("click",deleteG);
	x[2].addEventListener("click",saveG);
	x[3].addEventListener("click",resetV);
	x[4].addEventListener("click",deleteV);
	x[5].addEventListener("click",saveV);
		
	var li = document.querySelectorAll("#varbar > ul > li");
	for(var i = 0; i < li.length; i++){
		li[i].addEventListener("click",select_tab);
	}
	
	initializeSVG(620);
	var y = document.querySelectorAll(".navlink");
	y[0].addEventListener("click",uploadJSON);
	y[1].addEventListener("click",downloadJSON);
	y[2].addEventListener("click",downloadCSV);
	y[3].addEventListener("click",uploadCSV);
	y[4].addEventListener("click",showload);
	y[5].addEventListener("click",showshare);
	
	//LOCAL DATA
	if(localStorage.variables){
		vars = JSON.parse(localStorage.variables);
		for (var i = 0; i < vars.length; i++){
			initVar(vars[i],'inputfilecsv');	
		}
	}else{
		vars = [];
	}
	
	if(localStorage.JSONobj){
		JSONobj = JSON.parse(localStorage.JSONobj);
		if(localStorage.load_fromFriend){
			addVars(JSONobj,"grouped friends");
		}else{
			addVars(JSONobj,"grouped");
			localStorage.load_fromFriend = false;
		}
		draw();
	}else{
		JSONobj = [];
	}
	
	if(localStorage.csv){
		rows = localStorage.csv.split("\n");
		readCSV("ungrouped friends");
		localStorage.removeItem("csv");
	}
}

function downloadCSV(event){
	var vars = JSON.parse(localStorage.variables);
	var str = 'Code,Label,Type,Description,Methodology\n';
	for (var i = 0; i < vars.length; i++) {
		var line = '';
		for (var index in vars[i]) {
			if(index=="group" || index=="classname"){
				continue;
			}else{
				if (line != '') line += ','
				line += vars[i][index];
			}
		}
		str += line + '\n';
	}
	var data = "text/csv;charset=utf-8," + encodeURIComponent(str);
	event.target.href = 'data:' + data;
	event.target.download = 'variable-data.csv';
}

function downloadJSON(event){
	var data = "text/json;charset=utf-8," + encodeURIComponent(localStorage.JSONobj);
	event.target.href = 'data:' + data;
	event.target.download = 'meta-data.json';
}

function uploadJSON(event){
	event.preventDefault();
	document.getElementById("inputfile").click();	
}

function uploadCSV(event){
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
	if (filename != null) {
		var	xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4){
				var res = xmlhttp.responseText;
				alert(res);
			}
		}
		var data = encodeURIComponent(localStorage.JSONobj);
		xmlhttp.open("GET","../php_files/data_handling/file_handler.php?action=share&path="+folder+"/"+filename+".json"+"&data="+cleanJSON(data),true);
		xmlhttp.send();
	}else{
		alert("Insert a valid name!");
	}
}

function cleanJSON(json){
	for (obj in json){
        var node = json[obj]; 
		if(node.classname){
			delete node.classname;
		}
        if (node.children){
            var sub_json = cleanJSON(node.children);
        }
    }
	return json;
}

function chooseFile(path){
	document.getElementById("folders").style.display="none";
	var file = new XMLHttpRequest();
    file.open("GET", path, false);
    file.onreadystatechange = function (){
        if(file.readyState === 4){
			var allText = file.responseText;
			if(path.includes(".json")){
				localStorage.JSONobj = allText;
				JSONobj = JSON.parse(localStorage.JSONobj);
				addVars(JSONobj,"grouped");
				draw();
			}else if(path.includes(".csv")){
				//split each row of csv file
				rows = allText.split("\n");
				readCSV('new');
			}else{
				alert("Wrong type!");
			}
        }
    }
    file.send(null);
}


function getFile(id){
	var files = document.getElementById(id).files;
	if (files.length <= 0) return;
	var fr = new FileReader();
	fr.onload = function() { 
		if(id=='inputfile'){
			localStorage.JSONobj = fr.result;
			var result = JSON.parse(fr.result);
			JSONobj = result.slice();
			//find all the variables and add them to array
			addVars(JSONobj,"grouped");
			draw();
		}else{
			//split each row of csv file
			rows = fr.result.split("\n");
			readCSV("ungrouped new");
		}
		
	}
	fr.readAsText(files.item(0));
}

function readCSV(classname){
	for (var i = 1; i < rows.length; i++) {
		if(rows[i]==""){
			break;
		}
		var cells = rows[i].split(",");
		if(cells[2]==null){
			alert("The fields of the CSV should contain a comma as a delimeter!");
			return;
		}
		if(cells[2].trim()!="Polynominal" && cells[2].trim()!="Binominal" && cells[2].trim()!="Real" ){
			alert("Please, upload a CSV with the required fields!");
			return;
		}					
		var variable = {
			"code" : cells[0],
			"label" : cells[1],
			"type" : cells[2].trim(),
			"group" : "",
			"description" : cells[3],
			"methodology" : cells[4],
			"classname" :  classname
		};
		var_push(variable,'inputfilecsv');
	}
}

function var_push(data,id){
	var f = true;
	if(localStorage.variables)
		var vars = JSON.parse(localStorage.variables);
	else
		var vars = [];
	for (var i = 0; i < vars.length; i++) { //if a variable already exists
		if (vars[i].code == data.code && vars[i].group == data.group ) { //don't add it in array
			f = false;
		}
	}
	if(f){ //if it doesn't exists add it in array AND table
		vars.push(data);
		localStorage.variables = JSON.stringify(vars);
		initVar(data,id);
	}
}

function initVar(data,id){
	document.getElementById("data").style.visibility = "hidden";
	var table = document.querySelector("#table");	
	var tr = document.createElement("tr");
	if(id=='inputfile'){
		add_option(document.getElementById("select"),data.group);
		add_option(document.getElementById("select2"),data.group);
	}

	if(data.classname)
		tr.setAttribute("class", data.classname); //uploaded or new ones
	else
		tr.setAttribute("class", "grouped");
		
	var td = document.createElement("td");
	td.innerHTML = data.code;
	tr.appendChild(td);	
	td = document.createElement("td");
	td.innerHTML = data.label;
	tr.appendChild(td);	
	td = document.createElement("td");
	td.innerHTML = data.type;
	tr.appendChild(td);	
	td = document.createElement("td");
	td.innerHTML = data.group;
	tr.appendChild(td);		
	td = document.createElement("td");
	td.innerHTML = data.methodology;
	tr.appendChild(td);	
	td = document.createElement("td");
	td.innerHTML = data.description;
	tr.appendChild(td);

	tr.addEventListener("click",fillformV);
	table.appendChild(tr);
}

function addVars(json,classname){
	for (obj in json){
        var node = json[obj]; 
		if(node.type){
			node["classname"]=classname;
			var_push(node,'inputfile');
		}else if(node.code){
			codes.push(node.code);
			add_option(document.getElementById("select"),node.code);
			add_option(document.getElementById("select2"),node.code);
		}
        if (node.children){
            var sub_json = addVars(node.children,classname);
        }
    }
}

function clearStorage(){
	localStorage.clear();
}


function clearData(){
	localStorage.clear();
	window.location.href = "home.php";
}