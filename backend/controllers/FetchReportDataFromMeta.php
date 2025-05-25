<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../facebookConfig.php';

function isValidDate($date)
{
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

$startDate = $_POST['start_date'] ?? null;
$endDate   = $_POST['end_date'] ?? null;

if (!$startDate || !$endDate || !isValidDate($startDate) || !isValidDate($endDate)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing or invalid date range']);
    exit;
}

$adAccountId = $config['ad_account_id'];

try {
    $timeRange = json_encode(['since' => $startDate, 'until' => $endDate]);

    $insightMetrics = [
        'spend',
        'clicks',
        'impressions',
        'video_play_actions',
        'outbound_clicks',
        'ctr',
        'video_thruplay_watched_actions',
        'video_avg_time_watched_actions',
        'video_p100_watched_actions',
        'video_p25_watched_actions',
        'video_p50_watched_actions',
        'video_p75_watched_actions',
        'video_p95_watched_actions',
        'actions',
        'cost_per_action_type',
        'action_values'
    ];

    $creativeFields = 'object_story_id,thumbnail_url,object_story_spec,asset_feed_spec,call_to_action_type,body,link_destination_display_url,status,video_id,branded_content,object_type';
    $fields = 'id,name,creative{' . $creativeFields . '},insights.fields(' . implode(',', $insightMetrics) . ')';

    $response = $fb->get("/$adAccountId/ads?fields=" . urlencode($fields) . "&time_range=$timeRange&limit=100");
    $ads = $response->getDecodedBody();

    if (!empty($ads['data'])) {
        foreach ($ads['data'] as &$ad) {
            $videoId = $ad['creative']['video_id'] ?? $ad['creative']['object_story_id'] ?? null;
            if ($videoId) {
                $videoResp = $fb->get("/$videoId?fields=permalink_url,embed_html,thumbnails");
                $ad['video_details'] = $videoResp->getDecodedBody();
            }
        }
    }

    echo json_encode(['success' => true, 'data' => $ads]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'API error: ' . $e->getMessage()]);
}

?>

