<?php
namespace Repository;
require_once __DIR__ . '/../config/db.php';


class User {

public function register($username, $hashedPassword, $email) {
    try {
        $pdo = getDBConnection();

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) return false;

        $stmt = $pdo->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
        $stmt->execute([$email, $username, $hashedPassword]);

        return true;
    } catch (\PDOException $e) {
        error_log($e->getMessage());
        return false;
    }
}

    

    public function login($username, $password) {
        try {
            $pdo = getDBConnection();

            $stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $token = bin2hex(random_bytes(16));
                return $token;
            }
            return false;
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            return false;
        }
    }
}
