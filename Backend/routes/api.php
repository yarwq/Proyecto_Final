<?php
use Controllers\UserController;
use Controllers\MatchController;

require_once __DIR__ . "/../controllers/UserController.php";
require_once __DIR__ . "/../controllers/MatchController.php";
require_once __DIR__ . "/../controllers/RankingController.php";
use Controllers\RankingController;


header("Content-Type: application/json; charset=UTF-8");

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];   

if (strpos($path, 'api.php') !== false) {
    $relativePath = explode('api.php', $path)[1]; 
    $segments = explode('/', trim($relativePath, '/'));
} else {
    $segments = [];
}

$action = $_GET['action'] ?? ($segments[0] ?? null);

$id = $segments[1] ?? null;



// ------------------------
// CORS headers
// ------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}



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
    case 'addRanking':
        if (in_array($method, ['POST', 'OPTIONS'])) {
            (new RankingController())->addRanking();
        }
        break;

    case 'getRanking':
        if ($method === 'GET') {
            (new RankingController())->getRanking();
        }
        break;

    case 'getUserRanking':
        if ($method === 'GET' && $id) {
            (new RankingController())->getUserRanking($id);
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
