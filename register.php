<?php
require "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $confirm = trim($_POST["confirm"]);

    if ($password !== $confirm) {
        die(" contrasena incorrecta");
    }

    // hash pass
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // email
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        die(" email ya existe");
    }

    // en BD
    $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hashedPassword);

    if ($stmt->execute()) {
        echo "registracion perfecto!";
        header("Location: login.html");
        exit;
    } else {
        echo "error: " . $conn->error;
    }
}
?>
