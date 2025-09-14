<?php
// backend/public/index.php

// Iniciar sesión para toda la aplicación
session_start();

// Obtener la ruta de la petición
$request = $_SERVER['REQUEST_URI'];
$request = explode('?', $request)[0]; // Eliminar parámetros de la query

// Definir el punto de entrada de la API
$api_path = '/backend/api/';
$request = str_replace($api_path, '', $request);

// Simple enrutamiento
switch ($request) {
    case 'auth/login.php':
        require __DIR__ . '/../api/auth/login.php';
        break;
    case 'auth/register.php':
        require __DIR__ . '/../api/auth/register.php';
        break;
    case 'auth/logout.php':
        require __DIR__ . '/../api/auth/logout.php';
        break;
    case 'game/game.php':
        require __DIR__ . '/../api/game/game.php';
        break;
    case 'game/dice.php':
        require __DIR__ . '/../api/game/dice.php';
        break;
    case 'game/player.php':
        require __DIR__ . '/../api/game/player.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(["error" => "Ruta no encontrada."]);
        break;
}