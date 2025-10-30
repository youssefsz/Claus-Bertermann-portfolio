<?php
/**
 * Auction API for managing auctioned works
 * Handles CRUD operations with image processing
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
define('AUCTION_JSON_PATH', __DIR__ . '/data/Auction.json');
define('UPLOADS_DIR', __DIR__ . '/uploads/');
define('ORIGINALS_DIR', UPLOADS_DIR . 'originals/');
define('THUMBS_DIR', UPLOADS_DIR . 'thumbs/');
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
 * Load auction data from JSON file
 */
function loadAuctionData() {
    if (!file_exists(AUCTION_JSON_PATH)) {
        return ['works' => []];
    }
    
    $jsonContent = file_get_contents(AUCTION_JSON_PATH);
    $data = json_decode($jsonContent, true);
    
    return $data ? $data : ['works' => []];
}

/**
 * Save auction data to JSON file
 */
function saveAuctionData($data) {
    $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents(AUCTION_JSON_PATH, $jsonContent) !== false;
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
 * Process uploaded image: create original and thumbnail WebP versions
 */
function processUploadedImage($uploadedFile, $imageId) {
    $originalPath = ORIGINALS_DIR . $imageId . '.webp';
    $thumbPath = THUMBS_DIR . $imageId . '.webp';
    
    // Convert to WebP - original quality (100%)
    if (!convertToWebP($uploadedFile['tmp_name'], $originalPath, 100)) {
        return [
            'success' => false,
            'message' => 'Failed to create original WebP image'
        ];
    }
    
    // Convert to WebP - compressed thumbnail (80%)
    if (!convertToWebP($uploadedFile['tmp_name'], $thumbPath, COMPRESSION_QUALITY)) {
        // Cleanup original if thumbnail fails
        if (file_exists($originalPath)) {
            unlink($originalPath);
        }
        return [
            'success' => false,
            'message' => 'Failed to create thumbnail WebP image'
        ];
    }
    
    return [
        'success' => true,
        'originalPath' => '/API/uploads/originals/' . $imageId . '.webp',
        'thumbnailPath' => '/API/uploads/thumbs/' . $imageId . '.webp'
    ];
}

/**
 * Generate unique image ID
 */
function generateImageId() {
    return strtoupper(substr(md5(uniqid(rand(), true)), 0, 4));
}

/**
 * Handle GET request - Return all auction works
 */
function handleGet() {
    $data = loadAuctionData();
    sendResponse(true, 'Auction data retrieved', $data['works']);
}

/**
 * Handle POST request - Add new auction work
 */
function handlePost() {
    if (!isAuthenticated()) {
        sendResponse(false, 'Unauthorized', null, 401);
    }
    
    // Check if image file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        sendResponse(false, 'No image file uploaded or upload error');
    }
    
    // Get form data
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $dimensions = isset($_POST['dimensions']) ? trim($_POST['dimensions']) : '';
    $medium = isset($_POST['medium']) ? trim($_POST['medium']) : 'Oil on Canvas';
    $price = isset($_POST['price']) ? trim($_POST['price']) : '';
    $auctionHouse = isset($_POST['auctionHouse']) ? trim($_POST['auctionHouse']) : '';
    
    if (empty($title)) {
        sendResponse(false, 'Title is required');
    }
    
    if (empty($price)) {
        sendResponse(false, 'Price is required');
    }
    
    if (empty($auctionHouse)) {
        sendResponse(false, 'Auction house is required');
    }
    
    // Generate unique ID
    $imageId = generateImageId();
    
    // Process image
    $processResult = processUploadedImage($_FILES['image'], $imageId);
    
    if (!$processResult['success']) {
        sendResponse(false, $processResult['message']);
    }
    
    // Load existing data
    $data = loadAuctionData();
    
    // Increment order for all existing works to make room for new work at the beginning
    foreach ($data['works'] as &$work) {
        if (isset($work['order'])) {
            $work['order'] = $work['order'] + 1;
        }
    }
    
    // Create new work entry with order 0 (first position)
    $newWork = [
        'id' => $imageId,
        'title' => $title,
        'dimensions' => $dimensions,
        'medium' => $medium,
        'price' => $price,
        'auctionHouse' => $auctionHouse,
        'image' => $processResult['originalPath'],
        'order' => 0
    ];
    
    // Add to data
    $data['works'][] = $newWork;
    
    // Save
    if (!saveAuctionData($data)) {
        sendResponse(false, 'Failed to save auction data');
    }
    
    sendResponse(true, 'Auction work added successfully', $newWork);
}

