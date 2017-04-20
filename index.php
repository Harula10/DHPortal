<?php
	session_start();
?>
<!DOCTYPE html>
<html>
	<head>
		<title>A Data Harmonization Portal</title>
		<link rel="stylesheet" type="text/css" href="css/index.css">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<script type="text/javascript" src ="js/init.js"></script>
		<script type="text/javascript" src ="js/index_v.js"></script>
		<script type="text/javascript" src ="js/index_g.js"></script>
		<script type="text/javascript" src ="js/navigation.js"></script>
		<script src="https://d3js.org/d3.v4.min.js"></script>
	</head>
	<body>
	<?php
		if(!isset($_SESSION["logged_user"])){
			echo '<div id="login">
					<p>Welcome to DHPortal!</p><br><br>
					E-mail: <input class="data" type="text"><br><br>
					Password: <input class="data" type="password"><br><br>
					<br><br>
					<button class="but" onclick="register()">Register</button> <button class="but log" onclick="login()">Log In</button>
				</div>';
		}
	?>
	
	<div id="elements">
		<div>
			<nav id="bar">
				<ul>
				  <li><input type="file" onchange="getFile(event,'inputfile')"  accept=".json" id="inputfile"/><a class="navlink">Upload meta-data(JSON)</a></li>
				  <li><a class="navlink">Download meta-data(JSON)</a></li>
				  <li><input type="file" onchange="getFile(event,'inputfilecsv')"  accept=".csv" id="inputfilecsv"/><a class="navlink">Upload Variables(CSV)</a></li>
				</ul>
			</nav>
		</div>
		
		<div id="body">
			<div class="panels" id="groups">
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
			<a id="logout" href="others/logout.php">Log out</a>
		</div>   
	</div>
	</body>
</html>