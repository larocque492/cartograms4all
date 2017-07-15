
<?php 

function readSettingsFile($session_id){
    $session_file_name = "../settings/";
    $session_file_name .= ($session_id .= ".json");
    $session_file_string = file_get_contents($session_file_name);
    return $session_file_string;
}

if(!empty($_POST['data'])){
    $data = $_POST['data'];
    $fname = mktime() . ".txt";//generates random name

    $file = fopen("upload/" .$fname, 'w');//creates new file
    fwrite($file, $data);
    fclose($file);
}


writeSettingsFile(1110,$input_string);

//$output_string = readSettingsFile(1100);

//echo $output_string;

?>
