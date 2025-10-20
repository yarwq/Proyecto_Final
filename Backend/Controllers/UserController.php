<?php
namespace Controllers;

require_once __DIR__ . "/../Repository/User.php";
use Repository\User;

require_once __DIR__ . "/../Servicio/UserServicio.php";
use Servicio\UserService;

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
        $ok = $this->userService->registerUser($username, $password, $confirm, $email);
    } catch (\Exception $e) {
        http_response_code(500);
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

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos"]);
        return;
    }

    try {
        $result = $this->userService->loginUser($username, $password);

        if ($result) {
            echo json_encode([
                "success" => true,
                "token" => $result["token"],
                "user" => $result["user"]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales inválidas"]);
        }
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

}
