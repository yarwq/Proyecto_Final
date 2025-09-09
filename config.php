<?php
$host = "localhost";
$port = 3306;      
$user = "root";    
$pass = "";        //sin contrasena
$db   = "draftosaurus";

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("error para conectar " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
