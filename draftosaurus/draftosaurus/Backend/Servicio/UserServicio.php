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
//validation
        if (!$email || strlen($username) < 3 || strlen($password) < 6 || $password !== $confirm) {
            return false;
        }
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        return $this->userRepo->register($username, $hashedPassword, $email);
    }


    public function loginUser($username, $password) {
        return $this->userRepo->login($username, $password);
    }
}
