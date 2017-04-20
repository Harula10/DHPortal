<?php	
	$action = $_GET['action'];
	$email = $_GET['email'];
	$password = $_GET['password'];
	
	session_start();
	include("database.php");
	
	$db = new database();
	$db->setConn();
	
	if($action=='insert'){
		$sql="SELECT * FROM users WHERE email='".$email."';";
		$obj = $db->fetch_obj($sql);
		if($obj==NULL){
			$sql="INSERT INTO users(email,password) VALUES ('".$email."','".$password."');";
			$result = mysqli_query($conn,$sql);
			$_SESSION['logged_user'] = "$email";
			echo "You successfully signed up!";
		}else{
			echo "This user already exists!";
		}	
	}else{ //if action=session
		$sql="SELECT * FROM users WHERE email='".$email."' AND password='".$password."';";
		$obj = $db->fetch_obj($sql);
		if($obj==NULL){
			echo "Wrong e-mail or password!";
		}else{
			$_SESSION['logged_user'] = "$obj->email";
			echo "Connected Successfully!";
		}		
	}
	$db->closeConn();
?>