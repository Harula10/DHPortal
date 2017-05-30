<?php
	session_start();
	if(isset($_SESSION["logged_user"])){
		$username = $_SESSION["logged_user"];
	}else{
		$username = "";
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>A Data Harmonization Portal</title>
		<link rel="stylesheet" type="text/css" href="../css/main.css">
		<link rel="stylesheet" type="text/css" href="../css/style.css">
		<script type="text/javascript" src ="../js/friend_f.js"></script>
		<script type="text/javascript" src ="../js/variable_f.js"></script>
		<script type="text/javascript" src ="../js/group_f.js"></script>
		<script type="text/javascript" src ="../js/menu_f.js"></script>
		<script src="https://d3js.org/d3.v4.min.js"></script>
	</head>
	<body>
		<div id="sidenav" class="sidenav">
			<h2><?php echo "Hello, ".$username."!"; ?></h2>
			<ul>
				<li><a href="home.php">Home</a></li>
				<li><a href="myfriends.php">My friends</a></li>
				<li><a href="harmonization.php">Harmonize data</a></li>
				<br><br><br>
				<li><input type="file" onchange="getFile('inputfile')"  accept=".json" id="inputfile"/><a class="navlink">Upload meta-data(JSON)</a></li>
				<li><a class="navlink">Download meta-data(JSON)</a></li>
				<li><input type="file" onchange="getFile('inputfilecsv')"  accept=".csv" id="inputfilecsv"/><a class="navlink">Upload Variables(CSV)</a></li>
				<br><br>
				<div class="dropdown">
					<li><a class="navlink">Load meta-data</a></li>
					<div class="dropdown-content" onmouseout="hidemenu(0)">
						<a onclick="loadData('private')" onmouseover="showload()">From your private folder...</a>
						<a onclick="loadData('public')" onmouseover="showload()">From your public folder...</a>
					</div>
				</div><br>
				<div class="dropdown">
					<li><a class="navlink">Save meta-data</a></li>
					<div class="dropdown-content" onmouseout="hidemenu(1)">
						<a onclick="shareData('private')" onmouseover="showshare()">To your private folder...</a>
						<a onclick="shareData('public')" onmouseover="showshare()">To your public folder...</a>
					</div>
				</div>
				<br><br><br>
				<li><a href="logout.php" onclick="clearStorage()">Log out</a></li>
			</ul>
		</div>
		<div id="folders">
			<span onclick="document.getElementById('folders').style.display='none'" class="close">×</span>
			<div id="files">
			</div>
		</div>
		<div id="body">
			<div class="panels" id="groups">
			<button class="clear" onclick="clearData()">Clear all data</button>
			<svg></svg>
			</div>
			<div class="panels" id="variables" align="center">
				<nav id="varbar">
					<ul>
						<li id="selected"><a>All Variables</a></li>
						<li><a>Uploaded</a></li>
						<li><a>New</a></li>
					</ul>
				</nav>
				<table id="table">
				  <tr id="title">
					<th>Code</th>
					<th>Label</th> 
					<th>Type</th>
					<th>Group</th>
					<th>Methodology</th>
					<th>Description</th>
				  </tr>
				</table>
				<p id="data">No Data.</p>
			</div>
			<div class="panels" id="insert_group">
				<form id="formG" onchange="changeAttrG()">
				<fieldset>
					<legend><strong>Selected Group</strong></legend>
					Code<font color="red"><b>*</b></font>: <input class="groups requiredField" type="text"><br><br>
					Label<font color="red"><b>*</b></font>: <input class="groups requiredField" type="text"><br><br>
					Parent: <select  id="select" class="groups"><option value="None">None</option></select><br><br>
					Description: <textarea rows="5"  class="groups"></textarea><br><br><br><br><br><br><br>
					<button class="field_buttons" id="resG" type="button">Reset</button>
					<button class="field_buttons" id="delG" type="button" disabled>Delete</button>
					<button class="field_buttons" id="saveG" type="button">Save</button>
				</fieldset>
				</form>
			</div>
			
			<div class="panels" id="insert_var">
				<form id="formV" onchange="changeAttrV()">
				<fieldset>
					<legend><strong>Selected Variable</strong></legend>
					Code<font color="red"><b>*</b></font>: <input class="vars requiredField" type="text"><br><br>
					Label<font color="red"><b>*</b></font>: <input class="vars requiredField" type="text"><br><br>
					Type: <select class="vars">
							<option selected value="Polynominal">Polynominal</option>
							<option value="Binominal">Binominal</option>
							<option value="Real">Real</option>
						  </select><br><br>
					Group: <select id="select2" class="vars"><option value="None">None</option></select><br><br>
					Description: <textarea rows="5" class="vars"></textarea><br><br><br><br><br><br>
					Methodology: <input class="vars" type="text"><br><br><br>
					<button class="field_buttons" id="resV" type="button">Reset</button>
					<button class="field_buttons" id="delV" type="button" disabled>Delete</button>
					<button class="field_buttons" id="saveV" type="button">Save</button>
				</fieldset>
				</form>
			</div>
		</div>  
	</body>
</html>