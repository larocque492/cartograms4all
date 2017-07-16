
<?php

    if(!empty($_POST['data'])){
        $session_file_name = "settings/";
        $session_id = $_POST['name'];
        $session_file_name .= ($session_id .= ".json");
        $session_file_string = file_get_contents($session_file_name);
        return $session_file_string;
    }else{
        return null;
    }
?>
