<?php
/**
 * Production Configuration
 * Copy this to config.php on your production server and adjust values
 */

return [
    // Base path - CHANGE THIS FOR PRODUCTION
    // For root domain: ''
    // For subdirectory: '/subdirectory'
    'base_path' => '',
    
    // Application settings
    'app_name' => 'Ticcket',
    'debug' => false,  // Set to false in production!
    
    // Twig cache settings
    'twig_cache' => __DIR__ . '/cache',  // Enable caching in production
    
    // Security settings
    'session_lifetime' => 3600, // 1 hour
    'csrf_protection' => true,
];
