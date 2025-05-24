<?php
// Start output buffering and set content type
ob_start();
header('Content-Type: application/json');

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('memory_limit', '1024M'); // Set high for potentially large data
set_time_limit(600); // Set high for potentially long API calls

// --- CONFIGURATION AND SDK INITIALIZATION ---
// facebookConfig.php should have:
// 1. SDK autoloader
// 2. Api::init(app_id, app_secret, access_token) - VERIFIED in Turn 6 & 9
// 3. Modern default_graph_version for $fb (though Ads SDK version is what matters most for Api::instance()) - VERIFIED in Turn 6 & 9
require_once __DIR__ . '/../../facebookConfig.php'; 

// Check if $config is loaded (expected from facebookConfig.php which sources libs/facebookConfig.php)
if (!isset($config) || !is_array($config)) {
    echo json_encode(['success' => false, 'message' => 'Global configuration array $config not loaded. Check facebookConfig.php.']);
    if (ob_get_level() > 0) ob_end_flush();
    exit;
}

// Check for Ad Account ID in the loaded configuration
if (!isset($config['ad_account_id']) || empty($config['ad_account_id'])) {
    echo json_encode(['success' => false, 'message' => 'Ad Account ID not found or empty in configuration.']);
    if (ob_get_level() > 0) ob_end_flush();
    exit;
}
// Ensure 'act_' prefix is present if not already included in the config value
$adAccountId = strpos($config['ad_account_id'], 'act_') === 0 ? $config['ad_account_id'] : 'act_' . $config['ad_account_id'];

// --- SDK CLASS USES ---
use FacebookAds\Object\AdAccount;
use FacebookAds\Object\Campaign as FacebookCampaign; // Aliased
use FacebookAds\Object\AdSet as FacebookAdSet;     // Aliased
use FacebookAds\Object\Ad as FacebookAd;         // Aliased
use FacebookAds\Api; // Though Api::init is in facebookConfig.php, Api class might be used for other static methods if any.
use FacebookAds\Logger\CurlLogger; // Optional: for debugging
use FacebookAds\Object\Fields\CampaignFields;
use FacebookAds\Object\Fields\AdSetFields;
use FacebookAds\Object\Fields\AdFields;
use FacebookAds\Object\Fields\AdsInsightsFields;
use FacebookAds\Exception\FacebookResponseException;
use FacebookAds\Exception\FacebookSDKException;

// --- INPUT PROCESSING ---
$startDate = isset($_POST['start_date']) ? $_POST['start_date'] : null;
$endDate = isset($_POST['end_date']) ? $_POST['end_date'] : null;

// Validate date format (YYYY-MM-DD)
if (!$startDate || !$endDate || !preg_match("/^\d{4}-\d{2}-\d{2}$/", $startDate) || !preg_match("/^\d{4}-\d{2}-\d{2}$/", $endDate)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid or missing date range. Please use YYYY-MM-DD format.',
        'received_start_date' => htmlspecialchars($startDate ?? 'null'),
        'received_end_date' => htmlspecialchars($endDate ?? 'null')
    ]);
    if (ob_get_level() > 0) ob_end_flush();
    exit;
}
$timeRange = ['since' => $startDate, 'until' => $endDate];

