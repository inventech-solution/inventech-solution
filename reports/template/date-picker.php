
<input id="dateRange" class="bg-gray-50 rounded-md px-4 py-2 w-60 cursor-pointer border border-gray-300 text-sm" readonly>

<script>
$(document).ready(function () {
    // Initialize date range picker with saved value
    initDatePicker();
});

const savedDateRange = "<?php echo $savedDateRange; ?>"; // e.g. "Last 7 Days" or "2024-04-01 to 2024-04-12"

function initDatePicker() {
    const ranges = {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 3 Days': [moment().subtract(3, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
        'Last 14 Days': [moment().subtract(14, 'days'), moment().subtract(1, 'days')],
        'Last 28 Days': [moment().subtract(28, 'days'), moment().subtract(1, 'days')],
        'Last 30 Days': [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
        'Last 90 Days': [moment().subtract(90, 'days'), moment().subtract(1, 'days')],
        'Last 365 Days': [moment().subtract(365, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    };

    let start, end;

    if (ranges[savedDateRange]) {
        [start, end] = ranges[savedDateRange];
    } else {
        const parts = savedDateRange.split(' to ');
        start = moment(parts[0], 'YYYY-MM-DD');
        end = moment(parts[1], 'YYYY-MM-DD');
    }

    $('#dateRange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: ranges,
        locale: { format: 'YYYY-MM-DD' },
        opens: 'right',
        autoUpdateInput: true
    }, cb);

    cb(start, end); // Initial set

    $('#dateRange').on('apply.daterangepicker', function(ev, picker) {
        let matchedLabel = null;

        for (const [label, range] of Object.entries(ranges)) {
            const rangeStart = range[0].startOf('day');
            const rangeEnd = range[1].startOf('day');

            if (picker.startDate.startOf('day').isSame(rangeStart) &&
                picker.endDate.startOf('day').isSame(rangeEnd)) {
                matchedLabel = label;
                break;
            }
        }

        if (matchedLabel) {
            currentState.dateRange = matchedLabel;
        } else {
            currentState.dateRange = picker.startDate.format('YYYY-MM-DD') + ' to ' + picker.endDate.format('YYYY-MM-DD');
        }

        unsavedChanges = true;
    });

    function cb(start, end) {
        const formatted = start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD');
        $('#dateRange').val(formatted);

        let matchedLabel = null;
        for (const [label, range] of Object.entries(ranges)) {
            if (
                start.startOf('day').isSame(range[0].startOf('day')) &&
                end.startOf('day').isSame(range[1].startOf('day')
            )) {
                matchedLabel = label;
                break;
            }
        }

        const initialDateRange = matchedLabel ?? formatted;
        currentState.dateRange = initialDateRange;
        initialState.dateRange = initialDateRange;
        fetchReportDataFromPicker(start, end);
    }
}  

</script>