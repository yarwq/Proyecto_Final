<?php
// backend/api/auth/register.php
session_start();
require __DIR__ . "/../../config/db.php";

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
    exit;
}

$email = filter_var(trim($_POST["email"] ?? ""), FILTER_VALIDATE_EMAIL);
$username = trim($_POST["username"] ?? "");
$password = trim($_POST["password"] ?? "");
$confirm = trim($_POST["confirm"] ?? "");

if (!$email) {
    echo json_encode(["error" => "Email inválido."]);
    exit;
}
if (strlen($username) < 3) {
    echo json_encode(["error" => "El nombre de usuario debe tener al menos 3 caracteres."]);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres."]);
    exit;
}
if ($password !== $confirm) {
    echo json_encode(["error" => "Las contraseñas no coinciden."]);
    exit;
}

$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    $check->close();
    echo json_encode(["error" => "Email ya registrado."]);
    exit;
}
$check->close();

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
if (!$stmt) {
    echo json_encode(["error" => "Error de preparación de la consulta."]);
    exit;
}
$stmt->bind_param("sss", $email, $username, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario registrado con éxito."]);
} else {
    echo json_encode(["error" => "Error al registrar usuario: " . $stmt->error]);
}
$stmt->close();
$conn->close();
?>