<?php
require_once( __DIR__ . '/libs/facebook-sdk/src/Facebook/autoload.php');

use Facebook\Facebook;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;

use FacebookAds\Api;
use FacebookAds\Object\Campaign;
use FacebookAds\Object\Fields\CampaignFields;

$config = require_once(__DIR__ . '/libs/facebookConfig.php');

// Initialize the Ads API
Api::init($config['app_id'], $config['app_secret'], $config['access_token']);
// Optionally, set a default API version for the Ads API if not relying on SDK default or per-call settings
// Api::instance()->setDefaultGraphVersion('v19.0');


$fb = new Facebook([
    'app_id' => $config['app_id'],
    'app_secret' => $config['app_secret'],
    'default_graph_version' => 'v19.0', // Updated to a modern version
    'default_access_token' => $config['access_token'],
]);
?>