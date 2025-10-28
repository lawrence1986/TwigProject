<?php

// Configuration file for the application

return [
    // Base path configuration
    // For local development with XAMPP in a subdirectory: '/hng-stage-2-twig/public'
    // For production at root: ''
    // For production in subdirectory: '/subdirectory'
    // Auto-detect base path so it works in any folder (e.g., '/twigdemo/public')
    // Normalize root '/' to ''
    'base_path' => (function () {
        $path = dirname($_SERVER['SCRIPT_NAME']);
        if ($path === DIRECTORY_SEPARATOR || $path === '.') {
            return '';
        }
        return $path;
    })(),
    
    // You can also auto-detect:
    // 'base_path' => dirname($_SERVER['SCRIPT_NAME']),
    
    // Or use environment variable:
    // 'base_path' => getenv('BASE_PATH') ?: '/hng-stage-2-twig/public',
    
    // App settings
    'app_name' => 'Ticketing System',
    'debug' => true,
    
    // Twig settings
    'twig_cache' => false,
];
