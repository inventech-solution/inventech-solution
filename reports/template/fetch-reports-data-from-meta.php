<script>
// public/js/ajax/fetchReportData.js


function groupAdsData(ads, groupBy) {
    const groups = {};
    ads.forEach(ad => {
        let key;
        switch (groupBy) {
            case 'Ad Name':
                key = ad.name || 'Unknown';
                break;
            case 'Creative':
                key = ad.creative?.object_type || 'Unknown';
                break;
            case 'Copy':
                key = ad.creative?.body || 'Unknown';
                break;
            case 'Headline':
                key = ad.creative?.object_story_spec?.link_data?.name || 'Unknown';
                break;
            case 'Landing Page':
                key = ad.creative?.link_destination_display_url || 'Unknown';
                break;
            case 'CTA Button':
                key = ad.creative?.call_to_action_type || 'Unknown';
                break;
            case 'Discount Code':
                key = ad.creative?.asset_feed_spec?.bodies?.[0]?.text || 'Unknown';
                break;
            case 'Post ID':
                key = ad.creative?.object_story_id || 'Unknown';
                break;
            default:
                key = 'Ungrouped';
        }
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(ad);
    });
    return groups;
}

function computeMetricsByGroup(groups) {
    const result = {};
    Object.keys(groups).forEach(key => {
        const adsData = groups[key];
        result[key] = {
            spend: window.metrics.spend(adsData),
            impressions: window.metrics.impressions(adsData),
            clicks: window.metrics.clicks(adsData),
            ctr: window.metrics.ctr(adsData),
            purchase_roas: window.metrics.purchase_roas(adsData)
        };
    });
    return result;
}

function fetchReportData(start, end) {
    console.log('Fetching report data for:', start, 'to', end);

    $.ajax({
        url: '/inventech-solution/backend/controllers/FetchReportDataFromMeta.php',
        method: 'POST',
        data: {
            start_date: start,
            end_date: end,
            group_by: currentState.groupBy || 'Ad Name'
        },
        dataType: 'json',
        beforeSend: function() {
            $('#loading-indicator').show();
        },
        success: function(response) {
            $('#loading-indicator').hide();
            if (response.success) {
                console.log('Raw API Data:', response.data);

                const groups = groupAdsData(response.data || [], currentState.groupBy || 'Ad Name');
                console.log('Grouped Ads:', groups);
                const processed = computeMetricsByGroup(groups);

                console.log('Processed Metrics:', processed);

                const firstGroup = Object.keys(processed)[0];
                if (firstGroup && processed[firstGroup].spend !== undefined) {
                    $('#total-spend').text(`$${processed[firstGroup].spend}`);
                }
            } else {
                console.error('API Error:', response.message);
                alert('Failed to fetch report data');
            }
        },
        error: function(xhr, status, error) {
            $('#loading-indicator').hide();
            console.error('AJAX Error:', error);
            alert('An error occurred while fetching report data.');
        }
    });
}

// Make available globally before document ready
window.fetchReportDataFromPicker = function(start, end) {
    fetchReportData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
};

$(document).ready(function() {
    // Any code that uses fetchReportDataFromPicker now works
});

</script>