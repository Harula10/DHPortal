/*
	SVG INITIALIZER
*/
var JSONobj;
var codes = [];
var init = true;
var svg;
var pack;
var color;
var	diameter = 620;
var page;

function initializeSVG(p){
	page = p;
	svg = d3.select("svg").append("g").attr("transform", "translate(" + (diameter+70)/2 + "," + (diameter-50)/2 + ")");
}

function showdetails(node){
	var row = document.querySelectorAll("#table tr + tr");
	if(node.methodology){ //if the node is a variable
		var td = row[1].childNodes;
		td[0].innerHTML = node.code;
		td[1].innerHTML = node.label;
		td[2].innerHTML = node.type;
		td[3].innerHTML = node.methodology;
		td[4].innerHTML = node.description;
	}else{
		var td = row[0].childNodes;
		td[0].innerHTML = node.code;
		td[1].innerHTML = node.label;
		td[2].innerHTML = node.parent;
		td[4].innerHTML = node.description;
	}
}

/*
	GROUP FUNCTIONS
*/

function resetG(){
	document.getElementById("formG").reset();
	if(flagG){
		document.querySelector("#saveG").disabled = false;
		document.querySelector("#delG").disabled = true;
	}
	if(document.getElementById("select").length > 1)
		draw();
	flagG = false;
}

var flagG = false;
function changeAttrG(){
	if(flagG){
		document.querySelector("#saveG").disabled = false;
	}
}

function deleteG(){
	if (confirm("Are you sure you want to delete this group?")) {
		codes.splice(codes.indexOf(selected.label), 1);
		clearTable(selected.label);
		var found = search(JSONobj,selected,true);
		if(found){
			for(var i = 0; i < found.children.length;i++){
				if(found.children[i].code == selected.code){ //we found the child we should delete;
					hasgroupchild(found.children[i].children,selected);
					found.children.splice(i, 1);
					break;
				}
			}
		}else{ //is a root element
			for(var i = 0; i < JSONobj.length;i++){
				if(JSONobj[i].code == selected.code){ //we found the child we should delete
					//if that child has a group child then....
					hasgroupchild(JSONobj[i].children,selected);
					JSONobj.splice(i, 1);
					break;
				}
			}
		}
		delete_option("select",selected.label);
		delete_option("select2",selected.label);
		document.getElementById("formG").reset();	
		draw();
	}
}

function clearTable(label){
	var table = document.getElementById("table").rows;
	for(var i = 1; i < table.length ; i++ ){
		if(table[i].cells[3].innerHTML == label){
			table[i].className = 'new';
			table[i].cells[3].innerHTML = "";
		}
	}
}

function hasgroupchild(json,selected){
	for (obj in json){
        var node = json[obj]; 
		if (selected.label == node.parent){
			delete_option("select",node.label);
			delete_option("select2",node.label);
			clearTable(node.label);
		}
        if (node.children){
            if(hasgroupchild(node.children,node)) return true;
        }
    }
    return false;
}

var selected;
function fillformG(d){
	flagG = true;
	var groups = document.querySelectorAll(".groups");
	groups[0].value = d.code;
	groups[1].value = d.label;
	groups[2].value = d.parent;
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
	codes[selected.label] = node.label;
	var found = search(JSONobj,selected,true);
	if(!found){ //if the parent is the root
		for(var i = 0; i < JSONobj.length;i++){
			if(JSONobj[i].code == selected.code){ //we found the child we should delete
				if(JSONobj[i].parent == node.parent){
					JSONobj[i].code = node.code;
					JSONobj[i].label = node.label;
					JSONobj[i].description = node.description;
				}else{
					node.children = [];
					node.children = JSONobj[i].children.slice();
					JSONobj.splice(i, 1);
					found = search(JSONobj,node,true); //search the new parent and insert the edited node
					found.children.push(node);
					if(JSON.stringify(found.children[0], null, ' ')=="{}")
						found.children.splice(0, 1);
				}
				break;
			}
		}
	}else{ //if the parent is a node
		for(var i = 0; i < found.children.length;i++){
			if(found.children[i].code == selected.code){ //we found the child we should delete
				if(found.children[i].parent == node.parent){
					found.children[i].code = node.code;
					found.children[i].label = node.label;
					found.children[i].description = node.description;
				}else{
					node.children = [];
					node.children = found.children[i].children.slice();
					found.children.splice(i, 1);
					var par = search(JSONobj,node,true); //search the new parent and insert the edited node
					if(par){
						par.children.push(node);
						if(JSON.stringify(par.children[0], null, ' ')=="{}")
							par.children.splice(0, 1);
					}else{
						JSONobj.push(node);
					}
				}
				break;
			}
		}
	}
	delete_option("select",selected.label);
	delete_option("select2",selected.label);
	flag = false;
}

