
<<<<<<< HEAD
<?php header( 'Location: /app/index.html' ); ?>
=======
<?php 

if (!isset($_COOKIE['user_session_id'])) {
    $new_id = session_create_id();
    setCookie("user_session_id", $new_id, 8251005, '/');
    exit();
}

header( 'Location: /app/index.html' ); 
?>
>>>>>>> 6d05c053d7b4e7bd336d6ab4a7008aea93766e4e
