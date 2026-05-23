<?php

$file = 'ucapan.json';

$data = [];

if(file_exists($file)){

    $json = file_get_contents($file);

    $data = json_decode($json, true);

}

?>

<!DOCTYPE html>
<html>
<head>

<title>Data RSVP</title>

<style>

body{
  font-family:Arial;
  background:#f5f5f5;
  padding:20px;
}

table{
  width:100%;
  border-collapse:collapse;
  background:white;
}

th, td{
  border:1px solid #ddd;
  padding:12px;
}

th{
  background:#111827;
  color:white;
}

</style>

</head>
<body>

<h1>Data RSVP</h1>

<table>

<tr>
<th>No</th>
<th>Nama</th>
<th>Jumlah</th>
<th>Status</th>
<th>Ucapan</th>
<th>Waktu</th>
</tr>

<?php

$no = 1;

foreach(array_reverse($data) as $row){

echo "

<tr>

<td>$no</td>

<td>{$row['nama']}</td>

<td>{$row['jumlah']}</td>

<td>{$row['status']}</td>

<td>{$row['ucapan']}</td>

<td>{$row['waktu']}</td>

</tr>

";

$no++;

}

?>

</table>

</body>
</html>