<?php
namespace Servicio;

require_once __DIR__ . "/../Repository/User.php";
use Repository\User;

class UserService {

    private $userRepo;

    public function __construct() {
        $this->userRepo = new User();
    }

    public function registerUser($username, $password, $confirm, $email) {
        // --- 1. Reglas de Validación Claras ---
        if (!$email) {
            return "El campo de email no puede estar vacío.";
        }
        if (strlen($username) < 3) {
            return "El nombre de usuario debe tener al menos 3 caracteres.";
        }
        if (strlen($password) < 6) {
            return "La contraseña debe tener al menos 6 caracteres.";
        }
        if ($password !== $confirm) {
            return "Las contraseñas no coinciden.";
        }
        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        try {
            // --- 2. Llama al repositorio (que ahora puede lanzar excepciones) ---
            return $this->userRepo->register($username, $hashedPassword, $email);
        } catch (\Exception $e) {
            // --- 3. Devuelve el mensaje de error específico (ej. "El email ya está en uso") ---
            return $e->getMessage();
        }
    }


    public function loginUser($username, $password) {
        return $this->userRepo->login($username, $password);
    }
}