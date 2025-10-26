<?php
/**
 * Example Configuration File
 * This shows all available configuration options
 */

return [
    // ============================================
    // BASE PATH CONFIGURATION
    // ============================================
    // Local Development (XAMPP/WAMP):
    // 'base_path' => '/hng-stage-2-twig/public',
    //
    // Production (root domain):
    // 'base_path' => '',
    //
    // Production (subdirectory):
    // 'base_path' => '/subdirectory',
    // ============================================
    
    'base_path' => '/hng-stage-2-twig/public',
    
    // Application name
    'app_name' => 'Ticcket',
    
    // Debug mode (ALWAYS false in production!)
    'debug' => true,
    
    // Twig cache directory (false to disable, path to enable)
    // ALWAYS enable in production for better performance
    'twig_cache' => false,  // or __DIR__ . '/cache'
    
    // Session settings
    'session_lifetime' => 3600, // 1 hour in seconds
    
    // CSRF protection (future feature)
    'csrf_protection' => true,
    
    // Timezone
    'timezone' => 'UTC',
    
    // Error reporting (verbose in dev, minimal in production)
    'error_reporting' => E_ALL,
    'display_errors' => true,  // false in production
];
