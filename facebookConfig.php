<?php
require_once( __DIR__ . '/libs/facebook-sdk/src/Facebook/autoload.php');

use Facebook\Facebook;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;

use FacebookAds\Api;
use FacebookAds\Object\Campaign;
use FacebookAds\Object\Fields\CampaignFields;

$config = require_once(__DIR__ . '/libs/facebookConfig.php');

$fb = new Facebook([
    'app_id' => $config['app_id'],
    'app_secret' => $config['app_secret'],
    'default_graph_version' => 'v3.2', // Make sure to set a default version
    'default_access_token' => $config['access_token'],
]);
?>