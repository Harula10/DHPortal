<?php	
	session_start();
	$action = $_GET['action'];
	$folder = $_GET['path'];
	$data = $_GET['data'];
	
	if($action=="upload"){
		$path = "../users/".$_SESSION["logged_user"]."/".$folder;
		$files = scandir("../".$path); //$files: an array with filenames
		for ($i = 2; $i < count($files); $i++) {
			echo "<div onclick=\"chooseFile('".$path."/".$files[$i]."')\"><img src=\"../img/file.png\">".$files[$i]."</div>";
		}
	}else if($action=="share"){
		$path = "../users/".$_SESSION["logged_user"]."/".$folder;
		$file = fopen("../".$path,"w");
		fwrite($file,$data);
		fclose($file);
		echo "Meta-data has been saved!";
	}else if($action=="loadfriendfile"){
		include('database_handler.php');
		$db = new Database();
		$db->setConn();
					
		$query="SELECT * FROM users WHERE username='".$folder."';"; //checks if that user is an admin
		$result=mysqli_query($conn,$query);
		$obj=mysqli_fetch_object($result);
		if($obj->rights==1){
			$path = "../users/".$folder."/private"; //$folder: 'friend_username'
			$files = scandir("../".$path); //$files: the array with friend filename folders
			for ($i = 2; $i < count($files); $i++) {
			echo "<div onclick=\"chooseFFile('".$path."/".$files[$i]."')\"><img src=\"../img/file.png\">".$files[$i]."</div>";
			}
		}
		$path = "../users/".$folder."/public"; //$folder: 'friend_username'
		$files = scandir("../".$path); //$files: the array with friend filename folders
		for ($i = 2; $i < count($files); $i++) {
			echo "<div onclick=\"chooseFFile('".$path."/".$files[$i]."')\"><img src=\"../img/file.png\">".$files[$i]."</div>";
		}
		$db->closeConn();
	}else if($action=="sharecsv"){
		$path = "../users/".$_SESSION["logged_user"]."/".$folder;
		$file = fopen("../".$path,"w");
		$lines = explode("<br>", $data); 
		for ($i = 0; $i < count($lines); $i++) {
			//split each $lines[$i] 3 times. the third one use a function to edit
			//the transformation
            fwrite($file,$lines[$i]."\n");
        }
		fclose($file);
		echo "Meta-data has been saved!";
	}
?>