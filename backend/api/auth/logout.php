<?php
// backend/api/auth/logout.php

header('Content-Type: application/json');
session_start();
session_destroy();
echo json_encode(["success" => true]);
exit;
?>