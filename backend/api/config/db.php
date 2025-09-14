<?php
// backend/api/config/db.php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "draftosaurus";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
} catch (Exception $e) {
    die("Connection failed: " . $e->getMessage());
}
?>