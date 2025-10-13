<?php
namespace Repository;

require_once __DIR__ . '/../config/db.php';

class MatchRepository {

    // -----------------------------
    // Guardar una partida
    // -----------------------------
    public function saveMatch($data) {
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
            return true;

        } catch (\Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    // -----------------------------
    // Obtener partidas por usuario
    // -----------------------------
    public function getMatches($user_id) {
        $pdo = getDBConnection();

        $stmt = $pdo->prepare("
            SELECT p.id, p.fecha, p.turno, p.num_jugadores
            FROM partidas p
            JOIN partida_jugadores pj ON pj.partida_id = p.id
            WHERE pj.jugador_id = :user_id
            ORDER BY p.fecha DESC
        ");
        $stmt->execute([':user_id' => $user_id]);

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // -----------------------------
    // Cargar partida por ID
    // -----------------------------
    public function loadMatch($match_id) {
        $pdo = getDBConnection();

        $stmt = $pdo->prepare("SELECT * FROM partidas WHERE id = :id");
        $stmt->execute([':id' => $match_id]);
        $match = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$match) {
            return null;
        }

        $match['zoologicos'] = json_decode($match['zoologicos'], true);
        $match['manos'] = json_decode($match['manos'], true);

        return $match;
    }
}
