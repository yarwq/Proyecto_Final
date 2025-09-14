<?php
function getDBConnection() {
    $host = "localhost";
    $dbname = "draftosaurus";
    $user = "root";
    $pass = "";

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    return $pdo;
}
