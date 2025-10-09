<?php
use Controllers\UserController;
use Controllers\MatchController;

require_once __DIR__ . "/../controllers/UserController.php";
require_once __DIR__ . "/../controllers/MatchController.php";

header("Content-Type: application/json; charset=UTF-8");

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Разделяем путь на сегменты
$segments = explode('/', trim($path, '/'));

// Ищем api.php в сегментах, чтобы дальше смотреть REST
$apiIndex = array_search('api.php', $segments);

$controller = null;
$action = $segments[$apiIndex + 1] ?? null; // getMatches, loadMatch и т.д.
$id = $segments[$apiIndex + 2] ?? null;     // user_id или match_id

switch ($action) {
    case 'register':
        if (in_array($method, ['POST','OPTIONS'])) {
            (new UserController())->register();
        }
        break;

    case 'login':
        if (in_array($method, ['POST','OPTIONS'])) {
            (new UserController())->login();
        }
        break;

    case 'saveMatch':
        if (in_array($method, ['POST','OPTIONS'])) {
            (new MatchController())->saveMatch();
        }
        break;

    case 'getMatches':
        if ($method === 'GET' && $id) {
            (new MatchController())->getMatches($id);
        }
        break;

    case 'loadMatch':
        if ($method === 'GET' && $id) {
            (new MatchController())->loadMatch($id);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode([
            "error" => "Ruta no encontrada",
            "path" => $path,
            "method" => $method
        ]);
}