// --- FIELD DEFINITIONS ---
$campaignFields = [
    CampaignFields::ID, CampaignFields::NAME, CampaignFields::OBJECTIVE, CampaignFields::STATUS,
    CampaignFields::BUYING_TYPE, CampaignFields::SPEND_CAP, CampaignFields::DAILY_BUDGET,
    CampaignFields::LIFETIME_BUDGET, CampaignFields::START_TIME, CampaignFields::STOP_TIME,
    CampaignFields::CREATED_TIME, CampaignFields::UPDATED_TIME,
];
$adSetFields = [
    AdSetFields::ID, AdSetFields::NAME, AdSetFields::CAMPAIGN_ID, AdSetFields::STATUS,
    AdSetFields::DAILY_BUDGET, AdSetFields::LIFETIME_BUDGET, AdSetFields::BID_AMOUNT,
    AdSetFields::BILLING_EVENT, AdSetFields::OPTIMIZATION_GOAL, AdSetFields::START_TIME,
    AdSetFields::END_TIME, AdSetFields::CREATED_TIME, AdSetFields::UPDATED_TIME,
];
$adFields = [
    AdFields::ID, AdFields::NAME, AdFields::ADSET_ID, 
    // AdFields::CAMPAIGN_ID, // Not directly available on Ad object, will get from AdSet
    AdFields::STATUS, AdFields::CREATIVE_ID, 
    AdFields::CREATED_TIME, AdFields::UPDATED_TIME,
];
$insightFields = [
    AdsInsightsFields::SPEND, AdsInsightsFields::IMPRESSIONS, AdsInsightsFields::REACH, AdsInsightsFields::FREQUENCY,
    AdsInsightsFields::CLICKS, AdsInsightsFields::CPC, AdsInsightsFields::CPM, AdsInsightsFields::CTR,
    AdsInsightsFields::UNIQUE_CLICKS, AdsInsightsFields::COST_PER_UNIQUE_CLICK, AdsInsightsFields::QUALITY_RANKING,
    AdsInsightsFields::ENGAGEMENT_RATE_RANKING, AdsInsightsFields::CONVERSION_RATE_RANKING, AdsInsightsFields::ACTIONS,
    AdsInsightsFields::ACTION_VALUES, AdsInsightsFields::COST_PER_ACTION_TYPE, AdsInsightsFields::CONVERSIONS,
    AdsInsightsFields::COST_PER_CONVERSION, AdsInsightsFields::WEBSITE_PURCHASE_ROAS, // Using specific 'website_purchase_roas'
    // Video Metrics
    AdsInsightsFields::VIDEO_P25_WATCHED_ACTIONS, AdsInsightsFields::VIDEO_P50_WATCHED_ACTIONS,
    AdsInsightsFields::VIDEO_P75_WATCHED_ACTIONS, AdsInsightsFields::VIDEO_P95_WATCHED_ACTIONS,
    AdsInsightsFields::VIDEO_P100_WATCHED_ACTIONS, AdsInsightsFields::VIDEO_AVG_TIME_WATCHED_ACTIONS,
    AdsInsightsFields::VIDEO_PLAY_ACTIONS, 
    // AdsInsightsFields::VIDEO_THRUPLAY_WATCHED_ACTIONS, // This is often 'video_view' under 'actions'
    AdsInsightsFields::THRUPLAY_ACTION, // Correct constant for ThruPlay, often maps to action type 'video_view'
    AdsInsightsFields::COST_PER_THRUPAY_ACTION, // Correct constant for Cost Per ThruPlay
];

// --- MAIN FETCHING LOGIC ---
$finalOutputData = [];
$campaignsMasterData = []; // Stores campaign details: id => data array
$adSetsMasterData = [];    // Stores adset details: id => data array

