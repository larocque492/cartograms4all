<?php
//PHP snippet to add sessionID from user
//The logic of the cookie will be use as a way to track setting to init

//Setting Current session ID 
//TODO: Replace session_id by getSessionID from Luke
$_currentSessionId = session_id();

$cookie_name = "user_profile"

$_expires = (86400 * 30);

setcookie($cookie_name, $_currentSessionId, time() + $_expires, "/"); //30 days

?>
