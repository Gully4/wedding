<?php

header('Content-Type: application/json');

$db = new SQLite3('database.sqlite');

$db->exec("CREATE TABLE IF NOT EXISTS rsvp (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nama TEXT,
    jumlah TEXT,
    status TEXT,
    ucapan TEXT,

    waktu DATETIME DEFAULT CURRENT_TIMESTAMP

)");

$nama = $_POST['nama'] ?? '';
$jumlah = $_POST['jumlah'] ?? '';
$status = $_POST['status'] ?? '';
$ucapan = $_POST['ucapan'] ?? '';

$stmt = $db->prepare("INSERT INTO rsvp
(nama, jumlah, status, ucapan)

VALUES

(:nama, :jumlah, :status, :ucapan)");

$stmt->bindValue(':nama', $nama, SQLITE3_TEXT);
$stmt->bindValue(':jumlah', $jumlah, SQLITE3_TEXT);
$stmt->bindValue(':status', $status, SQLITE3_TEXT);
$stmt->bindValue(':ucapan', $ucapan, SQLITE3_TEXT);

$result = $stmt->execute();

if($result){

    echo json_encode([
        "success" => true
    ]);

}else{

    echo json_encode([
        "success" => false
    ]);

}

?>