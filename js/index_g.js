var root;

function deleteG(str){
	/*
		DELETE ALL VARIABLES OF THIS GROUP
	*/
	alert("deleteG");
}

var JSONobj;
function saveG(){
	var groups = document.querySelectorAll(".groups");
	if(groups[2].value=="none"){ //let's create a supergroup!	
		JSONobj = '{"code":"'+groups[0].value+'","label":"'+groups[1].value+'","parent":"'+groups[2].value+
		'","description":"'+groups[3].value+'","children":[]}';
		var root = JSON.parse(JSONobj);
		add_option("select",groups[1].value);
		add_option("select2",groups[1].value);
	}else{
		alert(JSONobj.length);
		for (var i=0; i< JSONobj.length; i++) {
			if (JSONobj[i].label == groups[2].value) { //an vreis parent me ayto to label
				var childe = '{"code":"'+groups[0].value+'","label":"'+groups[1].value+'","parent":"'+groups[2].value+
				'","description":"'+groups[3].value+'","children":[]}';
				root = JSON.parse(JSONobj);
				break;
			}
		}
		add_option("select",groups[1].value);
		add_option("select2",groups[1].value);
	}
	var colors = d3.scale.linear()
			.domain([0, tree_length(root)]).interpolate(d3.interpolateHcl)
			.range([d3.rgb("#33bbff"), d3.rgb('#ffffff')]);

	var pack = d3.layout.pack().size([400, 400])
			.value(function(d) {
				return 100;
			});
	
	var svg = d3.select("#groups").append("svg")
	.attr("width", 600).attr("height", 400);

	var focused = root;
	var nodes = pack.nodes(root);

	var circle = svg.selectAll("circle")
			.data(nodes)
			.enter().append("circle")
			.attr("cx", 330)
			.attr("cy", 180).attr("r", 160)
			.attr("class", function(d) {
					return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
			})
			.style("fill", function(d) {
					if(d.children){return colors(d.depth);}
					//return d.children ? colors(d.depth) : ;
			});

}


function tree_length(root) {
	if(root.children==null){
		return 0;
	}
	if (!root.children) {
		return 1;
	}
	return 1 + d3.max(root.children.map(tree_length));
}

function add_option(id,option_name) {
	var length=document.getElementById(id).options.length;
	for ( var i=0; i < length; i++ ) {
		if (document.getElementById(id).options[i].text == option_name)  {
			return;
		} 
	}
	document.getElementById(id).options[length] = new Option(option_name, length);
}