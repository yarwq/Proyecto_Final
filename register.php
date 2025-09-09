<?php
session_start();
require "config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: register.html");
    exit;
}

$email = filter_var(trim($_POST["email"] ?? ""), FILTER_VALIDATE_EMAIL);
$password = trim($_POST["password"] ?? "");
$confirm = trim($_POST["confirm"] ?? "");

if (!$email) {
    die("Email inválido.");
}

if (strlen($password) < 6) {
    die("La contraseña debe tener al menos 6 caracteres.");
}

if ($password !== $confirm) {
    die("Las contraseñas no coinciden.");
}

// check if email exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    $check->close();
    die("Email ya registrado.");
}
$check->close();

// insert user
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
if (!$stmt) {
    die("Prepare error: " . $conn->error);
}
$stmt->bind_param("ss", $email, $hashedPassword);

if ($stmt->execute()) {
    $stmt->close();
    
    header("Location: login.html");
    exit;
} else {
    $stmt->close();
    die("Error de registro: " . $conn->error);
}
?>
