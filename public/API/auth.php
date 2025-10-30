<?php
/**
 * Authentication API for Admin Dashboard
 * Handles login, logout, and session verification
 */

// Start session for authentication
session_start();

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers - Allow requests from any origin in development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Admin password 
define('ADMIN_PASSWORD', 'admin123');

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

/**
 * Sends JSON response
 */
function sendResponse($success, $message, $data = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit();
}

/**
 * Handle Login
 */
function handleLogin() {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['password'])) {
        sendResponse(false, 'Password is required');
    }
    
    $password = $input['password'];
    
    // Verify password
    if ($password === ADMIN_PASSWORD) {
        // Set session
        $_SESSION['admin_authenticated'] = true;
        $_SESSION['login_time'] = time();
        
        sendResponse(true, 'Login successful', [
            'authenticated' => true
        ]);
    } else {
        sendResponse(false, 'Invalid password');
    }
}

/**
 * Handle Logout
 */
function handleLogout() {
    // Destroy session
    session_unset();
    session_destroy();
    
    sendResponse(true, 'Logout successful');
}

/**
 * Check Authentication Status
 */
function handleCheckAuth() {
    $authenticated = isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true;
    
    sendResponse(true, $authenticated ? 'Authenticated' : 'Not authenticated', [
        'authenticated' => $authenticated
    ]);
}

// Route requests based on action parameter
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = isset($input['action']) ? $input['action'] : '';
    
    switch ($action) {
        case 'login':
            handleLogin();
            break;
        case 'logout':
            handleLogout();
            break;
        default:
            sendResponse(false, 'Invalid action');
    }
} elseif ($method === 'GET') {
    // Check authentication status
    handleCheckAuth();
} else {
    sendResponse(false, 'Method not allowed');
}

