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
		$path = "../users/".$folder; //$folder: 'friend_username/public'
		$files = scandir("../".$path); //$files: the array with friend filename folders
		for ($i = 2; $i < count($files); $i++) {
			echo "<div onclick=\"chooseFFile('".$path."/".$files[$i]."')\"><img src=\"../img/file.png\">".$files[$i]."</div>";
		}
	}else if($action=="sharecsv"){
		$path = "../users/".$_SESSION["logged_user"]."/".$folder;
		$file = fopen("../".$path,"w");
		$lines = explode("<br>", $data); 
		for ($i = 0; $i < sizeof($lines); $i++) {
			//split each $lines[$i] 3 times. the third one use a function to edit
			//the transformation
		
            fwrite($file,$lines[$i]."\n");
        }
		fclose($file);
		echo "Meta-data has been saved!";
	}
?>