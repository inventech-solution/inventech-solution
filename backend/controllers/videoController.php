<?php
// videoController.php
header('Content-Type: application/json');
include "../../facebookConfig.php";
require_once 'MetricParser.php'; // Ensure this path is correct

$ad_account_id = 'act_984386718779769'; // Your ad account ID
$dateRange = isset($_POST['date_range']) ? explode(' to ', str_replace(['–', '—'], 'to', $_POST['date_range'])) : [];

// Ensure the date range is valid
if (count($dateRange) !== 2) {
    error_log('Missing or invalid date range');
    echo json_encode(['error' => 'Missing or invalid date range']);
    exit;
}

$since = date('Y-m-d', strtotime($dateRange[0]));
$until = date('Y-m-d', strtotime($dateRange[1]));

try {
    // Building the Facebook Graph API fields for the insights request
    $fields = "actions,ad_name,ad_id&level=ad&action_breakdowns=action_type&time_ranges=[{since:'$since','until':'$until'}]&limit=200";

    // Fetch the data from Facebook API
    $response = $fb->get("/$ad_account_id/insights?fields=$fields");

    // Fetch the data as an array
    $ads = $response->getGraphEdge()->asArray();
    
    // Return the data as JSON
    echo json_encode(['data' => $ads]);
} catch (Exception $e) {
    // Set appropriate HTTP response code for errors
    http_response_code(500); // Server error
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
