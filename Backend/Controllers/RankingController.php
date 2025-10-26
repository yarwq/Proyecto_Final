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
    header("Content-Type: application/json; charset=UTF-8");

    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        echo json_encode(["error" => "JSON inválido"]);
        return;
    }

    $user_id = $input['user_id'] ?? null;
    $score = $input['score'] ?? null;

    if (!$user_id || $score === null) {
        echo json_encode(["error" => "Datos incompletos"]);
        return;
    }

    try {
        $this->service->addRanking($user_id, $score);
        echo json_encode(["success" => true, "user_id" => $user_id, "score" => $score]);
    } catch (\Throwable $e) {
        echo json_encode([
            "error" => "Error al guardar ranking",
            "details" => $e->getMessage()
        ]);
    }
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
