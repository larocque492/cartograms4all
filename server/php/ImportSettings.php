<?php
// write settings string to file on server
if(!empty($_POST['data'])){
    $settings_string = $_POST['data'];
    $session_file_name = "settings/";
    $session_id = $_POST['name'];
    $session_file_name .= ($session_id .= ".json");
    file_put_contents($session_file_name, $settings_string);
}
exit();
?>