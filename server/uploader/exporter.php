<?php 

function writeSettingsFile(){
    if(!empty($_POST['data'])){
        $settings_string = $_POST['data'];
        $session_file_name = "upload/";
        $session_id = "123";
        $session_file_name .= ($session_id .= ".json");
        file_put_contents($session_file_name, $settings_string);
    }
}
writeSettingsFile();
?>
