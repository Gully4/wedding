<?php

header('Content-Type: application/json');

$file = 'ucapan.json';

if(file_exists($file)){

    $json = file_get_contents($file);

    echo $json;

} else {

    echo json_encode([]);

}

?>