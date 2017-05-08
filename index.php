<?php
	session_start();
?>
<!DOCTYPE html>
<html>
	<head>
		<title>A Data Harmonization Portal</title>
		<link rel="stylesheet" type="text/css" href="css/index.css">
		<script type="text/javascript" src ="js/initialization_f.js"></script>
	</head>
	<body>
	<div id="login">
		<p>Welcome to DHPortal!</p><br><br>
		Username: <input class="data" type="text"><br><br>
		E-mail: <input class="data" type="text"><br><br>
		Password: <input class="data" type="password"><br><br>
		<br><br>
		<button class="but" onclick="register()">Register</button> <button class="but log" onclick="login()">Log In</button>
	</div>
	</body>
</html>