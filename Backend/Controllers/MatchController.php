<?php
namespace Controllers;

require_once __DIR__ . '/../config/db.php';

class MatchController {

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

        $pdo = getDBConnection();

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare("
                INSERT INTO partidas (num_jugadores, jugador_actual, turno, zoologicos, manos, fecha)
                VALUES (:num_jugadores, :jugador_actual, :turno, :zoologicos, :manos, :fecha)
            ");
            $stmt->execute([
                ':num_jugadores' => $data['numJugadores'],
                ':jugador_actual' => $data['jugadorActual'],
                ':turno' => $data['turno'],
                ':zoologicos' => json_encode($data['zoologicos'], JSON_UNESCAPED_UNICODE),
                ':manos' => json_encode($data['manos'], JSON_UNESCAPED_UNICODE),
                ':fecha' => date('Y-m-d H:i:s', strtotime($data['fecha']))
            ]);

            $partida_id = $pdo->lastInsertId();

            $stmt2 = $pdo->prepare("
                INSERT INTO partida_jugadores (partida_id, jugador_id)
                VALUES (:partida_id, :jugador_id)
            ");

            foreach ($data['jugadores'] as $jugador_id) {
                $stmt2->execute([
                    ':partida_id' => $partida_id,
                    ':jugador_id' => $jugador_id
                ]);
            }

            $pdo->commit();
            echo json_encode(["success" => true]);

        } catch (\Exception $e) {
            $pdo->rollBack();
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

    $pdo = getDBConnection();

    try {
        $stmt = $pdo->prepare("
            SELECT p.id, p.fecha, p.turno, p.num_jugadores
            FROM partidas p
            JOIN partida_jugadores pj ON pj.partida_id = p.id
            WHERE pj.jugador_id = :user_id
            ORDER BY p.fecha DESC
        ");
        $stmt->execute([':user_id' => $user_id]);

        $matches = $stmt->fetchAll(\PDO::FETCH_ASSOC);
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

    $pdo = getDBConnection();

    try {
        $stmt = $pdo->prepare("SELECT * FROM partidas WHERE id = :id");
        $stmt->execute([':id' => $match_id]);
        $match = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$match) {
            http_response_code(404);
            echo json_encode(["error" => "Partida no encontrada"]);
            return;
        }

        $match['zoologicos'] = json_decode($match['zoologicos'], true);
        $match['manos'] = json_decode($match['manos'], true);

        echo json_encode(["success" => true, "match" => $match]);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

}
