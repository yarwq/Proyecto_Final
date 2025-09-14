<?php
// backend/api/auth/login.php
session_start();
require __DIR__ . "/../../config/db.php";

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
    exit;
}

$email = trim($_POST["email"] ?? "");
$password = trim($_POST["password"] ?? "");

$stmt = $conn->prepare("SELECT id, username, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id, $username, $hashedPassword);

if ($stmt->num_rows === 1) {
    $stmt->fetch();
    if (password_verify($password, $hashedPassword)) {
        $_SESSION["user_id"] = $id;
        $_SESSION["username"] = $username;
        echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso.", "username" => $username]);
    } else {
        echo json_encode(["error" => "Contraseña incorrecta."]);
    }
} else {
    echo json_encode(["error" => "Usuario no encontrado."]);
}

$stmt->close();
$conn->close();
?>