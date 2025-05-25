<?php
include "../header.php";
include_once __DIR__ . "/../backend/controllers/ReportController.php";
$reportId = $_GET['rid'] ?? null;
include "template/error-report-id-missing.php";

$reportController = new ReportController($conn);
$checkReportIdDetails = $reportController->handleReportRequest($reportId); //Check if the report ID is valid
if($checkReportIdDetails == "Report not found for ID: " . htmlspecialchars($reportId)){//If not valid, show the error message
    $modalMessage = "Report Not Found. Kindly Retry or Contact Support.";
}   
?>


<?php
if (is_array($checkReportIdDetails) && isset($checkReportIdDetails['report_type']) && $checkReportIdDetails['report_type'] == 'creatives') {
    $selectedGroupBy = $checkReportIdDetails['grouping'];
    $savedDateRange = $checkReportIdDetails['date_range'];
    $card_metrics_json = $checkReportIdDetails['card_metrics'] ?? '[]';
    include "creatives.php"; // Include the creatives report
}
?>

<?php include "template/saving-report-to-database.php"; ?>
<!-- Include daterangepicker -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
<link rel="stylesheet" href="/inventech-solution/assets/css/datepicker.css" />
<!-- Include date picker over -->
<script>
    
</script>
<?php
include "template/error-modal-throw.php"; //Throw all the errors in the modal
include "../footer.php";
?>
