
<?php 
    $session_file_name = "../settings/";
    $session_file_name .= ($session_id .= ".json");
    $session_file_string = file_get_contents($session_file_name);
    return $session_file_string;
?>
