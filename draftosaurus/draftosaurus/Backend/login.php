<?php
// filepath: d:\Xampp\htdocs\draftosaurus\login.php

header('Content-Type: application/json');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

// Obtener datos JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

// Validar campos
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
    exit;
}

// Conexión a la base de datos (ajusta los datos según tu configuración)
$mysqli = new mysqli('localhost', 'root', '', 'draftosaurus');

if ($mysqli->connect_errno) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión']);
    exit;
}

// Buscar usuario
$stmt = $mysqli->prepare('SELECT id, password FROM users WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
    $stmt->close();
    $mysqli->close();
    exit;
}

$stmt->bind_result($id, $hash);
$stmt->fetch();

if (password_verify($password, $hash)) {
    // Generar token simple (solo ejemplo, no seguro para producción)
    $token = base64_encode($id . ':' . $username . ':' . time());
    echo json_encode(['success' => true, 'token' => $token]);
} else {
    echo json_encode(['success' => false, 'error' => 'Contraseña incorrecta']);
}

$stmt->close();
$mysqli->close();