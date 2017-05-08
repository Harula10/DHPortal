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
		<style>.sidenav .disabled:hover{
					background-color: #b3e6ff;
					cursor: default;
				}
		</style>
		<script type="text/javascript" src ="../js/friend_f.js"></script>
	</head>
	<body>
		<div id="sidenav" class="sidenav">
			<h2><?php echo "Hello, ".$username."!"; ?></h2>
			<ul>
				<li><a href="home.php">Home</a></li>
				<li><a href="myfriends.php">My friends</a></li>
				<br><br><br>
				<li class="disabled"><a class="navlink"><font color="gray">Upload meta-data(JSON)</font></a></li>
				<li class="disabled"><a class="navlink"><font color="gray">Download meta-data(JSON)</font></a></li>
				<li class="disabled"><a class="navlink"><font color="gray">Upload Variables(CSV)</font></a></li>
				<br><br>
				<li class="disabled"><a class="navlink"><font color="gray">Load meta-data</font></a></li>
				<li class="disabled"><a class="navlink"><font color="gray">Save meta-data</font></a></li>
				<br><br><br>
				<li><a href="logout.php">Log out</a></li>
			</ul>
		</div>
		<div id="folders">
			<span onclick="document.getElementById('folders').style.display='none'" class="close">×</span>
			<div id="files">
			</div>
		</div>
		<div id="body">
			<input type="text" name="search" placeholder="Search..">
			<button id="search" type="button" onclick="search()">Go</button>
			<br><br><br><br>
			<fieldset id="friends">
				<legend id="legend">My Community</legend>
				<?php
					include('data_handling/database_handler.php');
					$db = new Database();
					$db->setConn();
					
					$query="SELECT * FROM friendships WHERE from_user='".$username."';";
					$result = $conn->query($query);
									
					foreach($result as $row1) {
						$query2 = "SELECT * FROM friendships WHERE from_user='".$row1['to_user']."' AND to_user='".$username."';";
						$result2 = $conn->query($query2);
						foreach($result2 as $row2) {
							echo "<div onclick=\"friendsfiles('".$row2['from_user']."')\"><img src=\"../img/friend.ico\">".$row2['from_user']."</div>";
						}
					}
					$db->closeConn();
				?>
			</fieldset>
		</div>   
	</body>
</html>