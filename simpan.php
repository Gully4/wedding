<?php

$file = 'ucapan.json';


/*
|--------------------------------------------------------------------------
| AMBIL IP PENGUNJUNG
|--------------------------------------------------------------------------
*/

function getUserIP() {

    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {

        return $_SERVER['HTTP_CLIENT_IP'];

    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {

        return $_SERVER['HTTP_X_FORWARDED_FOR'];

    } else {

        return $_SERVER['REMOTE_ADDR'];

    }

}


/*
|--------------------------------------------------------------------------
| USER AGENT / DEVICE
|--------------------------------------------------------------------------
*/

$userAgent = $_SERVER['HTTP_USER_AGENT'];

$ip = getUserIP();


/*
|--------------------------------------------------------------------------
| DATA BARU
|--------------------------------------------------------------------------
*/

$dataBaru = [

    "nama" => htmlspecialchars($_POST['nama']),
    
    "jumlah" => htmlspecialchars($_POST['jumlah']),
    
    "status" => htmlspecialchars($_POST['status']),
    
    "ucapan" => htmlspecialchars($_POST['ucapan']),
    
    "waktu" => date("d-m-Y H:i:s"),

    "ip" => $ip,

    "device" => $userAgent

];


/*
|--------------------------------------------------------------------------
| LOAD DATA LAMA
|--------------------------------------------------------------------------
*/

$dataLama = [];

if (file_exists($file)) {

    $json = file_get_contents($file);

    $dataLama = json_decode($json, true);

}


/*
|--------------------------------------------------------------------------
| ANTI SPAM IP
|--------------------------------------------------------------------------
| Maksimal 1 RSVP tiap 1 menit
|--------------------------------------------------------------------------
*/

foreach ($dataLama as $item) {

    if (
        isset($item['ip']) &&
        $item['ip'] == $ip
    ) {

        $lastTime = strtotime($item['waktu']);

        if ((time() - $lastTime) < 60) {

            die("spam");

        }

    }

}


/*
|--------------------------------------------------------------------------
| SIMPAN DATA
|--------------------------------------------------------------------------
*/

$dataLama[] = $dataBaru;

file_put_contents(
    $file,
    json_encode(
        $dataLama,
        JSON_PRETTY_PRINT
    )
);


echo "success";

?>