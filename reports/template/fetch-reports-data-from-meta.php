<script>
// public/js/ajax/fetchReportData.js


function fetchReportData(start, end) {
    console.log("Fetching report data for:", start, "to", end);

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
                const metricsByGroup = response.metrics_by_group || {};
                console.log('Grouped Metrics:', metricsByGroup);

                const firstGroup = Object.keys(metricsByGroup)[0];
                if (firstGroup && metricsByGroup[firstGroup].spend !== undefined) {
                    $('#total-spend').text(`$${metricsByGroup[firstGroup].spend}`);
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