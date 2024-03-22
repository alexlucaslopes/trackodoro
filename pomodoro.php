<?php

$pomoJSON = 'pomodoro.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request for loading schedules
    $pomoData = file_get_contents($pomoJSON);
    echo $pomoData;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle POST request for creating and saving schedules
    $name = $_POST['name'];
    $work_time = $_POST['worktime'];
    $short_time = $_POST['shorttime'];
    $long_time = $_POST['longtime'];
    $color = $_POST['color'];
    $trackodoroNum = $_POST['trackodoros'];

    // Create an array with the received data
$newData = array(
    'name' => $name,
    'worktime' => intval($work_time),
    'shorttime' => intval($short_time),
    'longtime' => intval($long_time),
    'color' => $color,
    'trackodoros' => $trackodoroNum // Initialize trackodoros to 0 for new schedules
);


    $pomoData = file_get_contents($pomoJSON);

    $data = json_decode($pomoData, true);

    $data[] = $newData;

    $pomoData = json_encode($data, JSON_PRETTY_PRINT);

    file_put_contents($pomoJSON, $pomoData);

    echo 'Data saved successfully!';
}

?>
