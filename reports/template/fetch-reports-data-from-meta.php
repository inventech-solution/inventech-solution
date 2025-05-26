<script>
// public/js/ajax/fetchReportData.js


function groupAdsData(ads, groupBy) {
    const groups = {};
    const adArray = Array.isArray(ads) ? ads : (ads && Array.isArray(ads.data) ? ads.data : []);
    adArray.forEach(ad => {
        // Facebook API returns insights as an object with a `data` array
        // but our metric calculations expect `insights` to be an array.
        if (ad.insights && Array.isArray(ad.insights.data)) {
            ad.insights = ad.insights.data;
        }

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
        result[key] = {};
        Object.keys(window.metrics).forEach(metricName => {
            const metricFn = window.metrics[metricName];
            if (typeof metricFn === 'function') {
                result[key][metricName] = metricFn(adsData);
            }
        });
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
            window.dispatchEvent(new Event('reportDataLoading'));
        },
        success: function(response) {
            $('#loading-indicator').hide();
            if (response.success) {
                console.log('Raw API Data:', response.data);

                const groups = groupAdsData(response.data, currentState.groupBy || 'Ad Name');
                console.log('Grouped Ads:', groups);
                const processed = computeMetricsByGroup(groups);

                console.log('Processed Metrics:', processed);
                window.reportMetrics = processed;
                window.dispatchEvent(new CustomEvent('reportDataUpdated', { detail: processed }));

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

window.dispatchEvent(new Event('fetchReportDataReady'));

$(document).ready(function() {
    // Any code that uses fetchReportDataFromPicker now works
});

</script>