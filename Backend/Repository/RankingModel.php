<?php
namespace Repository;

require_once __DIR__ . '/../config/db.php';

class RankingModel {
    private $pdo;

    public function __construct() {
        $this->pdo = getDBConnection();
    }

    /**
     * Modificado: Inserta un nuevo registro de ranking con nombre y puntaje.
     */
    public function addScore($username, $score) {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO ranking (username, score) VALUES (?, ?)
            ");
            $stmt->execute([$username, $score]);
        } catch (\PDOException $e) {
            // Lanzar el error para que el controlador lo maneje
            throw $e;
        }
    }

    /**
     * Modificado: Obtiene el top 10, ya no hace JOIN con users.
     */
    public function getTop() {
        $stmt = $this->pdo->query("
            SELECT username, score, fecha 
            FROM ranking
            ORDER BY score DESC
            LIMIT 10
        ");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Modificado: Busca los mejores puntajes de un nombre de usuario.
     */
    public function getUserRank($username) {
        $stmt = $this->pdo->prepare("
            SELECT username, score, fecha
            FROM ranking
            WHERE username = ?
            ORDER BY score DESC
            LIMIT 5
        ");
        $stmt->execute([$username]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}