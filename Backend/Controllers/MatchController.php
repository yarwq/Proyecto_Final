<?php
namespace Controllers;

require_once __DIR__ . '/../Repository/MatchRepository.php';
use Repository\MatchRepository;

class MatchController {

    private $repository;

    public function __construct() {
        $this->repository = new MatchRepository();
    }

    public function saveMatch() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['jugadores']) || !is_array($data['jugadores'])) {
            http_response_code(400);
            echo json_encode(["error" => "Datos inválidos"]);
            return;
        }

        try {
            $this->repository->saveMatch($data);
            echo json_encode(["success" => true]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public function getMatches($user_id) {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        try {
            $matches = $this->repository->getMatches($user_id);
            echo json_encode(["success" => true, "matches" => $matches]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public function loadMatch($match_id) {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        try {
            $match = $this->repository->loadMatch($match_id);

            if (!$match) {
                http_response_code(404);
                echo json_encode(["error" => "Partida no encontrada"]);
                return;
            }

            echo json_encode(["success" => true, "match" => $match]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}
