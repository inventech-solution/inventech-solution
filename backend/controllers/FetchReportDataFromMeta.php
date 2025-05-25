<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../facebookConfig.php';
require_once __DIR__ . '/../models/Metrics.php';

function groupAds(array $ads, string $groupBy): array {
    $groups = [];
    foreach ($ads as $ad) {
        switch ($groupBy) {
            case 'Ad Name':
                $key = $ad['name'] ?? 'Unknown';
                break;
            case 'Creative':
                $key = $ad['creative']['object_type'] ?? 'Unknown';
                break;
            case 'Copy':
                $key = $ad['creative']['body'] ?? 'Unknown';
                break;
            case 'Headline':
                $key = $ad['creative']['object_story_spec']['link_data']['name'] ?? 'Unknown';
                break;
            case 'Landing Page':
                $key = $ad['creative']['link_destination_display_url'] ?? 'Unknown';
                break;
            case 'CTA Button':
                $key = $ad['creative']['call_to_action_type'] ?? 'Unknown';
                break;
            case 'Discount Code':
                $key = $ad['creative']['asset_feed_spec']['bodies'][0]['text'] ?? 'Unknown';
                break;
            case 'Post ID':
                $key = $ad['creative']['object_story_id'] ?? 'Unknown';
                break;
            default:
                $key = 'Ungrouped';
        }
        $groups[$key][] = $ad;
    }
    return $groups;
}

function metricsByGroup(array $groups): array {
    $result = [];
    foreach ($groups as $key => $ads) {
        $result[$key] = [
            'spend' => Metrics::spend($ads),
            'impressions' => Metrics::impressions($ads),
            'clicks' => Metrics::clicks($ads),
            'ctr' => Metrics::ctr($ads),
            'purchase_roas' => Metrics::purchase_roas($ads)
        ];
    }
    return $result;
}

function validateDate(string $date)
{
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date ? $d : false;
}

$startDateStr = $_POST['start_date'] ?? '';
$endDateStr   = $_POST['end_date'] ?? '';
$groupBy      = $_POST['group_by'] ?? 'Ad Name';

$startDate = validateDate($startDateStr);
$endDate   = validateDate($endDateStr);

if (!$startDate || !$endDate) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid start or end date']);
    exit;
}

if ($startDate > $endDate) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Start date cannot be after end date']);
    exit;
}

$startDate = $startDate->format('Y-m-d');
$endDate   = $endDate->format('Y-m-d');

$adAccountId = $config['ad_account_id'];

try {

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
        'video_p95_watched_actions'
    ];

    $creativeFields = 'object_story_id,thumbnail_url,object_story_spec,asset_feed_spec,call_to_action_type,body,link_destination_display_url,status,video_id,branded_content,object_type';
    $fields = 'id,campaign{name},adset{name},name,adcreatives{object_story_spec},creative{' . $creativeFields . '},insights.time_range({\'since\':\'' .$startDate . '\',\'until\':\'' . $endDate . '\'}){actions,cost_per_action_type,action_values,' . implode(',', $insightMetrics) . '}'; // Changed to implode for better readability and consistency


    //echo json_encode(['success' => false, 'message' => "/$adAccountId/ads?fields=" . $fields]);
    $response = $fb->get("/$adAccountId/ads?fields=" . $fields);
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
} catch (FacebookResponseException $e) {
    // Permission or other API errors
    if ($e->getCode() === 10) {
        // Missing permission for ad account access
        echo json_encode(['success' => false, 'message' => 'API error: ' . $e->getMessage()]);
    } else {
        //echo json_encode(['success' => false, 'message' => 'API error: ' . $e->getMessage()]);
    }
    //echo json_encode(['success' => false, 'message' => 'API error: ' . $e->getMessage()]);
} catch (FacebookSDKException $e) {
    echo json_encode(['success' => false, 'message' => 'SDK error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

?>

