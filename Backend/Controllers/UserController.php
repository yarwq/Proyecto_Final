<?php
namespace Controllers;

require_once __DIR__ . "/../Repository/User.php";
require_once __DIR__ . "/../Servicio/UserServicio.php";
use Repository\User;
use Servicio\UserServicio;



class UserController {  
  private $userService;

    public function __construct() {
        $this->userService = new UserService();
    }
public function register() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    
    $email = filter_var(trim($data['email'] ?? ""), FILTER_VALIDATE_EMAIL);
    $username = trim($data['username'] ?? "");
    $password = trim($data['password'] ?? "");
    $confirm = trim($data['confirm'] ?? "");

try {
    $ok = $this->userRepo->register($username, $hashedPassword, $email);
} catch (\Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

    if ($ok) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "No se pudo registrar"]);
    }
}


    public function login() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $username = trim($data['username'] ?? "");
        $password = trim($data['password'] ?? "");

        if (!isset($data['username'], $data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan datos"]);
            return;
        }

        $user = new User();
       // $token = $user->login($data['username'], $data['password']);
        $token = $this->userService->loginUser($username, $password);


        if ($token) {
            echo json_encode(["success" => true, "token" => $token]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales inválidas"]);
        }
    }
}
