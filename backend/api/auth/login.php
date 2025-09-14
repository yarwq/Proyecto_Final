<?php
session_start();
require "config.php";

$email = trim($_POST["email"] ?? "");
$password = trim($_POST["password"] ?? "");

// 
$stmt = $conn->prepare("SELECT id, username, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id, $username, $hashedPassword);

if ($stmt->num_rows === 1) {
    $stmt->fetch();
    if (password_verify($password, $hashedPassword)) {
        $_SESSION["user_id"] = $id;
        $_SESSION["username"] = $username; // 
        header("Location: menu_principal.php");
        exit;
    } else {
        die("Contraseña incorrecta.");
    }
} else {
    die("Usuario no encontrado.");
}
$stmt->close();



header("Location: menu_principal.php");
exit;
?>
