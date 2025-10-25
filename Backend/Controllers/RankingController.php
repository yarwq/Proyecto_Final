<?php
namespace Controllers;

require_once __DIR__ . '/../Servicio/RankingService.php';
use Servicio\RankingService;

class RankingController {
    private $service;

    public function __construct() {
        $this->service = new RankingService();
    }

    // POST /api.php/addRanking
    public function addRanking() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['user_id']) || empty($data['score'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing fields"]);
            return;
        }

        $this->service->addRanking($data['user_id'], $data['score']);
        echo json_encode(["message" => "Ranking entry added"]);
    }

    // GET /api.php/getRanking
    public function getRanking() {
        $ranking = $this->service->getRanking();
        echo json_encode($ranking);
    }

    // GET /api.php/getUserRanking/{id}
    public function getUserRanking($userId) {
        $ranking = $this->service->getUserRanking($userId);
        echo json_encode($ranking);
    }
}
