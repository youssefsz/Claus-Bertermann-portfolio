<?php
/**
 * Articles API for managing press/charity articles
 * Handles CRUD operations with optional image processing
 */

// Start session for authentication check
session_start();

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
define('ARTICLES_JSON_PATH', __DIR__ . '/data/Articles.json');
define('UPLOADS_DIR', __DIR__ . '/uploads/');
define('ARTICLES_DIR', UPLOADS_DIR . 'articles/');
define('COMPRESSION_QUALITY', 80);

/**
 * Verify admin authentication
 */
function isAuthenticated() {
    return isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true;
}

/**
 * Send JSON response
 */
function sendResponse($success, $message, $data = null, $httpCode = 200) {
    http_response_code($httpCode);
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
 * Load articles data from JSON file
 */
function loadArticlesData() {
    if (!file_exists(ARTICLES_JSON_PATH)) {
        return ['articles' => []];
    }
    
    $jsonContent = file_get_contents(ARTICLES_JSON_PATH);
    $data = json_decode($jsonContent, true);
    
    return $data ? $data : ['articles' => []];
}

/**
 * Save articles data to JSON file
 */
function saveArticlesData($data) {
    $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents(ARTICLES_JSON_PATH, $jsonContent) !== false;
}

/**
 * Convert image to WebP format
 * Supports JPG, PNG, GIF input formats
 */
function convertToWebP($sourcePath, $destinationPath, $quality = 80) {
    // Get image info
    $imageInfo = getimagesize($sourcePath);
    if (!$imageInfo) {
        return false;
    }
    
    $mimeType = $imageInfo['mime'];
    
    // Create image resource from source
    switch ($mimeType) {
        case 'image/jpeg':
            $image = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $image = imagecreatefrompng($sourcePath);
            break;
        case 'image/gif':
            $image = imagecreatefromgif($sourcePath);
            break;
        case 'image/webp':
            $image = imagecreatefromwebp($sourcePath);
            break;
        default:
            return false;
    }
    
    if (!$image) {
        return false;
    }
    
    // Save as WebP
    $success = imagewebp($image, $destinationPath, $quality);
    imagedestroy($image);
    
    return $success;
}

/**
 * Process uploaded image for article
 */
function processUploadedImage($uploadedFile, $articleId) {
    $imagePath = ARTICLES_DIR . $articleId . '.webp';
    
    // Convert to WebP - compressed (80%)
    if (!convertToWebP($uploadedFile['tmp_name'], $imagePath, COMPRESSION_QUALITY)) {
        return [
            'success' => false,
            'message' => 'Failed to create article image'
        ];
    }
    
    return [
        'success' => true,
        'imagePath' => '/API/uploads/articles/' . $articleId . '.webp'
    ];
}

/**
 * Generate unique article ID
 */
function generateArticleId() {
    return 'ART' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 3));
}

/**
 * Handle GET request - Return all articles
 */
function handleGet() {
    $data = loadArticlesData();
    sendResponse(true, 'Articles data retrieved', $data['articles']);
}

/**
 * Handle POST request - Add new article
 */
function handlePost() {
    if (!isAuthenticated()) {
        sendResponse(false, 'Unauthorized', null, 401);
    }
    
    // Get form data
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $source = isset($_POST['source']) ? trim($_POST['source']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $date = isset($_POST['date']) ? trim($_POST['date']) : date('Y-m-d');
    $url = isset($_POST['url']) ? trim($_POST['url']) : '';
    
    if (empty($title)) {
        sendResponse(false, 'Title is required');
    }
    
    if (empty($source)) {
        sendResponse(false, 'Source is required');
    }
    
    if (empty($description)) {
        sendResponse(false, 'Description is required');
    }
    
    // Generate unique ID
    $articleId = generateArticleId();
    
    // Process image if uploaded
    $imagePath = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $processResult = processUploadedImage($_FILES['image'], $articleId);
        
        if (!$processResult['success']) {
            sendResponse(false, $processResult['message']);
        }
        
        $imagePath = $processResult['imagePath'];
    }
    
    // Load existing data
    $data = loadArticlesData();
    
    // Increment order for all existing articles to make room for new article at the beginning
    foreach ($data['articles'] as &$article) {
        if (isset($article['order'])) {
            $article['order'] = $article['order'] + 1;
        }
    }
    
    // Create new article entry with order 0 (first position)
    $newArticle = [
        'id' => $articleId,
        'title' => $title,
        'source' => $source,
        'description' => $description,
        'date' => $date,
        'url' => $url,
        'image' => $imagePath,
        'order' => 0
    ];
    
    // Add to data
    $data['articles'][] = $newArticle;
    
    // Save
    if (!saveArticlesData($data)) {
        sendResponse(false, 'Failed to save articles data');
    }
    
    sendResponse(true, 'Article added successfully', $newArticle);
}

