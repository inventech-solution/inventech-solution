<?php

foreach ($insights['actions'] as $action) {
    if ($action['action_type'] == 'purchase') {
        $groupedAds[$groupKey]['Purchases'] = ($groupedAds[$groupKey]['Purchases'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'page_engagement') {
        $groupedAds[$groupKey]['Page Engagements'] = ($groupedAds[$groupKey]['Page Engagements'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'landing_page_view') {
        $groupedAds[$groupKey]['Landing Page Views'] = ($groupedAds[$groupKey]['Landing Page Views'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'add_to_cart') {
        $groupedAds[$groupKey]['Add to Carts'] = ($groupedAds[$groupKey]['Add to Carts'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'post_engagement') {
        $groupedAds[$groupKey]['Post Engagements'] = ($groupedAds[$groupKey]['Post Engagements'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'comment') {
        $groupedAds[$groupKey]['Comments'] = ($groupedAds[$groupKey]['Comments'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'view_content') {
        $groupedAds[$groupKey]['View Content'] = ($groupedAds[$groupKey]['View Content'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'like') {
        $groupedAds[$groupKey]['Likes'] = ($groupedAds[$groupKey]['Likes'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'add_payment_info') {
        $groupedAds[$groupKey]['Add Payment Info'] = ($groupedAds[$groupKey]['Add Payment Info'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'search') {
        $groupedAds[$groupKey]['Searches'] = ($groupedAds[$groupKey]['Searches'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'video_view') {
        $groupedAds[$groupKey]['Video Views'] = ($groupedAds[$groupKey]['Video Views'] ?? 0) + $action['value'];
    }
    if ($action['action_type'] == 'initiate_checkout') {
        $groupedAds[$groupKey]['Initiate Checkouts'] = ($groupedAds[$groupKey]['Initiate Checkouts'] ?? 0) + $action['value'];
    }  
}
if (!empty($insights['action_values'])) {
    foreach ($insights['action_values'] as $action_value) {
        if ($action_value['action_type'] == 'purchase') {
            $groupedAds[$groupKey]['Sales'] = ($groupedAds[$groupKey]['Sales'] ?? 0) + $action_value['value'];
        }
        if ($action_value['action_type'] == 'add_to_cart') {
            $groupedAds[$groupKey]['Add to Cart Value'] = ($groupedAds[$groupKey]['Add to Cart Value'] ?? 0) + $action_value['value'];
        }
        if ($action_value['action_type'] == 'add_payment_info') {
            $groupedAds[$groupKey]['Add Payment Info Value'] = ($groupedAds[$groupKey]['Add Payment Info Value'] ?? 0) + $action_value['value'];
        }
        if ($action_value['action_type'] == 'initiate_checkout') {
            $groupedAds[$groupKey]['Initiate Checkouts Value'] = ($groupedAds[$groupKey]['Initiate Checkouts Value'] ?? 0) + $action_value['value'];
        }
        if ($action_value['action_type'] == 'view_content') {
            $groupedAds[$groupKey]['View Content Value'] = ($groupedAds[$groupKey]['View Content Value'] ?? 0) + $action_value['value'];
        }
    }
}
if (!empty($insights['cost_per_action_type'])) {
    foreach ($insights['cost_per_action_type'] as $action_cost) {
        $value = floatval($action_cost['value']);
        if ($action_cost['action_type'] == 'purchase') {
            $groupedAds[$groupKey]['Cost Per Purchase_total'] = ($groupedAds[$groupKey]['Cost Per Purchase_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Purchase_count'] = ($groupedAds[$groupKey]['Cost Per Purchase_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'page_engagement') {
            $groupedAds[$groupKey]['Cost Per Page Engagement_total'] = ($groupedAds[$groupKey]['Cost Per Page Engagement_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Page Engagement_count'] = ($groupedAds[$groupKey]['Cost Per Page Engagement_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'landing_page_view') {
            $groupedAds[$groupKey]['Cost Per Landing Page Views_total'] = ($groupedAds[$groupKey]['Cost Per Landing Page Views_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Landing Page Views_count'] = ($groupedAds[$groupKey]['Cost Per Landing Page Views_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'add_to_cart') {
            $groupedAds[$groupKey]['Cost Per Add to Cart_total'] = ($groupedAds[$groupKey]['Cost Per Add to Cart_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Add to Cart_count'] = ($groupedAds[$groupKey]['Cost Per Add to Cart_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'post_engagement') {
            $groupedAds[$groupKey]['Cost Per Post Engagements_total'] = ($groupedAds[$groupKey]['Cost Per Post Engagements_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Post Engagements_count'] = ($groupedAds[$groupKey]['Cost Per Post Engagements_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'comment') {
            $groupedAds[$groupKey]['Cost Per Comment_total'] = ($groupedAds[$groupKey]['Cost Per Comment_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Comment_count'] = ($groupedAds[$groupKey]['Cost Per Comment_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'view_content') {
            $groupedAds[$groupKey]['Cost Per View Content_total'] = ($groupedAds[$groupKey]['Cost Per View Content_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per View Content_count'] = ($groupedAds[$groupKey]['Cost Per View Content_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'like') {
            $groupedAds[$groupKey]['Cost Per Like_total'] = ($groupedAds[$groupKey]['Cost Per Like_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Like_count'] = ($groupedAds[$groupKey]['Cost Per Like_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'add_payment_info') {
            $groupedAds[$groupKey]['Cost Per Add Payment Info_total'] = ($groupedAds[$groupKey]['Cost Per Add Payment Info_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Add Payment Info_count'] = ($groupedAds[$groupKey]['Cost Per Add Payment Info_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'search') {
            $groupedAds[$groupKey]['Cost Per Search_total'] = ($groupedAds[$groupKey]['Cost Per Search_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Search_count'] = ($groupedAds[$groupKey]['Cost Per Search_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'video_view') {
            $groupedAds[$groupKey]['Cost Per Video Views_total'] = ($groupedAds[$groupKey]['Cost Per Video Views_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Video Views_count'] = ($groupedAds[$groupKey]['Cost Per Video Views_count'] ?? 0) + 1;
        }
        if ($action_cost['action_type'] == 'initiate_checkout') {
            $groupedAds[$groupKey]['Cost Per Initiate Checkouts_total'] = ($groupedAds[$groupKey]['Cost Per Initiate Checkouts_total'] ?? 0) + $value;
            $groupedAds[$groupKey]['Cost Per Initiate Checkouts_count'] = ($groupedAds[$groupKey]['Cost Per Initiate Checkouts_count'] ?? 0) + 1;
        }
        foreach ($groupedAds as $key => &$group) {
            foreach ($group as $metric => $values) {
                if (strpos($metric, '_total') !== false) {
                    $baseMetric = str_replace('_total', '', $metric);
                    if ($group[$baseMetric . '_count'] > 0) {
                        $group[$baseMetric] = $group[$metric] / $group[$baseMetric . '_count'];
                    } else {
                        $group[$baseMetric] = 0; // Handle division by zero
                    }
                    // Optionally, remove temporary total and count keys after calculation
                    unset($group[$metric], $group[$baseMetric . '_count']);
                }
            }
        }
    }
}




?>