
<?php 
echo "before if ";
if (!isset($_COOKIE['c4a_session_id'])) {

    echo "in if before new_id ";

    $characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    $new_id = '';
    $max = strlen($characters) - 1;
    for ($i = 0; $i < 16; $i++) {
        $new_id .= $characters[mt_rand(0, $max)];
    }
    echo "in if after new_id";

    //setCookie("c4a_session_id", $new_id, 8251005, '/');

    echo "in if after c4a_session_id";
}
echo "after if";

header( 'Location: /app/index.html' ); 
?>