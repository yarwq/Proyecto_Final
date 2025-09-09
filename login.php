<?php
session_start();
require "config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: login.html");
    exit;
}

$email = trim($_POST["email"] ?? "");
$password = trim($_POST["password"] ?? "");

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Email inválido.");
}

$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
if (!$stmt) {
    die("Prepare error: " . $conn->error);
}
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    
    $stmt->close();
    die("Credenciales incorrectas.");
}

$stmt->bind_result($id, $hashedPassword);
$stmt->fetch();

if (!password_verify($password, $hashedPassword)) {
    $stmt->close();
    die("Credenciales incorrectas.");
}


$_SESSION["user_id"] = $id;
$_SESSION["email"] = $email;

$stmt->close();


header("Location: menu_principal.php");
exit;
?>
