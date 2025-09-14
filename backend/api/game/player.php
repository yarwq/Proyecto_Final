<?php
// backend/api/game/player.php

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autorizado."]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $action = $_POST["action"] ?? "";

    if ($action === "init_hand") {
        if (!isset($_SESSION['dinosaurios_disponibles'])) {
            // Inicializar todos los dinosaurios (10 de cada uno)
            $dinosaurios = [];
            $especies = ["T-Rex", "Triceratops", "Brachiosaurus", "Stegosaurus", "Pterodactyl", "Velociraptor"];
            foreach ($especies as $especie) {
                for ($i = 0; $i < 10; $i++) {
                    $dinosaurios[] = $especie;
                }
            }
            shuffle($dinosaurios);
            $_SESSION['dinosaurios_disponibles'] = $dinosaurios;
        }

        if (!isset($_SESSION['player_hands'])) {
            $_SESSION['player_hands'] = [];
        }

        $num_jugadores = $_POST['num_jugadores'] ?? 2;
        $_SESSION['num_jugadores'] = $num_jugadores;
        $_SESSION['turno_actual'] = 1;
        $_SESSION['puntuacion'] = [];
        
        // Repartir 6 dinosaurios a cada jugador
        for ($i = 1; $i <= $num_jugadores; $i++) {
            $hand = [];
            for ($j = 0; $j < 6; $j++) {
                if (!empty($_SESSION['dinosaurios_disponibles'])) {
                    $hand[] = array_shift($_SESSION['dinosaurios_disponibles']);
                }
            }
            $_SESSION['player_hands'][$i] = $hand;
            $_SESSION['puntuacion'][$i] = 0;
        }

        echo json_encode([
            "success" => true,
            "hand" => $_SESSION['player_hands'][$_SESSION['user_id']] // Asumiendo que el user_id corresponde a un jugador
        ]);
        exit;
    }
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $action = $_GET["action"] ?? "";
    
    if ($action === "get_status") {
        echo json_encode([
            "player_hand" => $_SESSION['player_hands'][$_SESSION['user_id']],
            "current_player" => $_SESSION['user_id'],
            "current_turn" => $_SESSION['turno_actual'],
            "score" => $_SESSION['puntuacion']
        ]);
        exit;
    }
}

http_response_code(400);
echo json_encode(["error" => "Acción inválida."]);
?>