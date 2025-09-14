<?php
// backend/api/game/dice.php

header('Content-Type: application/json');

$diceFaces = ["bosque", "rio", "1_o_2_zonas", "una_sola_zona", "recinto_un_tipo", "recinto_vacio"];

$result = $diceFaces[array_rand($diceFaces)];

$rules = [
    "bosque" => "Puedes colocar un dinosaurio en cualquier recinto del bosque.",
    "rio" => "Puedes colocar un dinosaurio en cualquier recinto junto al río.",
    "1_o_2_zonas" => "Puedes colocar un dinosaurio en una zona que tenga 1 o 2 dinosaurios.",
    "una_sola_zona" => "Puedes colocar un dinosaurio en una zona que tenga 1 dinosaurio.",
    "recinto_un_tipo" => "Puedes colocar un dinosaurio en un recinto que tenga 1 tipo de dinosaurio.",
    "recinto_vacio" => "Puedes colocar un dinosaurio en un recinto vacío.",
];

echo json_encode([
    "result" => $result,
    "rule" => $rules[$result]
]);
?>