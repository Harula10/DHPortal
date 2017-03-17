window.onload = function(){
	var x = document.querySelectorAll(".field_buttons");
	x[0].addEventListener("click",deleteG);
	x[1].addEventListener("click",saveG);
	x[2].addEventListener("click",deleteV);
	x[3].addEventListener("click",saveV);
};

var currentRow;
var flag = false;

function clear(){
	alert(event.target.tagName);
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
	}
	flag=false;
}

function editV(){
	if (confirm("Are you sure you want to edit this variable?")) {
		var columns = document.getElementById("table").deleteRow(currentRow);
		var num = document.getElementById("table").rows.length;
		if(num==1){
			document.getElementById("data").style.visibility = "visible";
			currentRow == 1;
		}
	}
}

function changeAttr(){
	if(flag){
		document.querySelector("#saveV").disabled = false;
	}
}

function saveV(){
	if(flag){ //if you need to edit variable, delete the old, then add the new
		editV();
	}
	var new_vars = document.querySelectorAll(".vars");
	if(new_vars[3].value==""){
		alert("You should create a group first!");
	}else{
		document.getElementById("data").style.visibility = "hidden";
		var table = document.querySelector("#table");	
		var tr = document.createElement("tr");
		tr.setAttribute("id", "new");
		for(var i = 0; i < 3; i++){
			var td = document.createElement("td");
			td.innerHTML = new_vars[i].value;
			tr.appendChild(td);
		}	
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

function fillformV(e){
	flag=true;
	var num = document.getElementById("table").rows.length;	
	var index = e.target.parentElement.rowIndex;
	currentRow = index;
	hightlight();
	
	var vars = document.querySelectorAll(".vars");
	var columns = document.getElementById("table").rows[index].cells;
	for(var i = 0; i < 3; i++){
		vars[i].value = columns[i].innerHTML;
	}	
	/*
		ΠΡΕΠΕΙ ΝΑ ΣΥΜΠΛΗΡΩΝΕΙ ΚΑΙ ΤΟ ΓΚΡΟΥΠ
	**/
	vars[4].value = columns[4].innerHTML;
	vars[5].value = columns[3].innerHTML;	
	
	document.querySelector("#saveV").disabled = true;
	document.querySelector("#delV").disabled = false;
}

function hightlight(){
	var row=document.getElementsByTagName("tr"); 
	for(var i=1;i<row.length;i++)
		row[i].className=''; 
	document.getElementById("table").rows[currentRow].className="highlight";
}