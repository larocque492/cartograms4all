<?php 

//Set sessionID per user on the site before redirecting to main page
if (!isset($_COOKIE['user_session_id'])) {
    //$new_id = session_create_id();
    $new_id = "1000";
    setCookie("user_session_id", $new_id, 8251005, '/');
}

header( 'Location: /app/index.html' ); 
?>
