<?php
$host = "localhost";
$port = 3306;      
$user = "root";    
$pass = "";        // пустой пароль
$db   = "draftosaurus";

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Ошибка подключения к базе данных: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
