<?php

require_once __DIR__ . '/../vendor/autoload.php';

$config = require_once __DIR__ . '/../config.php';

// Simple Router Class
class Router {
    private $routes = [];
    private $twig;
    private $basePath;

    public function __construct($twig, $basePath = '') {
        $this->twig = $twig;
        $this->basePath = $basePath;
    }

    public function get($path, $callback) {
        $this->routes['GET'][$path] = $callback;
    }

    public function dispatch($uri, $method = 'GET') {
        $uri = strtok($uri, '?');
        
        if ($uri !== '/' && substr($uri, -1) === '/') {
            $uri = rtrim($uri, '/');
        }

        // Check if route exists
        if (isset($this->routes[$method][$uri])) {
            return call_user_func($this->routes[$method][$uri], $this->twig);
        }

        // 404 Not Found
        http_response_code(404);
        echo $this->twig->render('pages/404.twig');
    }
    
    public function getBasePath() {
        return $this->basePath;
    }
}


$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../src/templates');
$twig = new \Twig\Environment($loader, [
    'cache' => $config['twig_cache'],
    'debug' => $config['debug'],
]);


$twig->addGlobal('base_path', $config['base_path']);


$router = new Router($twig, $config['base_path']);


$router->get('/', function($twig) {
    $landingPageBoxes = [
        [
            'title' => 'Track everything',
            'description' => 'Manage tickets, tasks, and projects all in one place with our intuitive interface.',
        ],
        [
            'title' => 'Lightning fast',
            'description' => 'Built for speed. Create, update, and resolve tickets in seconds.',
        ],
        [
            'title' => 'Stay organized',
            'description' => 'Keep your workspace tidy and focused with powerful organizational tools.',
        ],
    ];

    echo $twig->render('pages/home.twig', [
        'landingPageBoxes' => $landingPageBoxes,
    ]);
});

$router->get('/auth/login', function($twig) {
    echo $twig->render('pages/auth.twig', [
        'mode' => 'login',
    ]);
});

$router->get('/auth/signup', function($twig) {
    echo $twig->render('pages/auth.twig', [
        'mode' => 'signup',
    ]);
});

$router->get('/dashboard', function($twig) {
    echo $twig->render('pages/dashboard.twig');
});

$router->get('/dashboard/tickets', function($twig) {
    echo $twig->render('pages/tickets.twig');
});


$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path if exists (for subdirectory installations)
$basePath = $config['base_path'];
if (!empty($basePath) && strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
    if (empty($uri)) {
        $uri = '/';
    }
}

// Dispatch the route
try {
    $router->dispatch($uri, $_SERVER['REQUEST_METHOD']);
} catch (Throwable $e) {
    // Log full error to server logs (visible in Railway logs)
    error_log('[Router Error] ' . $e->getMessage() . "\n" . $e->getTraceAsString());

    // Return a minimal error page without exposing internals
    http_response_code(500);
    echo $twig->render('pages/404.twig');
}