/**
 * Handle PUT request - Update article or reorder
 */
function handlePut() {
    if (!isAuthenticated()) {
        sendResponse(false, 'Unauthorized', null, 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['action'])) {
        sendResponse(false, 'Action is required');
    }
    
    $data = loadArticlesData();
    
    if ($input['action'] === 'reorder') {
        // Handle reordering
        if (!isset($input['articles']) || !is_array($input['articles'])) {
            sendResponse(false, 'Articles array is required for reordering');
        }
        
        // Update order for all articles
        foreach ($input['articles'] as $index => $articleData) {
            foreach ($data['articles'] as &$article) {
                if ($article['id'] === $articleData['id']) {
                    $article['order'] = $index;
                    break;
                }
            }
        }
        
        if (!saveArticlesData($data)) {
            sendResponse(false, 'Failed to save reordered data');
        }
        
        sendResponse(true, 'Articles reordered successfully');
        
    } elseif ($input['action'] === 'update') {
        // Handle article details update
        if (!isset($input['id'])) {
            sendResponse(false, 'Article ID is required');
        }
        
        $articleId = $input['id'];
        $found = false;
        
        foreach ($data['articles'] as &$article) {
            if ($article['id'] === $articleId) {
                // Update fields if provided
                if (isset($input['title'])) $article['title'] = $input['title'];
                if (isset($input['source'])) $article['source'] = $input['source'];
                if (isset($input['description'])) $article['description'] = $input['description'];
                if (isset($input['date'])) $article['date'] = $input['date'];
                if (isset($input['url'])) $article['url'] = $input['url'];
                
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            sendResponse(false, 'Article not found');
        }
        
        if (!saveArticlesData($data)) {
            sendResponse(false, 'Failed to save updated data');
        }
        
        sendResponse(true, 'Article updated successfully');
    } else {
        sendResponse(false, 'Invalid action');
    }
}

/**
 * Handle DELETE request - Remove article
 */
function handleDelete() {
    if (!isAuthenticated()) {
        sendResponse(false, 'Unauthorized', null, 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        sendResponse(false, 'Article ID is required');
    }
    
    $articleId = $input['id'];
    $data = loadArticlesData();
    $found = false;
    $articleToDelete = null;
    
    // Find and remove article from data
    foreach ($data['articles'] as $index => $article) {
        if ($article['id'] === $articleId) {
            $articleToDelete = $article;
            array_splice($data['articles'], $index, 1);
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        sendResponse(false, 'Article not found');
    }
    
    // Delete physical image file if it exists
    if (!empty($articleToDelete['image'])) {
        $imageFile = ARTICLES_DIR . $articleId . '.webp';
        if (file_exists($imageFile)) {
            unlink($imageFile);
        }
    }
    
    // Save updated data
    if (!saveArticlesData($data)) {
        sendResponse(false, 'Failed to save data after deletion');
    }
    
    sendResponse(true, 'Article deleted successfully');
}

// Ensure directories exist
if (!file_exists(UPLOADS_DIR)) {
    mkdir(UPLOADS_DIR, 0755, true);
}
if (!file_exists(ARTICLES_DIR)) {
    mkdir(ARTICLES_DIR, 0755, true);
}

// Ensure data directory exists
$dataDir = dirname(ARTICLES_JSON_PATH);
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Route based on request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        handlePost();
        break;
    case 'PUT':
        handlePut();
        break;
    case 'DELETE':
        handleDelete();
        break;
    default:
        sendResponse(false, 'Method not allowed', null, 405);
}

