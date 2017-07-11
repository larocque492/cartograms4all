<?php

$new_id;

if (!isset($_COOKIE['user_session']))
{

    $new_id = session_create_id();
    echo "HELLO";
    exit();
}

?>