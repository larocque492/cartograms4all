<?php
$foo = "Running: import_settings.php";
debug_to_console($foo);
function writeSettingsFile(){
    if(!empty($_POST['data'])){
        $settings_string = $_POST['data'];
        $session_file_name = "settings/";
        $session_id = $_POST['name'];
        $session_file_name .= ($session_id .= ".json");
        file_put_contents($session_file_name, $settings_string);
    }
}
function debug_to_console( $data ) {
    $output = $data;
    if ( is_array( $output ) )
        $output = implode( ',', $output);

    echo "<script>console.log( 'Debug Objects: " . $output . "' );</script>";
}

writeSettingsFile();

?>