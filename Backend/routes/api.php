<?php
use Controllers\UserController;

require_once __DIR__ . "/../controllers/UserController.php";

header("Content-Type: application/json; charset=UTF-8");
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// убираем префикс, если хочешь проще
$path = str_replace('/Proyecto_Final/api', '', $path);

switch (true) {
    case ($path === '/register' && in_array($method, ['POST','OPTIONS'])):
        (new UserController())->register();
        break;

    case ($path === '/login' && in_array($method, ['POST','OPTIONS'])):
        (new UserController())->login();
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Ruta no encontrada", "path" => $path, "method" => $method]);
}
