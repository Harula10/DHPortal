window.onload = function(){
	var x = document.querySelectorAll(".field_buttons");
	x[0].addEventListener("click",deleteG);
	x[1].addEventListener("click",saveG);
	x[2].addEventListener("click",deleteV);
	x[3].addEventListener("click",saveV);
	initializeSVG();
};

/*
	SVG INITIALIZER
*/
var JSONobj = [];
var codes = [];
var init = true;
var svg;
var pack;
var color;
var margin = 20,
	padding = 2,
	diameter = 350;
function initializeSVG(){
	svg = d3.select("#groups").append("svg")
			.attr("width", diameter)
			.attr("height", diameter)
			.append("g")
			.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

	/*d3.select("#groups")
			.on("click", function() {
					zoom(root);
			});

	zoomTo([root.x, root.y, root.r * 2 + margin]);*/
}

/*
	VARIABLE FUNCTIONS
*/

var currentRow;
var flag = false; //manages if the "save" action comes from updated variable or a new one
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

function saveV(){
	if(flag){ //if you need to edit variable, delete the old, then add the new
		editV();
	}
	var new_vars = document.querySelectorAll(".vars");
	if(new_vars[3].value==""){
		alert("You should create a group first!");
	}else{ //create a new row element
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

//enables the save button if there is any change in the form
function changeAttr(){
	if(flag){
		document.querySelector("#saveV").disabled = false;
	}
}

//if a variable is clicked, fill the form below
function fillformV(e){
	flag=true;
	var num = document.getElementById("table").rows.length;	
	var index = e.target.parentElement.rowIndex;
	currentRow = index;
	highlight();
	
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

function highlight(){
	var row=document.getElementsByTagName("tr"); 
	for(var i=1;i<row.length;i++)
		row[i].className=''; 
	document.getElementById("table").rows[currentRow].className="highlight";
}

/*
	GROUP FUNCTIONS
*/

function deleteG(str){
	/*
		DELETE ALL VARIABLES OF THIS GROUP
		delete from codes[]
		change JSON obj
	*/
	alert("deleteG");
}

function saveG(){
	var groups = document.querySelectorAll(".groups");
	//if the "code" already exists don't add that group
	if(if_exists(groups[0].value)){
		if(confirm("The group with the code "+groups[0].value+" already exists. Are you sure you want to save the changes?")){
			/*
				TODO: 
				1. find the group
				2. change the attr in JSON
			*/
			alert("TO DO");
		}
	}else{
		codes.push(groups[0].value);
		var node = {
			"code" : groups[0].value,
			"label" : groups[1].value,
			"parent" : groups[2].value,
			"description" : groups[3].value,
			"children" : []
		};
		if(groups[2].value == "none"){
			JSONobj.push(node);	
		}else{
			var found = find_parent(JSONobj,node);
			found.children.push(node);
		}
		
		draw();
		add_option("select",groups[1].value);
		add_option("select2",groups[1].value);
		document.getElementById("formG").reset();
	}
}

function draw(){
	var str = JSON.stringify(JSONobj, null, ' '); 
	var new_str = "{ \"label\": \"none\", \"children\":" + str +"}";
	var json = JSON.parse(new_str);
	console.log(json);
	//json = flareData();
	
	color = d3.scale.linear()
		.domain([0, tree_length(json)])
		.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
		.interpolate(d3.interpolateHcl);

	pack = d3.layout.pack()
			.padding(padding)
			.size([diameter, diameter])
			.value(function(d) {
					//return d.size;
				return 100;
			});
	
	var nodes = pack.nodes(json);
	var circle = svg.selectAll("circle")
			.data(nodes)
			.enter().append("circle")
			.attr("class", function(d) {
					return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
			})
			.style("fill", function(d) {
					return d.children ? color(d.depth) : null;
			})
			.on("click", function(d) {
					alert("JI");
					//if (focus !== d) zoom(d), d3.event.stopPropagation();
			});

	var text = svg.selectAll("text")
			.data(nodes)
			.enter().append("text")
			.attr("class", "label")
			.style("fill-opacity", function(d) {
					return d.parent === json ? 1 : 0;
			})
			.style("display", function(d) {
					return d.parent === json ? null : "none";
			})
			.text(function(d) {
					return d.label;
			});
}

//find the parent that has to add the new child
function find_parent(json,new_child){
	for (obj in json){
        var node = json[obj]; 
        if (node.label == new_child.parent)
            return node;
        if (node.children){
            var sub_json = find_parent(node.children,new_child);
            if (sub_json)
                return sub_json;
        }
    }
    return null;
}

function tree_length(root) {
	if (!root.children) {
		return 1;
	}
	return 1 + d3.max(root.children.map(tree_length));
}

//returns true if the group with the code "code" already exists in JSON
function if_exists(code){
	for(var i = 0; i < codes.length; i++){
		if(codes[i] == code){
			return true;
		}
	}
	return false;
}

function add_option(id,option_name) {
	var length=document.getElementById(id).options.length;
	for ( var i=0; i < length; i++ ) {
		if (document.getElementById(id).options[i].text == option_name)  {
			return;
		} 
	}
	document.getElementById(id).options[length] = new Option(option_name, option_name);
}

function flareData() {
		return {
			"label": "analytics",
			"children": [
					{						
						"label": "cluster",
						"children": [{
								"label": "AgglomerativeCluster"
						}, {
								"label": "CommunityStructure"
						}, {
								"label": "HierarchicalCluster"
						}, {
								"label": "MergeEdge"
						}]
					},
					{
						"label": "whatever",
						"children": [{
								"label": "lalala"
						}, {
								"label": "CommunityStructure"
							}
						]
					}
			]
		};
}