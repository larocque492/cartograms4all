
<?php 

function writeSettingsFile($session_id, $settings_string){
    set_include_path('/settings');
    $session_file_name = ($session_id .= ".json");
    file_put_contents($session_file_name, $settings_string, FILE_USE_INCLUDE_PATH);
}

?>