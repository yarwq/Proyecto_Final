<?php
// backend/api/game/game.php

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autorizado."]);
    exit;
}

$recintos = [
    "Bosque de la Serenidad" => ["regla" => "Solo dinosaurios del mismo tipo.", "puntos" => "2 puntos por dinosaurio."],
    "Pradera del Triceratops" => ["regla" => "Un solo tipo de dinosaurio.", "puntos" => "5 puntos si está lleno (5 dinosaurios)."],
    "Cueva del T-Rex" => ["regla" => "Solo dinosaurios de un tipo.", "puntos" => "7 puntos por dinosaurio."],
    "Isla de los Pterodáctilos" => ["regla" => "Una vez que coloques un dinosaurio en este recinto, no se puede añadir ningún otro.", "puntos" => "10 puntos."],
    "Pantano de los Saurópodos" => ["regla" => "Máximo 3 dinosaurios.", "puntos" => "3 puntos por dinosaurio."],
    "Volcán" => ["regla" => "Puedes colocar cualquier dinosaurio, pero uno de cada tipo y que no se repita. ", "puntos" => "3 puntos por dinosaurio."],
];

$dinosaurios = [];
$especies = ["T-Rex", "Triceratops", "Brachiosaurus", "Stegosaurus", "Pterodactyl", "Velociraptor"];

foreach ($especies as $especie) {
    for ($i = 0; $i < 10; $i++) {
        $dinosaurios[] = $especie;
    }
}
shuffle($dinosaurios);

$reglasDado = [
    "Bosque" => ["regla" => "Puedes colocar un dinosaurio en cualquier recinto del bosque."],
    "Río" => ["regla" => "Puedes colocar un dinosaurio en cualquier recinto junto al río."],
    "Una o dos zonas" => ["regla" => "Puedes colocar un dinosaurio en una zona que tenga 1 o 2 dinosaurios."],
    "Una sola zona" => ["regla" => "Puedes colocar un dinosaurio en una zona que tenga 1 dinosaurio."],
    "Recinto de un tipo" => ["regla" => "Puedes colocar un dinosaurio en un recinto que tenga 1 tipo de dinosaurio."],
    "Recinto vacío" => ["regla" => "Puedes colocar un dinosaurio en un recinto vacío."],
];

echo json_encode([
    "recintos" => $recintos,
    "dinosaurios" => $dinosaurios,
    "reglasDado" => $reglasDado,
]);
?>