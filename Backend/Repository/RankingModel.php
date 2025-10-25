<?php
namespace Repository;

require_once __DIR__ . '/../config/db.php';

class RankingModel {
    private $pdo;

    public function __construct() {
        $this->pdo = getDBConnection();
    }

    public function addScore($userId, $score) {
        $stmt = $this->pdo->prepare("
            INSERT INTO ranking (user_id, score)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
            score = score + VALUES(score)
        ");
        $stmt->execute([$userId, $score]);
    }

    public function getTop() {
        $stmt = $this->pdo->query("
            SELECT u.username, r.score 
            FROM ranking r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.score DESC
            LIMIT 10
        ");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
