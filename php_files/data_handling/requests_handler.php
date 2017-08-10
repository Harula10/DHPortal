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
	}else if($action=="unfriend"){
		$query="DELETE FROM friendships WHERE from_user='".$_SESSION["logged_user"]."' AND to_user='".$name."';";
		$result = mysqli_query($conn,$query);
		//delete both friendship pairs
		$query="DELETE FROM friendships WHERE to_user='".$_SESSION["logged_user"]."' AND from_user='".$name."';";
		$result = mysqli_query($conn,$query);
		echo "The friend has been removed from your community.";
	}else if($action=="show"){
		$query="SELECT from_user FROM friendships WHERE to_user='".$_SESSION["logged_user"]."' AND from_user NOT IN (SELECT to_user FROM friendships
		WHERE from_user='".$_SESSION["logged_user"]."');";
		/* fetch object array */
		$innerHTML = "";
		if ($result=mysqli_query($conn,$query)){
			while ($obj=mysqli_fetch_object($result)){
				$innerHTML = $innerHTML." <div>".$obj->from_user."
				<p id='accept' onclick=\"request('".$obj->from_user."',false)\">Accept</p>
				<p id='unfriend' onclick=\"unfriend('".$obj->from_user."',false)\">Decline</p>
				</div>";
			}
			echo $innerHTML;
			// Free result set
			mysqli_free_result($result);
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