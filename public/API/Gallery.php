<?php
/**
 * Gallery API for managing gallery images
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
define('GALLERY_JSON_PATH', __DIR__ . '/data/Gallery.json');
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
 * Load gallery data from JSON file
 */
function loadGalleryData() {
    if (!file_exists(GALLERY_JSON_PATH)) {
        return ['images' => []];
    }
    
    $jsonContent = file_get_contents(GALLERY_JSON_PATH);
    $data = json_decode($jsonContent, true);
    
    return $data ? $data : ['images' => []];
}

/**
 * Save gallery data to JSON file
 */
function saveGalleryData($data) {
    $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents(GALLERY_JSON_PATH, $jsonContent) !== false;
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
 * Handle GET request - Return all gallery images
 */
function handleGet() {
    $data = loadGalleryData();
    sendResponse(true, 'Gallery data retrieved', $data['images']);
}

/**
 * Handle POST request - Add new image
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
    $year = isset($_POST['year']) ? trim($_POST['year']) : date('Y');
    
    if (empty($title)) {
        sendResponse(false, 'Title is required');
    }
    
    // Generate unique ID
    $imageId = generateImageId();
    
    // Process image
    $processResult = processUploadedImage($_FILES['image'], $imageId);
    
    if (!$processResult['success']) {
        sendResponse(false, $processResult['message']);
    }
    
    // Load existing data
    $data = loadGalleryData();
    
    // Increment order for all existing images to make room for new image at the beginning
    foreach ($data['images'] as &$img) {
        if (isset($img['order'])) {
            $img['order'] = $img['order'] + 1;
        }
    }
    
    // Create new image entry with order 0 (first position)
    $newImage = [
        'id' => $imageId,
        'title' => $title,
        'dimensions' => $dimensions,
        'medium' => $medium,
        'year' => $year,
        'thumbnailPath' => $processResult['thumbnailPath'],
        'originalPath' => $processResult['originalPath'],
        'order' => 0
    ];
    
    // Add to data
    $data['images'][] = $newImage;
    
    // Save
    if (!saveGalleryData($data)) {
        sendResponse(false, 'Failed to save gallery data');
    }
    
    sendResponse(true, 'Image added successfully', $newImage);
}

/**
 * Handle PUT request - Update image or reorder
 */
function handlePut() {
    if (!isAuthenticated()) {
        sendResponse(false, 'Unauthorized', null, 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['action'])) {
        sendResponse(false, 'Action is required');
    }
    
    $data = loadGalleryData();
    
    if ($input['action'] === 'reorder') {
        // Handle reordering
        if (!isset($input['images']) || !is_array($input['images'])) {
            sendResponse(false, 'Images array is required for reordering');
        }
        
        // Update order for all images
        foreach ($input['images'] as $index => $imageData) {
            foreach ($data['images'] as &$img) {
                if ($img['id'] === $imageData['id']) {
                    $img['order'] = $index;
                    break;
                }
            }
        }
        
        if (!saveGalleryData($data)) {
            sendResponse(false, 'Failed to save reordered data');
        }
        
        sendResponse(true, 'Images reordered successfully');
        
    } elseif ($input['action'] === 'update') {
        // Handle image details update
        if (!isset($input['id'])) {
            sendResponse(false, 'Image ID is required');
        }
        
        $imageId = $input['id'];
        $found = false;
        
        foreach ($data['images'] as &$img) {
            if ($img['id'] === $imageId) {
                // Update fields if provided
                if (isset($input['title'])) $img['title'] = $input['title'];
                if (isset($input['dimensions'])) $img['dimensions'] = $input['dimensions'];
                if (isset($input['medium'])) $img['medium'] = $input['medium'];
                if (isset($input['year'])) $img['year'] = $input['year'];
                
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            sendResponse(false, 'Image not found');
        }
        
        if (!saveGalleryData($data)) {
            sendResponse(false, 'Failed to save updated data');
        }
        
        sendResponse(true, 'Image updated successfully');
    } else {
        sendResponse(false, 'Invalid action');
    }
}

/**
 * Handle DELETE request - Remove image
 */
function handleDelete() {
    if (!isAuthenticated()) {
        sendResponse(false, 'Unauthorized', null, 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        sendResponse(false, 'Image ID is required');
    }
    
    $imageId = $input['id'];
    $data = loadGalleryData();
    $found = false;
    $imageToDelete = null;
    
    // Find and remove image from data
    foreach ($data['images'] as $index => $img) {
        if ($img['id'] === $imageId) {
            $imageToDelete = $img;
            array_splice($data['images'], $index, 1);
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        sendResponse(false, 'Image not found');
    }
    
    // Delete physical files
    $originalFile = ORIGINALS_DIR . $imageId . '.webp';
    $thumbFile = THUMBS_DIR . $imageId . '.webp';
    
    if (file_exists($originalFile)) {
        unlink($originalFile);
    }
    
    if (file_exists($thumbFile)) {
        unlink($thumbFile);
    }
    
    // Save updated data
    if (!saveGalleryData($data)) {
        sendResponse(false, 'Failed to save data after deletion');
    }
    
    sendResponse(true, 'Image deleted successfully');
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

