<?php
namespace Models;

require_once __DIR__ . '/../config/db.php';

class RankingModel {
    private $pdo;

    public function __construct() {
        $this->pdo = getDBConnection();
    }

    public function insert($userId, $score) {
        $stmt = $this->pdo->prepare("INSERT INTO ranking (user_id, score) VALUES (?, ?)");
        $stmt->execute([$userId, $score]);
    }

    public function getAll() {
        $stmt = $this->pdo->query("
            SELECT r.*, u.username 
            FROM ranking r 
            JOIN users u ON r.user_id = u.id
            ORDER BY r.score DESC
            LIMIT 10
        ");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getByUser($userId) {
        $stmt = $this->pdo->prepare("
            SELECT r.*, u.username 
            FROM ranking r 
            JOIN users u ON r.user_id = u.id
            WHERE r.user_id = ?
            ORDER BY r.score DESC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
