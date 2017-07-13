<?php
//PHP snippet to serve cookie
//The logic of the cookie will be use as a way to track setting to init

//Setting Current session ID 
//TODO: Replace session_id by getSessionID from Luke
$currentSessionId = "10" //session_id();

$cookie_name = "user_profile"

$expires = (86400 * 30);


//Generic function to set information in user's cookie
function set_cookie($cookie_name, $sessionId, $expiration){
  $expiration = $expiration + time();
  setcookie($cookie_name, $sessionId, $expiration, "/");

}

set_cookie($cookie_name, $currentSessionId, $expires);
?>
