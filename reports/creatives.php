<div class="px-6 py-5">
    <div class="flex justify-between items-start mb-6">
        <div>
            <h1 class="text-xl font-semibold text-gray-900"><?php echo $checkReportIdDetails["title"]; ?></h1>
            <p class="text-gray-600 mt-1 text-sm"><?php echo $checkReportIdDetails["description"]; ?></p>
        </div>
        <div>
            <?php include "template/top-button-groups.php"; ?>
        </div>
    </div>
    <div class="container">
        <div class="row" style="justify-content: center;">
            <div class="col-md-10">

                <div class="flex items-center gap-3 flex-wrap bg-white p-4 rounded-xl shadow-sm mb-6" style="border: 1px solid #e2e2e2;">
                    <div class="relative">
                        <?php include "template/date-picker.php"; ?>
                    </div>
                    <?php include "template/group-by-dropdown.php"; ?>
                    <div class="bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-500">Add filter</div>
                </div>
                <div class="container" x-data="{ activeTab: 'section1' }">
                    <?php include "template/metric-pills.php"; ?>

                    <div x-show="activeTab === 'section1'" class="row"> <!-- Cards -->
                        <?php include "template/cards.php"; ?>
                    </div>

                    <div x-show="activeTab === 'section2'" class="bg-white p-4 rounded-xl shadow-sm mb-6 row" style="border: 1px solid #e2e2e2;"><!-- Chart -->
                        <?php include "template/chart.php"; ?>
                    </div>
                    <div x-show="activeTab === 'section3'" class="bg-white p-4 rounded-xl shadow-sm mb-6 row" style="border: 1px solid #e2e2e2;"><!-- Table -->
                        <?php include "template/table.php"; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>

/**For Dropdown */
/*document.addEventListener('alpine:init', () => {
  Alpine.data('dropdown', () => ({
    open: false,
    selectedOption: 'Group by', // Initial display value
  }))
})*/
// Initialize date range picker


</script>
<?php include "template/fetch-reports-data-from-meta.php"; ?>