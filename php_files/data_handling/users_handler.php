<?php	
	$action = $_GET['action'];
	$username = $_GET['username'];
	$email = $_GET['email'];
	$password = $_GET['password'];
	
	session_start();
	include("database_handler.php");
	
	$db = new Database();
	$db->setConn();
	
	if($action=='insert'){
		$sql2="SELECT * FROM users WHERE username='".$username."';";
		$obj2 = $db->fetch_obj($sql2);
		if($obj2==NULL){
			$sql="SELECT * FROM users WHERE email='".$email."';";
			$obj = $db->fetch_obj($sql);
			if($obj==NULL){
				$sql="INSERT INTO users(username,email,password) VALUES ('".$username."','".$email."','".$password."');";
				$result = mysqli_query($conn,$sql);
				//create user folders in server
				mkdir("../users/".$username, 0777, true);
				mkdir("../users/".$username."/public", 0777, true);
				mkdir("../users/".$username."/private", 0777, true);
				mkdir("../users/".$username."/temp", 0777, true);
				
				//start a session
				$_SESSION['logged_user'] = "$username";
				echo "You successfully signed up!";
			}else{
				echo "This user already exists!";
			}	
		}else{
			echo "This username already exists!";
		}
	}else{ //if action=session
		$sql="SELECT * FROM users WHERE username='".$username."' AND email='".$email."' AND password='".$password."';";
		$obj = $db->fetch_obj($sql);
		if($obj==NULL){
			echo "Wrong e-mail or password!";
		}else{
			$_SESSION['logged_user'] = "$obj->username";
			echo "Connected Successfully!";
		}		
	}
	$db->closeConn();
?>