<script>
let currentState = {
    dateRange: '',
    groupBy: '',
    card_metrics: [],
    table_metrics: []
};

let initialState = { ...currentState };
let unsavedChanges = false;

// Save button
$('#saveData').on('click', function () {
    console.log('Saving changes:', currentState);
    initialState = { ...currentState };
    unsavedChanges = false;
    console.log('Saving changes:', currentState);
});

// Warn on leave
window.addEventListener('beforeunload', function (e) {
    if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
});
</script>