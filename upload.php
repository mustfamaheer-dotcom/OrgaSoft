<?php
// upload.php - Upload this file to public_html/uploads/ on your cPanel server

// Allow cross-origin requests from the frontend app
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, token");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Secure token to prevent unauthorized uploads
// This MUST match the VITE_UPLOAD_SECRET_TOKEN in your React app's .env file
$EXPECTED_TOKEN = "orga4soft_secure_upload_token_2027";

// Save in the same directory as this script (i.e., public_html/uploads)
$UPLOAD_DIR = __DIR__ . '/'; 
$BASE_URL = "https://www.orga4soft.com/uploads/";

// 1. Check Authorization Token
$token = isset($_POST['token']) ? $_POST['token'] : '';
if ($token !== $EXPECTED_TOKEN) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized: Invalid token"]);
    exit();
}

// 2. Check File Exists
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["error" => "No file uploaded or upload error occurred."]);
    exit();
}

$file = $_FILES['file'];

// 3. Basic Security Validations
$allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$fileMimeType = mime_content_type($file['tmp_name']);

if (!in_array($fileMimeType, $allowedMimeTypes)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed."]);
    exit();
}

$fileName = basename($file['name']);
// Sanitize file name (keep alphanumeric, dot, and dash)
$fileName = preg_replace("/[^a-zA-Z0-9.-]/", "_", $fileName);
// Add a timestamp to prevent overwriting files with the same name
$fileName = time() . '_' . $fileName; 

$targetPath = $UPLOAD_DIR . $fileName;

// 4. Save the file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode(["url" => $BASE_URL . $fileName]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to move uploaded file to destination."]);
}
?>
