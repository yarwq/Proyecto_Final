<?php
session_start();
if (!isset($_SESSION["user_id"])) {
    header("Location: login.html");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reglas del tablero</title>
<link rel="stylesheet" href="menu.css">
<style>
.rules-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: left;
}

.rule-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.rule-item img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 10px;
    filter: drop-shadow(0 0 10px #ff00ff);
}

.rule-item .text {
    font-size: 14px;
    color: #fff;
    background: linear-gradient(to right, #00c6ff, #ff00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
</head>
<body>
<div class="container">
    <div class="logo-box">
        <img src="assets/logo.png" alt="logo">
    </div>
    <h1 class="bienvenido">Reglas del tablero</h1>

    <div class="rules-list">
        <div class="rule-item">
            <img src="assets/dino1.png" alt="dinosaurio">
            <div class="text">Se colocan parejas de la misma especie hasta llegar a un máximo de 6 dinosaurios.</div>
        </div>
        <div class="rule-item">
            <img src="assets/dino2.png" alt="dinosaurio">
            <div class="text">Para puntuar hay que colocar exactamente 3 dinosaurios, sean cuales sean.</div>
        </div>
        <div class="rule-item">
            <img src="assets/dino3.png" alt="dinosaurio">
            <div class="text">En este recinto tan solo se pueden poner dinosaurios de la misma especie.</div>
        </div>
        <div class="rule-item">
            <img src="assets/dino4.png" alt="dinosaurio">
            <div class="text">Nos llevaremos 7 puntos si ponemos un dinosaurio y nuestro parque es el que más dinosaurios tiene de esa especie.</div>
        </div>
        <div class="rule-item">
            <img src="assets/dino5.png" alt="dinosaurio">
            <div class="text">Este recinto puede llegar a albergar dinosaurios de distintas especies, por lo que no podremos repetir.</div>
        </div>
        <div class="rule-item">
            <img src="assets/dino6.png" alt="dinosaurio">
            <div class="text">Este recinto puede llegar a albergar un dinosaurio diferente respecto a todo el tablero.</div>
        </div>
        <div class="rule-item">
            <img src="assets/dino7.png" alt="dinosaurio">
            <div class="text">No se considera un recinto del zoo pero sí puntuará con 1 punto por dinosaurio al final de la partida.</div>
        </div>
        <div class="rule-item">
            <img src="assets/dino8.png" alt="dinosaurio">
            <div class="text">El T-Rex es único y especial, de ahí que por cada recinto que contenga uno de ellos nos llevaremos otro punto adicional.</div>
        </div>
    </div>
</div>
</body>
</html>