/**
 * Handle PUT request - Update work or reorder
 */
function handlePut() {
    if (!isAuthenticated()) {
        sendResponse(false, 'Unauthorized', null, 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['action'])) {
        sendResponse(false, 'Action is required');
    }
    
    $data = loadAuctionData();
    
    if ($input['action'] === 'reorder') {
        // Handle reordering
        if (!isset($input['works']) || !is_array($input['works'])) {
            sendResponse(false, 'Works array is required for reordering');
        }
        
        // Update order for all works
        foreach ($input['works'] as $index => $workData) {
            foreach ($data['works'] as &$work) {
                if ($work['id'] === $workData['id']) {
                    $work['order'] = $index;
                    break;
                }
            }
        }
        
        if (!saveAuctionData($data)) {
            sendResponse(false, 'Failed to save reordered data');
        }
        
        sendResponse(true, 'Works reordered successfully');
        
    } elseif ($input['action'] === 'update') {
        // Handle work details update
        if (!isset($input['id'])) {
            sendResponse(false, 'Work ID is required');
        }
        
        $workId = $input['id'];
        $found = false;
        
        foreach ($data['works'] as &$work) {
            if ($work['id'] === $workId) {
                // Update fields if provided
                if (isset($input['title'])) $work['title'] = $input['title'];
                if (isset($input['dimensions'])) $work['dimensions'] = $input['dimensions'];
                if (isset($input['medium'])) $work['medium'] = $input['medium'];
                if (isset($input['price'])) $work['price'] = $input['price'];
                if (isset($input['auctionHouse'])) $work['auctionHouse'] = $input['auctionHouse'];
                
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            sendResponse(false, 'Work not found');
        }
        
        if (!saveAuctionData($data)) {
            sendResponse(false, 'Failed to save updated data');
        }
        
        sendResponse(true, 'Work updated successfully');
    } else {
        sendResponse(false, 'Invalid action');
    }
}

/**
 * Handle DELETE request - Remove work
 */
function handleDelete() {
    if (!isAuthenticated()) {
        sendResponse(false, 'Unauthorized', null, 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        sendResponse(false, 'Work ID is required');
    }
    
    $workId = $input['id'];
    $data = loadAuctionData();
    $found = false;
    $workToDelete = null;
    
    // Find and remove work from data
    foreach ($data['works'] as $index => $work) {
        if ($work['id'] === $workId) {
            $workToDelete = $work;
            array_splice($data['works'], $index, 1);
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        sendResponse(false, 'Work not found');
    }
    
    // Delete physical files if they exist in uploads
    $originalFile = ORIGINALS_DIR . $workId . '.webp';
    $thumbFile = THUMBS_DIR . $workId . '.webp';
    
    if (file_exists($originalFile)) {
        unlink($originalFile);
    }
    
    if (file_exists($thumbFile)) {
        unlink($thumbFile);
    }
    
    // Save updated data
    if (!saveAuctionData($data)) {
        sendResponse(false, 'Failed to save data after deletion');
    }
    
    sendResponse(true, 'Work deleted successfully');
}

// Ensure directories exist
if (!file_exists(UPLOADS_DIR)) {
    mkdir(UPLOADS_DIR, 0755, true);
}
if (!file_exists(ORIGINALS_DIR)) {
    mkdir(ORIGINALS_DIR, 0755, true);
}
if (!file_exists(THUMBS_DIR)) {
    mkdir(THUMBS_DIR, 0755, true);
}

// Ensure data directory exists
$dataDir = dirname(AUCTION_JSON_PATH);
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
