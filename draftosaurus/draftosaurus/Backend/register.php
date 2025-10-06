<?php
// filepath: d:\Xampp\htdocs\draftosaurus\register.php

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
$email = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
$confirm = $data['confirm'] ?? '';

if (!$email || !$username || !$password || !$confirm) {
    echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
    exit;
}

if ($password !== $confirm) {
    echo json_encode(['success' => false, 'error' => 'Las contraseñas no coinciden']);
    exit;
}

// Conexión a la base de datos (ajusta los datos según tu configuración)
$mysqli = new mysqli('localhost', 'root', '', 'draftosaurus');

if ($mysqli->connect_errno) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión']);
    exit;
}

// Verificar si el usuario o email ya existe
$stmt = $mysqli->prepare('SELECT id FROM users WHERE email = ? OR username = ?');
$stmt->bind_param('ss', $email, $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'El usuario o email ya existe']);
    $stmt->close();
    $mysqli->close();
    exit;
}
$stmt->close();

// Insertar usuario
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $mysqli->prepare('INSERT INTO users (email, username, password) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $email, $username, $hash);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al registrar usuario']);
}

$stmt->close();
$mysqli->close();