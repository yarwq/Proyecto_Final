<?php
namespace Services;

require_once __DIR__ . '/../Repository/RankingModel.php';
use Repository\RankingModel;

class RankingService {
    private $model;

    public function __construct() {
        $this->model = new RankingModel();
    }

    public function addRanking($userId, $score) {
        $this->model->insert($userId, $score);
    }

    public function getRanking() {
        return $this->model->getAll();
    }

    public function getUserRanking($userId) {
        return $this->model->getByUser($userId);
    }
}
