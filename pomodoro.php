<?php

$pomoJSON = 'pomoodoro.json';

$name = $_POST['name'];
$work_time = $_POST['worktime'];
$short_time = $_POST['shorttime'];
$long_time = $_POST['longtime'];
$color = $_POST['color'];

// Create an array with the received data
$newData = array(
    'name' => $name,
    'worktime' => $work_time,
    'shortime' => $short_time,
    'longtime' => $long_time,
    'color' => $color
);

$pomoData = file_get_contents($pomoJSON);

$data = json_decode($pomoData, true);

$data[] = $newData;

$pomoData = json_encode($data, JSON_PRETTY_PRINT);

file_put_contents($pomoJSON, $pomoData);

echo 'Data saved successfully!';
?>