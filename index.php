
<?php 

if (!isset($_COOKIE['c4a_session_id'])) {
    $new_id = session_create_id();
    setcookie("c4a_session_id", $new_id, 8251005, '/');
}

header( 'Location: /app/index.html' ); 
?>