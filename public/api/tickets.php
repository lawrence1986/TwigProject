<?php
/**
 * Tickets API Endpoint
 * Handles CRUD operations for tickets
 */

header('Content-Type: application/json');

// Simple file-based storage (in production, use a real database)
$ticketsFile = __DIR__ . '/../data/tickets.json';

// Ensure data directory exists
$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Initialize tickets file if it doesn't exist
if (!file_exists($ticketsFile)) {
    file_put_contents($ticketsFile, json_encode(['tickets' => []]));
}

/**
 * Load tickets from file
 */
function loadTickets() {
    global $ticketsFile;
    $content = file_get_contents($ticketsFile);
    $data = json_decode($content, true);
    return $data['tickets'] ?? [];
}

/**
 * Save tickets to file
 */
function saveTickets($tickets) {
    global $ticketsFile;
    file_put_contents($ticketsFile, json_encode(['tickets' => $tickets], JSON_PRETTY_PRINT));
}

/**
 * Generate unique ID
 */
function generateId() {
    return uniqid('ticket_', true);
}

/**
 * Validate ticket data
 */
function validateTicket($data) {
    $errors = [];
    
    if (empty($data['title'])) {
        $errors[] = 'Title is required';
    }
    
    if (empty($data['description'])) {
        $errors[] = 'Description is required';
    }
    
    $validStatuses = ['open', 'in-progress', 'closed'];
    if (isset($data['status']) && !in_array($data['status'], $validStatuses)) {
        $errors[] = 'Invalid status';
    }
    
    return $errors;
}

/**
 * Send JSON response
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle GET - List all tickets
if ($method === 'GET') {
    $tickets = loadTickets();
    sendResponse(['tickets' => $tickets]);
}

// Handle POST - Create new ticket
if ($method === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Validate input
    $errors = validateTicket($data);
    if (!empty($errors)) {
        sendResponse(['error' => true, 'message' => implode(', ', $errors)], 400);
    }
    
    // Load existing tickets
    $tickets = loadTickets();
    
    // Create new ticket
    $ticket = [
        'id' => generateId(),
        'title' => $data['title'],
        'description' => $data['description'],
        'status' => $data['status'] ?? 'open',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ];
    
    // Add to tickets array
    $tickets[] = $ticket;
    
    // Save tickets
    saveTickets($tickets);
    
    sendResponse(['success' => true, 'ticket' => $ticket], 201);
}

// Handle PATCH - Update existing ticket
if ($method === 'PATCH') {
    $ticketId = $_GET['id'] ?? null;
    
    if (!$ticketId) {
        sendResponse(['error' => true, 'message' => 'Ticket ID is required'], 400);
    }
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Validate input
    $errors = validateTicket($data);
    if (!empty($errors)) {
        sendResponse(['error' => true, 'message' => implode(', ', $errors)], 400);
    }
    
    // Load tickets
    $tickets = loadTickets();
    
    // Find ticket to update
    $ticketIndex = null;
    foreach ($tickets as $index => $ticket) {
        if ($ticket['id'] === $ticketId) {
            $ticketIndex = $index;
            break;
        }
    }
    
    if ($ticketIndex === null) {
        sendResponse(['error' => true, 'message' => 'Ticket not found'], 404);
    }
    
    // Update ticket
    $tickets[$ticketIndex]['title'] = $data['title'];
    $tickets[$ticketIndex]['description'] = $data['description'];
    $tickets[$ticketIndex]['status'] = $data['status'] ?? $tickets[$ticketIndex]['status'];
    $tickets[$ticketIndex]['updated_at'] = date('Y-m-d H:i:s');
    
    // Save tickets
    saveTickets($tickets);
    
    sendResponse(['success' => true, 'ticket' => $tickets[$ticketIndex]]);
}

// Handle DELETE - Delete ticket
if ($method === 'DELETE') {
    $ticketId = $_GET['id'] ?? null;
    
    if (!$ticketId) {
        sendResponse(['error' => true, 'message' => 'Ticket ID is required'], 400);
    }
    
    // Load tickets
    $tickets = loadTickets();
    
    // Find and remove ticket
    $ticketIndex = null;
    foreach ($tickets as $index => $ticket) {
        if ($ticket['id'] === $ticketId) {
            $ticketIndex = $index;
            break;
        }
    }
    
    if ($ticketIndex === null) {
        sendResponse(['error' => true, 'message' => 'Ticket not found'], 404);
    }
    
    // Remove ticket
    array_splice($tickets, $ticketIndex, 1);
    
    // Save tickets
    saveTickets($tickets);
    
    sendResponse(['success' => true, 'message' => 'Ticket deleted successfully']);
}

sendResponse(['error' => true, 'message' => 'Method not allowed'], 405);