function saveG(){
	if(checkrequired("groups requiredField")){ //if the required fields are not filled
		return;
	}
	var groups = document.querySelectorAll(".groups");
	if(flagG){ //if you need to edit a group
		if(confirm("Are you sure you want to edit this group?")){
			editG();
		}else{
			resetG();
			return;
		}
	}else{
		//if the "code" already exists don't add that group
		if(if_exists(groups[0].value)){
			alert("The group with the code '"+groups[0].value+"' already exists.");
			return;
		}else{
			codes.push(groups[1].value);
			var node = {
				"code" : groups[0].value,
				"label" : groups[1].value,
				"parent" : groups[2].value,
				"description" : groups[3].value,
				"children" : [{}]
			};
			if(groups[2].value == "None"){
				JSONobj.push(node);	
			}else{
				var found = search(JSONobj,node,true);
				found.children.push(node);
				if(JSON.stringify(found.children[0], null, ' ')=="{}"){
					found.children.splice(0, 1);
				}
			}
		}
	}
	draw();
	add_option(document.getElementById("select"),groups[1].value);
	add_option(document.getElementById("select2"),groups[1].value);
	
	document.getElementById("formG").reset();
}

var circle;
var focus;
var text;
function draw(){
	localStorage.JSONobj =  JSON.stringify(JSONobj);
	var str = localStorage.JSONobj;
	var new_str = "{ \"label\": \"None\", \"children\":" + str +"}";
	var json = JSON.parse(new_str);
	
	svg.selectAll("circle").remove();
	svg.selectAll("text").remove();
	
	var color = d3.scaleLinear()
		.domain([0, tree_length(json)])
		.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
		.interpolate(d3.interpolateHcl);

	d3.select("#groups")
			.on("click", function() {
				zoom(json);
			});
		
	var pack = d3.pack()
			.size([diameter, diameter])
			.padding(10);
		
	json = d3.hierarchy(json)
      .sum(function(d) { return 100; })
      .sort(function(a, b) { return b.value - a.value; });

	focus = json;
	var nodes = pack(json).descendants();
	
	circle = svg.selectAll("circle")
			.data(nodes)
			.enter().append("circle")
			.attr("class", function(d) {
					return d.parent ? "node":"node node--root";
			})
			.style("fill", function(d) {
				return d.children ? color(d.depth) : '#FFF';
			})
			.style("stroke", "gray")
			.text(function(d) {
				return d.label;
			})
			.on("click", function(d) { 
				if (focus !== d){	
					if(d.data.type){ 
						if(page==1){
							findVar(d.data);
						}else{
							showdetails(d.data);
						}
						zoom(d.parent);
					}else{ 
						if(d.children){
							if(page==1){
								fillformG(d.data);
							}else{
								showdetails(d.data);
							}
							zoom(d);
						}else{
							zoom(d.parent);
						}
					}
					d3.event.stopPropagation();
				}
			});
	
	text = svg.selectAll("text")
			.data(nodes)
			.enter().append("text")
			.attr("class", "label")
			.style("display", function(d) {
				return d.parent === json ? "inline" : "none";
			})
			.style("fill-opacity", function(d) {
				return d.parent === json ? 1 : 0;
			})
			.style("font-size", "15px")
			.text(function(d) {
				return d.data.label ? d.data.label : "Empty Group";
			});
	
	zoomTo([json.x, json.y, json.r * 2 + 80]);
}

var view;
function zoomTo(v) {
	var node = svg.selectAll("circle,text");
	var k = diameter / v[2];
	view = v;
	node.attr("transform", function(d) {
			return "translate(" + (d.x - v[0])*k + "," + (d.y - v[1])*k  + ")";
	});
	circle.attr("r", function(d) {
			return d.r * k;
	});
}

function zoom(d) {
	var focus0 = focus;
	focus = d;
	if(d.children){
		var transition = d3.transition()
				.duration(d3.event.altKey ? 5000 : 750)
				.tween("zoom", function(d) {
						var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + 50]);
						return function(t) {
							zoomTo(i(t));
						};
				});
			
		transition.selectAll("text")
			.filter(function(d) {
				return d.parent === focus || this.style.display === "inline";
			})
			.style("fill-opacity", function(d) {
				return d.parent === focus ? 1 : 0;
			})
			.on("start", function(d) {
				if (d.parent === focus) this.style.display = "inline";
			})
			.on("end", function(d) {
				if (d.parent !== focus) this.style.display = "none";
			});
	}
}

//find the parent that has to add the new child (_node) if f = true
//find the group that has to add the var (_node) if f=false
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
            var sub_json = search(node.children,_node,_flag);
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

function add_option(element,option_name) {
	var length=element.options.length;
	for ( var i=0; i < length; i++ ) {
		if (element.options[i].text == option_name)  {
			return;
		} 
	}
	element.options[length] = new Option(option_name, option_name);
}

function delete_option(id,option_name){
	var length = document.getElementById(id).options.length;
	for (var i = 0; i < length ; i++){
		if (document.getElementById(id).options[i].text == option_name){
			document.getElementById(id).remove(i);
			break;
		}
	}
}