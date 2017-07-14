
<?php

function debug_to_console($data){
    $output = $data;
    if ( is_array($output) )
        $output = implode('i',$output);
    echo "<script>Debug Objects: " . $output . " );</script>";
}

if (!isset($_COOKIE['c4a_session_id'])) {

    $characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    $new_id = '';
    $max = strlen($characters) - 1;
    for ($i = 0; $i < 16; $i++) {
        $new_id .= $characters[mt_rand(0, $max)];
    }

    debug_to_console($new_id);

    setCookie('c4a_session_id', $new_id, 8251005, '/');

}

header( 'Location: /app/index.html' ); 
?>