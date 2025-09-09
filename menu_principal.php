<?php
session_start();
if (!isset($_SESSION["user_id"])) {
    header("Location: login.html");
    exit;
}
$user = $_SESSION["email"]; 
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Menú Principal</title>
<link rel="stylesheet" href="menu.css">
</head>
<body>
<div class="container">
    <div class="logo-box">
        <img src="assets/logo.png" alt="logo">
    </div>
    <h1 class="bienvenido">Bienvenido <span><?php echo htmlspecialchars($user); ?></span></h1>

    <div class="buttons">
        <a href="herramienta_apoyo.php" class="btn">Herramienta de apoyo</a>
        <a href="game.html" class="btn">Juego virtual</a>
    </div>

    <div class="iconos">
        <a href="ayuda.php"><img src="assets/icono1.png" alt="Ayuda"></a>
        <a href="configuracion.php"><img src="assets/icono2.png" alt="Configuración"></a>
        <a href="logros.php"><img src="assets/icono3.png" alt="Logros"></a>
    </div>

    <a href="terminos.html" class="terms">Términos y condiciones</a>
</div>
</body>
</html>
