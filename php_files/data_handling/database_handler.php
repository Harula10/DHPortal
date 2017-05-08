<?php
	class Database{
		var $conn;
		
		function setConn(){
			global $conn;
			$servername = "localhost";
			$username = "root";
			$password = "";

			// Create connection
			$conn = new mysqli($servername, $username, $password);
			// Check connection
			if ($conn->connect_error) {
				die("Connection failed: " . $conn->connect_error);
			} 
			mysqli_select_db($conn,"dh_users");
		}
		
		function fetch_obj($query){
			global $conn;
			$result = $conn->query($query);
			$row = $result->fetch_object();
			return $row;
		}
		
		function numofRows($query){
			global $conn;
			$result = $conn->query($query);
			$num_rows = $result->num_rows;
			return $num_rows;
		}
		
		function getConn(){
			global $conn;
			return $conn;
		}
		
		function closeConn(){
			global $conn;
			$conn->close();
		}
	}
?>