window.onload = function(){
	var x = document.querySelectorAll(".field_buttons");
	x[0].addEventListener("click",deleteG);
	x[1].addEventListener("click",saveG);
	x[2].addEventListener("click",deleteV);
	x[3].addEventListener("click",saveV);
	var li = document.querySelectorAll("#varbar > ul > li");
	for(var i = 0; i < li.length; i++){
		li[i].addEventListener("click",select_tab);
	}
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
var	padding = 2,
	diameter = 350;
function initializeSVG(){
	svg = d3.select("#groups").append("svg")
			.attr("width", diameter)
			.attr("height", diameter)
			.append("g")
			.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
}

/*
	VARIABLE FUNCTIONS
*/

var currentRow;
var flagV = false; //manages if the "save" action comes from updated variable or a new one
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
	draw();
	flagV=false;
}

function saveV(){
	if(flagV){ //if you need to edit variable, delete the old, then add the new
		editV();
	}
	var new_vars = document.querySelectorAll(".vars");
	if(new_vars[3].value==""){
		alert("You should create a group first!");
	}else{ //create a new row element
		document.getElementById("data").style.visibility = "hidden";
		var table = document.querySelector("#table");	
		var tr = document.createElement("tr");
		tr.setAttribute("id", new_vars[3].value); //group as row id
		tr.setAttribute("class", "new"); //not uploaded ones
		for(var i = 0; i < 3; i++){
			var td = document.createElement("td");
			td.innerHTML = new_vars[i].value;
			tr.appendChild(td);
		}	
		//add var into a group
		var group = search(JSONobj,new_vars[3].value,false);
		if(group){
			alert(JSON.stringify(group,null,' '));
			var variable = {
				"code" : new_vars[0].value,
				"label" : new_vars[1].value,
				"type" : new_vars[2].value,
				"group" : new_vars[3].value,
				"description" : new_vars[4].value,
				"methology" : new_vars[5].value
			};
			if(JSON.stringify(group.children[0], null, ' ')=="{}")
				group.children.splice(0, 1);
			group.children.push(variable);
			draw();
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
	for(var i = 0; i < 3; i++){
		vars[i].value = columns[i].innerHTML;
	}	
	vars[3].value = document.getElementById("table").rows[index].id;
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

var flagG = false;
function changeAttrG(){
	if(flagG){
		document.querySelector("#saveG").disabled = false;
	}
}

function deleteG(){
	if (confirm("Are you sure you want to delete this variable?")) {
		for(var i = 0; i < codes.length;i++){
			if(codes[i] == selected.code){ //the node we want to delete
				codes.splice(i, 1);
				break;
			}
		}
		var found = search(JSONobj,selected,true);
		if(found){
			for(var i = 0; i < found.children.length;i++){
				if(found.children[i].code == selected.code){ //we found the child we should delete;
					found.children.splice(i, 1);
					break;
				}
			}
		}else{ //is a root element
			for(var i = 0; i < JSONobj.length;i++){
				if(JSONobj[i].code == selected.code){ //we found the child we should delete
					JSONobj.splice(i, 1);
					break;
				}
			}
		}
		delete_option("select",selected.label);
		delete_option("select2",selected.label);	
	}
	draw();
}

var selected;
function fillformG(d){
	flagG = true;
	var groups = document.querySelectorAll(".groups");
	groups[0].value = d.code;
	groups[1].value = d.label;
	if(d.parent.label=="")
		groups[2].value = "None";
	else
		groups[2].value = d.parent.label;
	groups[3].value = d.description;
	selected = {
			"code" : groups[0].value,
			"label" : groups[1].value,
			"parent" : groups[2].value,
			"description" : groups[3].value,
			"children" : [{}]
		};
	document.querySelector("#saveG").disabled = true;
	document.querySelector("#delG").disabled = false;
}

function editG(){
	var groups = document.querySelectorAll(".groups");
	var node = {
		"code" : groups[0].value,
		"label" : groups[1].value,
		"parent" : groups[2].value,
		"description" : groups[3].value
	};			
	var found = search(JSONobj,selected,true);
	if(!found){ //if the parent is the root
		for(var i = 0; i < JSONobj.length;i++){
			if(JSONobj[i].code == selected.code){ //we found the child we should delete
				node.children = [];
				node.children = JSONobj[i].children;
				JSONobj.splice(i, 1);
				break;
			}
		}
		found = search(JSONobj,node,true); //search the new parent and insert the edited node
		found.children.push(node);
		if(JSON.stringify(found.children[0], null, ' ')=="{}")
			found.children.splice(0, 1);
	}else{ //if the parent is a node
		for(var i = 0; i < found.children.length;i++){
			if(found.children[i].code == selected.code){ //we found the child we should delete
				node.children = [];
				node.children = found.children[i].children;
				found.children.splice(i, 1);
				break;
			}
		}
		found = search(JSONobj,node,true); //search the parent and insert the edited node
		if(found){
			found.children.push(node);
			if(JSON.stringify(found.children[0], null, ' ')=="{}")
				found.children.splice(0, 1);
		}else{
			JSONobj.push(node);
		}
	}
	delete_option("select",selected.label);
	delete_option("select2",selected.label);
	flag = false;
}

function saveG(){
	var groups = document.querySelectorAll(".groups");
	if(flagG){ //if you need to edit a group
		if(confirm("Are you sure you want to edit this group?")){
			editG();
		}else{
			document.getElementById("formG").reset();
			return;	
		}
	}else{
		//if the "code" already exists don't add that group
		if(if_exists(groups[0].value)){
			alert("The group with the code "+groups[0].value+" already exists.");
		}else{
			codes.push(groups[0].value);
			var node = {
				"code" : groups[0].value,
				"label" : groups[1].value,
				"parent" : groups[2].value,
				"description" : groups[3].value,
				"children" : [{}]
			};
			if(groups[2].value == "none"){
				JSONobj.push(node);	
			}else{
				var found = search(JSONobj,node,true);
				found.children.push(node);
				if(JSON.stringify(found.children[0], null, ' ')=="{}"){
					found.children.splice(0, 1);
					delete_option("select2",groups[2].value);
				}
			}
		}
	}
	draw();
	add_option("select",groups[1].value);
	add_option("select2",groups[1].value);
	
	document.getElementById("formG").reset();
}

var circle;
var focus;
var text;
function draw(){
	var str = JSON.stringify(JSONobj, null, ' '); 
	var new_str = "{ \"label\": \"none\", \"children\":" + str +"}";
	var json = JSON.parse(new_str);
	
	svg.selectAll("circle").remove();
	svg.selectAll("text").remove();
	
	d3.select("#groups")
			.on("click", function() {
					zoom(json);
			});
	
	var color = d3.scale.linear()
		.domain([0, tree_length(json)])
		.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
		.interpolate(d3.interpolateHcl);

	var pack = d3.layout.pack()
			.padding(padding)
			.size([diameter, diameter])
			.value(function(d) {
				return 100;
			});

	focus = json;
	var nodes = pack.nodes(json);
	
	circle = svg.selectAll("circle")
			.data(nodes)
			.enter().append("circle")
			.attr("class", function(d) {
					if(d.parent){
						if(d.children)
							return "node";
						else
							return "node node--leaf";
					}else{
						return "node node--root";
					}
			})
			.style("fill", function(d) {
				return d.children ? color(d.depth) : null;
			})
			.style("stroke", "gray")
			.on("click", function(d) {
					if (focus !== d) fillformG(d) , zoom(d), d3.event.stopPropagation();
			});
			
	console.log(circle);
	
	text = svg.selectAll("text")
			.data(nodes)
			.enter().append("text")
			.attr("class", "label")
			.style("display", function(d) {
					return d.parent === json ? null : "none";
			})
			.text(function(d) {
					return d.label;
			});
		
	//set the circle attributes each time
	zoomTo([json.x, json.y, json.r * 2]);
}

var view;
function zoomTo(v) {
	var node = svg.selectAll("circle,text");
	console.log(node);
	var k = diameter / v[2];
	view = v;
	node.attr("transform", function(d) {
			//alert(d.x+"-"+v[0]+","+d.y+"-"+v[1]);
			return "translate(" + (d.x - v[0]) + "," + (d.y - v[1])  + ")";
	});
	circle.attr("r", function(d) {
			return d.r * k;
	});
}

function zoom(d) {
		focus = d;
		var transition = d3.transition()
				.duration(d3.event.altKey ? 5000 : 750)
				.tween("zoom", function(d) {
						var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
						return function(t) {
								zoomTo(i(t));
						};
				});
		transition.selectAll("text")
				.filter(function(d) {
						return d.parent === focus || this.style.display === "inline";
				})
				.each("start", function(d) {
						if (d.parent === focus) this.style.display = "inline";
				})
				.each("end", function(d) {
						if (d.parent !== focus) this.style.display = "none";
				});
}

//find the parent that has to add the new child if f = true
//find the group that has to add the var if f=false
function search(json,_node,_flag){
	for (obj in json){
        var node = json[obj]; 
		if(_flag){
			if (node.label == _node.parent){
				return node;
			}
		}else{
			if (node.label == _node){
				return node;
			}
		}
        if (node.children){
            var sub_json = search(node.children,_node);
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

function delete_option(id,option_name){
	var length = document.getElementById(id).length;
	for (var i=0; i < length ; i++){
		if (document.getElementById(id).options[i].text == option_name)
			document.getElementById(id).remove(i);
			break;
	}
}

function select_tab(e){
	var li = document.querySelectorAll("#varbar > ul > li");
	for(var i = 0; i < li.length; i++){
		li[i].removeAttribute("id");
	}
	e.target.parentElement.setAttribute("id","selected");
	if(e.target.innerHTML=="new"){
		//select all the TR elements and add display:none
		//to those with id="uploaded"
	}else if(e.target.innerHTML=="uploaded"){
		//select all the TR elements and add display:none
		//to those with id="new"
	}else{
		//display all
	}
}