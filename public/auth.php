<?php

require_once __DIR__ . '/../vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../src/templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false,
    'debug' => true,
]);

// Get the mode from the URL (login or signup)
$mode = isset($_GET['mode']) ? $_GET['mode'] : 'login';

// Validate mode
if (!in_array($mode, ['login', 'signup'])) {
    $mode = 'login';
}

echo $twig->render('pages/auth.twig', [
    'mode' => $mode,
]);
