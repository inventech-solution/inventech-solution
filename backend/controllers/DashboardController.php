<?php
include_once __DIR__ . "/../models/DashboardModel.php";

class DashboardController {
    private $db;
    private $dashboardModel;

    public function __construct($db) {
        $this->db = $db;
        $this->dashboardModel = new DashboardModel($db);
    }

    public function loadFoldersAndReports($user_id) {
        return $this->dashboardModel->getDashboardsAndReportsByUser($user_id);
    }
    
}
