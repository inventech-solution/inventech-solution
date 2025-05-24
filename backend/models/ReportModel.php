<?php

class ReportModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getReportByUrlId($reportUrlId) {
        $sql = "SELECT * FROM reports WHERE report_url_id = ?";

        $stmt = $this->conn->prepare($sql);

        // Add error check here
        if (!$stmt) {
            die("Prepare failed: " . $this->conn->error);
        }

        $stmt->bind_param("s", $reportUrlId);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }
}
?>
