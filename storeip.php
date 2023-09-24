<?php 
error_reporting(0);
$path = __DIR__ . '/visitors.txt'; // Add a directory separator before 'visitors.txt'
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
$data = file_get_contents($path) . $ip . PHP_EOL;
file_put_contents($path, $data);
?>