try {
    // Api::instance() is already initialized from facebookConfig.php
    // Optional: Add a logger for debugging SDK calls if issues persist
    // $api = Api::instance();
    // $api->setLogger(new CurlLogger(fopen('php://stderr', 'w'))); // Logs to stderr

    $account = new AdAccount($adAccountId);

    // 1. Fetch Campaigns (metadata only, for enriching ads later)
    // Insights for campaigns are not directly added to the final ad-centric output here
    // to avoid fetching data not immediately used in the primary structure.
    $campaignsCursor = $account->getCampaigns($campaignFields, ['limit' => 100]); // Adjust limit as needed
    $campaignsCursor->setUseImplicitFetch(true); // Enable auto-pagination
    while ($campaignsCursor->valid()) {
        $campaign = $campaignsCursor->current();
        $campaignsMasterData[$campaign->{CampaignFields::ID}] = $campaign->getData();
        $campaignsCursor->next();
    }

    // 2. Fetch Ad Sets (metadata only, for enriching ads later)
    // Insights for ad sets are not directly added to the final ad-centric output here.
    $adSetsCursor = $account->getAdSets($adSetFields, ['limit' => 200]); // Adjust limit
    $adSetsCursor->setUseImplicitFetch(true); // Enable auto-pagination
    while ($adSetsCursor->valid()) {
        $adSet = $adSetsCursor->current();
        $adSetsMasterData[$adSet->{AdSetFields::ID}] = $adSet->getData();
        $adSetsCursor->next();
    }

    // 3. Fetch Ads, their insights, and combine with Campaign/AdSet data
    $adsParams = ['limit' => 500]; // Adjust limit as needed for ads
    $adsCursor = $account->getAds($adFields, $adsParams); 
    $adsCursor->setUseImplicitFetch(true); // Enable auto-pagination

    while ($adsCursor->valid()) {
        $ad = $adsCursor->current();
        $adData = $ad->getData(); // Base ad data
        $adId = $ad->{AdFields::ID};
        $adSetIdFk = $ad->{AdFields::ADSET_ID};
        
        $adData['insights_data'] = []; // Initialize insights for the ad

        // Enrich with AdSet and Campaign Info
        if (isset($adSetsMasterData[$adSetIdFk])) {
            $adSetInfo = $adSetsMasterData[$adSetIdFk];
            $adData['adset_name'] = $adSetInfo[AdSetFields::NAME] ?? 'N/A';
            // Explicitly add campaign_id to ad data, taken from the adset
            $adData[AdSetFields::CAMPAIGN_ID] = $adSetInfo[AdSetFields::CAMPAIGN_ID] ?? 'N/A'; 

            $campaignIdFk = $adSetInfo[AdSetFields::CAMPAIGN_ID] ?? null;
            if ($campaignIdFk && isset($campaignsMasterData[$campaignIdFk])) {
                $campaignInfo = $campaignsMasterData[$campaignIdFk];
                $adData['campaign_name'] = $campaignInfo[CampaignFields::NAME] ?? 'N/A';
                $adData['campaign_objective'] = $campaignInfo[CampaignFields::OBJECTIVE] ?? 'N/A';
            } else {
                $adData['campaign_name'] = 'N/A (Campaign data not found for ID: ' . htmlspecialchars($campaignIdFk ?? '') . ')';
                $adData['campaign_objective'] = 'N/A';
            }
        } else {
            $adData['adset_name'] = 'N/A (AdSet data not found for ID: ' . htmlspecialchars($adSetIdFk) . ')';
            $adData[AdSetFields::CAMPAIGN_ID] = 'N/A'; // campaign_id from adset
            $adData['campaign_name'] = 'N/A';
            $adData['campaign_objective'] = 'N/A';
        }

        // Fetch insights for this specific Ad
        try {
            // Parameters for ad insights: level 'ad' and the time_range
            $insightsParams = array_merge($timeRange, ['level' => 'ad', 'limit' => 10]); // Limit insights if necessary, usually 1 per ad for a given range.
            $insightsCursor = $ad->getInsights($insightFields, $insightsParams);
            $insightsCursor->setUseImplicitFetch(true); // Auto-pagination for insights (though usually one page for ad level)
            
            while($insightsCursor->valid()) {
                $insightData = $insightsCursor->current()->getData();
                // Here you could further process specific insight fields if needed, e.g., summing actions
                $adData['insights_data'][] = $insightData;
                $insightsCursor->next();
            }
        } catch (FacebookResponseException $e) {
            // Log error for this specific ad's insights and continue with other ads
            error_log("Error fetching insights for ad {$adId}: " . $e->getMessage() . " | Subcode: " . $e->getSubErrorCode() . " | Ad Account: " . $adAccountId);
            $adData['insights_error'] = "Error fetching insights: " . $e->getMessage();
        }
        
        $finalOutputData[] = $adData; // Add enriched ad data to final list
        $adsCursor->next();
    }

    // --- OUTPUT ---
    echo json_encode([
        'success' => true, 
        'data' => $finalOutputData,
        'message' => 'Data fetched successfully. Ads processed: ' . count($finalOutputData),
        // Optional: include counts for debugging
        // 'debug_campaigns_loaded' => count($campaignsMasterData),
        // 'debug_adsets_loaded' => count($adSetsMasterData),
    ]);

} catch (FacebookResponseException $e) {
    // API error
    error_log("Facebook API Error (Overall): " . $e->getMessage() . " | Raw Response: " . $e->getRawResponse() . " | Ad Account: " . $adAccountId);
    echo json_encode([
        'success' => false,
        'message' => 'Facebook API Error: ' . $e->getMessage(),
        'error_details' => [
            'error_code' => $e->getCode(),
            'error_subcode' => $e->getSubErrorCode(),
            'error_type' => $e->getErrorType(),
            'error_user_title' => $e->getErrorUserTitle(),
            'error_user_msg' => $e->getErrorUserMessage(),
            // 'raw_response' => $e->getRawResponse() // Be careful with exposing raw response in production
        ]
    ]);
} catch (FacebookSDKException $e) {
    // SDK setup error or other SDK issue
    error_log("Facebook SDK Error (Overall): " . $e->getMessage() . " | Ad Account: " . $adAccountId);
    echo json_encode([
        'success' => false,
        'message' => 'Facebook SDK Error: ' . $e->getMessage(),
         'error_details' => [
            'error_code' => $e->getCode(),
        ]
    ]);
} catch (Exception $e) {
    // Other general errors
    error_log("General Error (Overall): " . $e->getMessage() . " | Trace: " . $e->getTraceAsString() . " | Ad Account: " . $adAccountId);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred: ' . $e->getMessage(),
        'error_details' => [
            'error_code' => $e->getCode(),
            // 'trace' => $e->getTraceAsString() // Be cautious with exposing trace in production
        ]
    ]);
} finally {
    // --- FINALIZATION ---
    if (ob_get_level() > 0) { // Check if output buffering is active
        ob_end_flush();
    }
}
?>