
<?php 
echo "before if";
if (!isset($_COOKIE['c4a_session_id'])) {
    echo "in if";
    $new_id = session_create_id();
    setCookie("c4a_session_id", $new_id, 8251005, '/');
    exit();
}
echo "after if";

header( 'Location: /app/index.html' ); 
?>