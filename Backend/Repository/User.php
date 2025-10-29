<?php
namespace Repository;
require_once __DIR__ . '/../config/db.php';

class User {

public function register($username, $hashedPassword, $email) {
    try {
        $pdo = getDBConnection();

        // 1. Comprobar si el email ya existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            throw new \Exception("El email ya está en uso. Por favor, elige otro.");
        }

        // 2. Comprobar si el nombre de usuario ya existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->rowCount() > 0) {
            throw new \Exception("Ese nombre de usuario ya está en uso. Por favor, elige otro.");
        }
        
        // 3. Si todo está bien, insertar
        $stmt = $pdo->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
        $stmt->execute([$email, $username, $hashedPassword]);

        return true;
    } catch (\PDOException $e) {
        // Captura errores de base de datos (como un fallo de conexión)
        error_log($e->getMessage());
        throw new \Exception("Error interno del servidor. Inténtalo más tarde.");
    }
}

    

public function login($username, $password) {
    try {
        $pdo = getDBConnection();

        $stmt = $pdo->prepare("SELECT id, username, email, password FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $token = bin2hex(random_bytes(16));

            return [
                "token" => $token,
                "user" => [
                    "id" => $user["id"],
                    "username" => $user["username"],
                    "email" => $user["email"]
                ]
            ];
        }
        return false;
    } catch (\PDOException $e) {
        error_log($e->getMessage());
        return false;
    }
}

}