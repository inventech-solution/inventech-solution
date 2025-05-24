<?php
// facebookAPI.php
header('Content-Type: application/json');
include "../../facebookConfig.php";

$ad_account_id = 'act_984386718779769';

try {
    $response = $fb->get("/$ad_account_id/?fields=currency");
    $body = $response->getDecodedBody();

    echo json_encode($body);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'API error: ' . $e->getMessage()]);
}
?>
