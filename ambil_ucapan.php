<?php

header('Content-Type: application/json');

$db = new SQLite3('database.sqlite');

$result = $db->query(
"SELECT * FROM rsvp ORDER BY id DESC"
);

$data = [];

while($row = $result->fetchArray(SQLITE3_ASSOC)){

    $data[] = $row;

}

echo json_encode($data);

?>