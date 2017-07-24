<?php

$csvString = readFromFile();
writeToFile($csvString);

function writeToFile($stringToWrite){
    $session_id = $_POST['userID'];
    $session_file_location = "upload/";
    $session_file_location .= ($session_id .= ".csv");
    file_put_contents($session_file_location, $stringToWrite);
}

function readFromFile(){
  if(!empty($_POST['name'])){
    $csvName .= $_POST['otherFileName'];
    $session_file_string = file_get_contents($csvName);
    return ($session_file_string);
  }
}
exit();

?>