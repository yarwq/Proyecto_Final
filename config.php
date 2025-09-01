<?php
$host = "localhost";   // server base de datos
$user = "root";        // admin de base de datod
$pass = "";            // contrasena
$db   = "draftosaurus"; // nombre de base de datos

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("error conection: " . $conn->connect_error);
}
?>
