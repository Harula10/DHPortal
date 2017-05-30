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
		<link rel="stylesheet" type="text/css" href="../css/harm.css">
		<link rel="stylesheet" type="text/css" href="../css/style.css">
		<script type="text/javascript" src ="../js/variable_f.js"></script>
		<script type="text/javascript" src ="../js/harm_f.js"></script>
		<script type="text/javascript" src ="../js/functions.js"></script>
		<script type="text/javascript" src ="../js/group_f.js"></script>
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
				<li class="disabled"><a class="navlink"><font color="gray">Upload meta-data(JSON)</font></a></li>
				<li class="disabled"><a class="navlink"><font color="gray">Download meta-data(JSON)</font></a></li>
				<li><input type="file" onchange="getFile()"  accept=".csv" id="inputfilecsv"/><a class="navlink">Upload Variables(CSV)</a></li>
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
		<div id="left-side">
			<div id="groups">
				<svg></svg>
			</div>
			<div id="group-info">
				<table id="table">
					<tr id="title">
					<th>Code</th>
					<th>Label</th>
					<th>Parent</th>
					<th>Description</th>
					</tr>
					<tr>
					<td></td><td></td> 
					<td></td><td></td>
					</tr>
				</table>
			</div>
			<div id="var-info">
				<table id="table">
					<tr id="title">
						<th>Code</th>
						<th>Label</th> 
						<th>Type</th>
						<th>Methodology</th>
						<th>Description</th>
					</tr>
					<tr>
					<td></td><td></td> 
					<td></td><td></td>
					<td></td>
				  </tr>
				</table>
			</div>
		</div>
		<div id="right-side">
			<div id="variables" align="center">
				<table id="table">
				  <tr id="title">
					<th>Selected Variable</th>
					<th>Match with Variable...</th>
					<th>Using the Function...</th> 
					<th>Transform</th>
				  </tr>
				</table>
				<p id="data">No Data.</p>
			</div>
			<div id="matching">
				<button class="field_buttons" onclick="clearDataa()" type="button">Clear</button>
			</div>
		</div>
	</body>
</html>