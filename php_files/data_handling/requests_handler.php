<?php	
	$action = $_GET['action'];
	$name = $_GET['search'];
	
	session_start();
	include("database_handler.php");
	
	$db = new Database();
	$db->setConn();
		
	if($action=="search"){
		$query="SELECT * FROM users WHERE username='".$name."' OR email='".$name."';";
		$result = $db->numofRows($query);
		if($result==0 || $_SESSION["logged_user"]==$name){ //there is no user with that name
			echo "no";
		}else{
			echo "yes";
		}
	}else{
		$query="SELECT * FROM friendships WHERE from_user='".$_SESSION["logged_user"]."' AND to_user='".$name."';";
		$result = $db->numofRows($query);
		if($result==0 || $_SESSION["logged_user"]==$name){ //the request doesnot exist
			$sql="INSERT INTO friendships(from_user,to_user) VALUES ('".$_SESSION["logged_user"]."','".$name."');";
			$result = mysqli_query($conn,$sql);
		}else{
			echo "no";
		}
	}
	$db->closeConn();
?>