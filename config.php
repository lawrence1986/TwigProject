<?php

// Configuration file for the application

return [
    // Base path configuration
    // For local development with XAMPP in a subdirectory: '/hng-stage-2-twig/public'
    // For production at root: ''
    // For production in subdirectory: '/subdirectory'
    'base_path' => '/hng-stage-2-twig/public',
    
    // You can also auto-detect:
    // 'base_path' => dirname($_SERVER['SCRIPT_NAME']),
    
    // Or use environment variable:
    // 'base_path' => getenv('BASE_PATH') ?: '/hng-stage-2-twig/public',
    
    // App settings
    'app_name' => 'Ticcket',
    'debug' => true,
    
    // Twig settings
    'twig_cache' => false,
];
