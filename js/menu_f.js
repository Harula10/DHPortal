var rows;
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
	
	initializeSVG();
	var y = document.querySelectorAll(".navlink");
	y[0].addEventListener("click",uploadJSON);
	y[1].addEventListener("click",downloadJSON);
	y[2].addEventListener("click",uploadCSV);
	y[3].addEventListener("click",showload);
	y[4].addEventListener("click",showshare);
	
	if(localStorage.JSONobj){
		JSONobj = JSON.parse(localStorage.JSONobj);
		addVars(JSONobj);
		draw();
		initVar('inputfile',"uploaded");
	}else{
		JSONobj = [];
	}
	
	if(localStorage.variables){
		rows = localStorage.variables.split("\n");
		readCSV('inputfilecsv',rows);
	}	
}

function downloadJSON(){
	var data = "text/json;charset=utf-8," + encodeURIComponent(localStorage.JSONobj);
	event.target.href = 'data:' + data;
	event.target.download = 'meta-data.json';
}

function uploadJSON(){
	event.preventDefault();
	document.getElementById("inputfile").click();	
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
		xmlhttp.open("POST","../php_files/data_handling/file_handler.php?action=share&path="+folder+"/"+filename+".json"+"&data="+localStorage.JSONobj,true);
		xmlhttp.send();
	}else{
		alert("Insert a valid name!");
	}
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
				addVars(JSONobj);
				draw();
				initVar('inputfile',"uploaded");
			}else if(path.includes(".csv")){
				//split each row of csv file
				rows = allText.split("\n");
				readCSV('inputfilecsv',rows);
			}else{
				alert("Wrong type!");
			}
        }
    }
    file.send(null);
}

var vars = [];
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
			addVars(JSONobj);
			draw();
			//add vars to list
			initVar(id,"uploaded");
		}else{
			//split each row of csv file
			localStorage.variables = fr.result;
			rows = fr.result.split("\n");
			readCSV(id,rows);
		}
		
	}
	fr.readAsText(files.item(0));
}

function readCSV(id,rows){
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
			"methodology" : cells[4]
		};
		vars.push(variable);
	}
	localStorage.variables = JSON.stringify(vars);
	initVar(id,"new");
}

function initVar(id,varclass){
	document.getElementById("data").style.visibility = "hidden";
	var table = document.querySelector("#table");	
	for(var i = 0; i < vars.length; i++){
		var tr = document.createElement("tr");
		if(id=='inputfile'){
			add_option("select",vars[i].group);
			add_option("select2",vars[i].group);
		}
		tr.setAttribute("class", varclass); //uploaded or new ones
		
		var td = document.createElement("td");
		td.innerHTML = vars[i].code;
		tr.appendChild(td);	
		td = document.createElement("td");
		td.innerHTML = vars[i].label;
		tr.appendChild(td);	
		td = document.createElement("td");
		td.innerHTML = vars[i].type;
		tr.appendChild(td);	
		td = document.createElement("td");
		td.innerHTML = vars[i].group;
		tr.appendChild(td);	
		td = document.createElement("td");
		td.innerHTML = vars[i].description;
		tr.appendChild(td);	
		td = document.createElement("td");
		td.innerHTML = vars[i].methodology;
		tr.appendChild(td);	

		tr.addEventListener("click",fillformV);
		table.appendChild(tr);
	}
	vars = [];
}

function addVars(json){
	for (obj in json){
        var node = json[obj]; 
		if(node.type){
			vars.push(node);
		}else{
			if(JSON.stringify(node.children, null, '' )=="[{}]")
				codes.push(node.label),add_option("select",node.label) , add_option("select2",node.label);
		}
        if (node.children){
            var sub_json = addVars(node.children);
        }
    }
}

function clearStorage(){
	localStorage.clear();
}