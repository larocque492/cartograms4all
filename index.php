
<?php 
echo "before if ";
if (!isset($_COOKIE['c4a_session_id'])) {
    echo "in if before new_id ";
    $new_id = session_create_id();
    echo "in if after new_id";
    setCookie("c4a_session_id", $new_id, 8251005, '/');
    echo "in if after c4a_session_id";
    exit();
}
echo "after if";

header( 'Location: /app/index.html' ); 
?>