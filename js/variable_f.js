/*
	VARIABLE FUNCTIONS
*/

var currentRow;
var flagV = false; //manages if the "save" action comes from updated variable or a new one

function if_duplicates(code){
	var table = document.querySelector("#table");
	for(var i = 1; i < table.rows.length; i++){
		if(code.trim() == table.rows[i].cells[0].innerHTML){
			alert("The variable with the code '"+code.trim()+"' already exists!");
			return true;
		}
	}
	return false;
}

function saveV(){
	if(checkrequired("vars requiredField")){ //if the required fields are not filled
		return;
	}
	if(flagV){
		if(editV()){ //deletes the old variable from table
			//deletes the variable from localStorage
			var vars = JSON.parse(localStorage.variables);
			for(var i = 0; i < vars.length; i++){
				if(vars[i].code == highlighted.code){
					vars.splice(i,1);
					break;
				}
			}
			localStorage.variables = JSON.stringify(vars);
			//delete the old var from group
			if(highlighted.group.trim()==""){
				var e = document.querySelector("#select2");
				highlighted.group = e.options[e.selectedIndex].text;
			}
			if(highlighted.group=="None"){
				for(var i = 0; i<JSONobj.length; i++){
					if(JSON.stringify(JSONobj[i]) === JSON.stringify(highlighted) ){
						JSONobj.splice(i,1);
						break;
					}
				}
			}else{
				var group = search(JSONobj,highlighted.group,false);
				if(group){ //if the edited variable had a group that existed in the current json
					for(var i = 0; i < group.children.length;i++){
						if(group.children[i].code == highlighted.code){ 
							group.children.splice(i, 1);
							if(!group.children[0]) group.children.push({});
							break;
						}
					}
				}
			}
		}else{
			return;
		}
	}
	var new_vars = document.querySelectorAll(".vars");
	if(!if_duplicates(new_vars[0].value)){
		//create a new row element
		document.getElementById("data").style.visibility = "hidden";
		var table = document.querySelector("#table");	
		var tr = document.createElement("tr");
		tr.setAttribute("class", "new"); 
		
		for(var i = 0; i < 4; i++){
			var td = document.createElement("td");
			td.innerHTML = new_vars[i].value;
			tr.appendChild(td);
		}	
		//add var into a group
		var variable = {
				"code" : new_vars[0].value,
				"label" : new_vars[1].value,
				"type" : new_vars[2].value,
				"group" : new_vars[3].value,
				"description" : new_vars[4].value,
				"methodology" : new_vars[5].value
			};
		group = search(JSONobj,new_vars[3].value,false);
		if(group){
			if(JSON.stringify(group.children[0], null, ' ')=="{}")
				group.children.splice(0, 1);
			group.children.push(variable);
		}else{
			JSONobj.push(variable);
		}
		localStorage.JSONobj = JSON.stringify(JSONobj);
		draw();
		var td = document.createElement("td");
		td.innerHTML = new_vars[5].value;
		tr.appendChild(td);
		var td = document.createElement("td");
		td.innerHTML = new_vars[4].value;
		tr.appendChild(td);
		tr.addEventListener("click",fillformV);
		table.appendChild(tr);
		
		variable["classname"] = "new";
		var vars = JSON.parse(localStorage.variables);
		vars.push(variable);
		localStorage.variables = JSON.stringify(vars);
		
		document.getElementById("formV").reset();
		document.querySelector("#delV").disabled = true;
	}
}

function editV(){
	if (confirm("Are you sure you want to edit this variable?")) {
		var columns = document.getElementById("table").deleteRow(currentRow);
		var num = document.getElementById("table").rows.length;
		if(num==1){
			document.getElementById("data").style.visibility = "visible";
			currentRow == 1;
		}
		return true;
	}else{
		resetV();
		return false;
	}
}


function deleteV(){
	if (confirm("Are you sure you want to delete this variable?")) {
		var columns = document.getElementById("table").deleteRow(currentRow);
		var num = document.getElementById("table").rows.length;
		if(num==1){
			document.getElementById("data").style.visibility = "visible";
			currentRow == 1;
		}
		document.getElementById("formV").reset();
		document.querySelector("#saveV").disabled = false;
		document.querySelector("#delV").disabled = true;
		
		//delete from localstorage too
		var vars = JSON.parse(localStorage.variables);
			for(var i = 0; i < vars.length; i++){
				if(vars[i].code == highlighted.code){
					vars.splice(i,1);
					break;
				}
			}
		localStorage.variables = JSON.stringify(vars);
		
		var group = search(JSONobj,highlighted.group,false);
		if(group){
			for(var i = 0; i < group.children.length;i++){
				if(group.children[i].code == highlighted.code){ 
					group.children.splice(i, 1);
					if(!group.children[0]){
						group.children = [{}];
					}
					break;
				}
			}
		}else{
			for(var i = 0; i<JSONobj.length; i++){
				if(JSON.stringify(JSONobj[i]) === JSON.stringify(highlighted) ){
					JSONobj.splice(i,1);
					break;
				}
			}
		}
	}
	draw();
	flagV=false;
}


