function downloadJSON(){
	var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSONobj,null,' '));
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

/*
	NAVIGATION BAR
*/

var vars = [];
function getFile(event,id){
	var files = document.getElementById(id).files;
	if (files.length <= 0) return;
	
	var input = event.target;
	var fr = new FileReader();
	fr.onload = function() { 
		if(id=='inputfile'){
			var result = JSON.parse(fr.result);
			var formatted = JSON.stringify(result, null, 2);
			JSONobj = result.slice();
			//find all the variables and add them to array
			addVars(JSONobj);
			
			//Reset all the panels??
			
			draw();
			//add vars to list
			initVar(id,"uploaded");
		}else{
			//split each row of csv file
			var rows = fr.result.split("\n");
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
			initVar(id,"new");
		}
		
	}
	fr.readAsText(files.item(0));
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
				add_option("select",node.label) , add_option("select2",node.label);
		}
        if (node.children){
            var sub_json = addVars(node.children);
        }
    }
}
