<?php
session_start();
include_once __DIR__ . "/../../database.php";
include_once __DIR__ . "/../models/ReportModel.php";

class ReportController {
    private $reportModel;

    public function __construct($db) {
        $this->reportModel = new ReportModel($db);
    }

    public function handleReportRequest($reportId) {

        $report = $this->reportModel->getReportByUrlId($reportId);
        if (!$report) {
            $modalMessage = "Report not found for ID: " . htmlspecialchars($reportId);
            return $modalMessage;
        }
        return $report;
    }
}
?>