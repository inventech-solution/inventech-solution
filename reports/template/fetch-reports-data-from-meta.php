<script>
// public/js/ajax/fetchReportData.js


// Group ads data based on a chosen key
window.groupAdsData = function(ads, groupBy = 'Ad Name') {
    const groups = {};
    const adArray = Array.isArray(ads) ? ads : (ads?.data || []);

    adArray.forEach(ad => {
        if (Array.isArray(ad.insights?.data)) {
            ad.insights = ad.insights.data;
        }

        let key = 'Ungrouped';
        switch (groupBy) {
            case 'Ad Name':
                key = ad.name || 'Unknown'; break;
            case 'Creative':
                key = ad.creative?.object_type || 'Unknown'; break;
            case 'Copy':
                key = ad.creative?.body || 'Unknown'; break;
            case 'Headline':
                key = ad.creative?.object_story_spec?.link_data?.name || 'Unknown'; break;
            case 'Landing Page':
                key = ad.creative?.link_destination_display_url || 'Unknown'; break;
            case 'CTA Button':
                key = ad.creative?.call_to_action_type || 'Unknown'; break;
            case 'Discount Code':
                key = ad.creative?.asset_feed_spec?.bodies?.[0]?.text || 'Unknown'; break;
            case 'Post ID':
                key = ad.creative?.object_story_id || 'Unknown'; break;
        }

        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(ad);
    });

    return groups;
};

// Compute metrics for each group using window.metrics
function computeMetricsByGroup(groups) {
    const result = {};

    for (const key in groups) {
        const ads = groups[key];
        const ad = ads[0]; // take one example ad

        result[key] = {
            meta: {
                name: ad.name || '',
                thumbnail: ad.creative?.image_url || '',
                videoUrl: ad.creative?.video_data?.video_url || '',
                postId: ad.creative?.object_story_id || '',
                cta: ad.creative?.call_to_action_type || ''
            },
            metrics: {}
        };

        for (const metric in window.metrics) {
            const fn = window.metrics[metric];
            if (typeof fn === 'function') {
                result[key].metrics[metric] = fn(ads);
            }
        }
    }

    return result;
}


// Fetch report data and dispatch relevant events
window.fetchReportData = function(start, end) {
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
        beforeSend: () => {
            $('#loading-indicator').show();
            window.dispatchEvent(new Event('reportDataLoading'));
        },
        success: (response) => {
            $('#loading-indicator').hide();
            if (!response.success) {
                console.error('API Error:', response.message);
                alert('Failed to fetch report data');
                return;
            }

            const grouped = groupAdsData(response.data, currentState.groupBy);
            console.log('Grouped Ads:', grouped);

            const processed = computeMetricsByGroup(grouped);
            console.log('Processed Metrics:', processed);

            window.reportMetrics = processed;
            window.dispatchEvent(new CustomEvent('reportDataUpdated', { detail: processed }));

            const firstGroup = Object.values(processed)[0];
            const spend = firstGroup?.spend;
            if (spend !== undefined) {
                $('#total-spend').text(`$${spend}`);
            }
        },
        error: (_, __, error) => {
            $('#loading-indicator').hide();
            console.error('AJAX Error:', error);
            alert('An error occurred while fetching report data.');
        }
    });
};

// Adapter for picker or external trigger
window.fetchReportDataFromPicker = function(start, end) {
    fetchReportData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
};

window.dispatchEvent(new Event('fetchReportDataReady'));

$(document).ready(function() {
    // Code that depends on fetchReportDataFromPicker can run now
});

</script>
