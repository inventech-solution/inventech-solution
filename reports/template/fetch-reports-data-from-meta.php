<script>
// public/js/ajax/fetchReportData.js

function fetchReportData(start, end) {
    console.log("Fetching report data for:", start, "to", end);

    $.ajax({
        url: '/inventech-solution/backend/controllers/FetchReportDataFromMeta.php',
        method: 'POST',
        data: {
            start_date: start,
            end_date: end
        },
        dataType: 'json',
        beforeSend: function() {
            $('#loading-indicator').show();
        },
        success: function(response) {
            $('#loading-indicator').hide();
            if (response.success) {
                const processedData = window.metrics;
                const spend = processedData.spend(response.data);
                $('#total-spend').text(`$${spend}`);
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