var highlighted;
function resetV(){
	document.getElementById("formV").reset();
	if(flagV){
		document.querySelector("#saveV").disabled = false;
		document.querySelector("#delV").disabled = true;
	}
	var row=document.getElementsByTagName("tr"); 
	for(var i=1;i<row.length;i++){
		if(row[i].classList.contains('highlight'))
			row[i].classList.remove('highlight'); 
	}
	flagV = false;
}


function findVar(e){
	var vars = document.querySelectorAll(".vars");
	var table = document.getElementById("table");
	for(var i = 1; i < table.rows.length; i++){
		if(table.rows[i].cells[1].innerHTML==e.label){
			for(var j = 0; j < 4; j++){
				vars[0].value = table.rows[i].cells[0].innerHTML;
				vars[1].value = table.rows[i].cells[1].innerHTML;
				vars[2].value = table.rows[i].cells[2].innerHTML;
				vars[3].value = table.rows[i].cells[3].innerHTML;;
				vars[4].value = table.rows[i].cells[5].innerHTML;
				vars[5].value = table.rows[i].cells[4].innerHTML;	
			}
			currentRow = i;
			highlighted = {
				"code" : vars[0].value,
				"label" : vars[1].value,
				"type" : vars[2].value,
				"group" : vars[3].value,
				"description" : vars[4].value,
				"methodology" : vars[5].value,
				"classname" : table.rows[i].className
			}
			highlight();
			break;
		}			
	}
	flagV = true;
	document.querySelector("#saveV").disabled = true;
	document.querySelector("#delV").disabled = false;

}

//enables the save button if there is any change in the form
function changeAttrV(){
	if(flagV){
		document.querySelector("#saveV").disabled = false;
	}
}

//if a variable is clicked, fill the form below
function fillformV(e){
	flagV=true;
	var num = document.getElementById("table").rows.length;	
	var index = e.target.parentElement.rowIndex;
	currentRow = index;
	highlight();
	
	var vars = document.querySelectorAll(".vars");
	var columns = document.getElementById("table").rows[index].cells;
	for(var i = 0; i < 4; i++){
		vars[i].value = columns[i].innerHTML;
	}	
	vars[4].value = columns[5].innerHTML;
	vars[5].value = columns[4].innerHTML;	
	
	document.querySelector("#saveV").disabled = true;
	document.querySelector("#delV").disabled = false;
	highlighted = {
		"code" : vars[0].value,
		"label" : vars[1].value,
		"type" : vars[2].value,
		"group" : vars[3].value,
		"description" : vars[4].value,
		"methodology" : vars[5].value,
		"classname" : document.getElementById("table").rows[index].className
	}
}

function highlight(){
	var row=document.getElementsByTagName("tr"); 
	for(var i=1;i<row.length;i++){
		if(row[i].classList.contains('highlight'))
			row[i].classList.remove('highlight'); 
	}
	document.getElementById("table").rows[currentRow].classList.add('highlight');
}

function select_tab(e){
	var li = document.querySelectorAll("#varbar > ul > li");
	for(var i = 0; i < li.length; i++){
		li[i].removeAttribute("id");
	}
	e.target.parentElement.setAttribute("id","selected");
	var tr = document.querySelectorAll("tr:not(#table)");
	for(var i = 0; i<tr.length; i++){
		tr[i].style.display = "table-row";
	}
	if(e.target.innerHTML=="Ungrouped"){
		hideTR("grouped");
		hideTR("new");
	}else if(e.target.innerHTML=="Grouped"){
		hideTR("ungrouped");
		hideTR("new");
	}else if(e.target.innerHTML=="Recent"){
		hideTR("grouped");
		hideTR("ungrouped");
	}
}

function hideTR(classname){
	var tr = document.getElementsByClassName(classname);
	for(var i = 0; i<tr.length; i++){
		tr[i].style.display = "none";
	}
}

//Code and Label are required fields.
//returns true if the required fields are empty
function checkrequired(classname){
	var required = document.getElementsByClassName(classname);
	var isfilled = true;
	var str="";
	if(required[0].value==""){
		str = str+"Code ";
		isfilled = false;
	}
	if(required[1].value==""){
		if(!isfilled){
			str = str+"and Label ";
		}else{
			str = str+"Label ";
			isfilled = false;
		}
	}
	if(!isfilled)
		alert(str+"is required!");
	return !isfilled;		
}
