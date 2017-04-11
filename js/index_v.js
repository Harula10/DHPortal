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
	if(flagV){
		if(editV()){ //deletes the old variable from table
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
				for(var i = 0; i < group.children.length;i++){
					if(group.children[i].code == highlighted.code){ 
						group.children.splice(i, 1);
						if(!group.children[0]) group.children.push({});
						break;
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
		tr.setAttribute("class", "new"); //not uploaded ones
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
		draw();
		var td = document.createElement("td");
		td.innerHTML = new_vars[5].value;
		tr.appendChild(td);
		var td = document.createElement("td");
		td.innerHTML = new_vars[4].value;
		tr.appendChild(td);
		tr.addEventListener("click",fillformV);
		table.appendChild(tr);
		
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
				"methodology" : vars[5].value
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
		"methodology" : vars[5].value
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
