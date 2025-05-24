<?php
include_once __DIR__ . "/../../database.php";
class DashboardModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getDashboardsAndReportsByUser($user_id) {
        $sql = "
            SELECT 
                folders.id AS folder_id,
                folders.name AS folder_name,
                reports.id AS report_id,
                reports.title AS report_title,
                reports.description,
                reports.report_url_id,
                reports.report_type
            FROM folders
            JOIN workspaces ON folders.workspace_id = workspaces.id
            LEFT JOIN reports ON reports.folder_id = folders.id
            WHERE workspaces.user_id = ?
            ORDER BY folders.id DESC, reports.created_at DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $_SESSION['user']['id']);
        $stmt->execute();
        $result = $stmt->get_result();

        $folders = [];

        while ($row = $result->fetch_assoc()) {
            $folder_id = $row['folder_id'];

            if (!isset($folders[$folder_id])) {
                $folders[$folder_id] = [
                    'folder_name' => $row['folder_name'],
                    'reports' => []
                ];
            }

            if ($row['report_id']) {
                $folders[$folder_id]['reports'][] = [
                    'id' => $row['report_id'],
                    'title' => $row['report_title'],
                    'description' => $row['description'],
                    'uid' => $row['report_url_id'],
                    'type' => $row['report_type']
                ];
            }
        }

        $stmt->close();
        return $folders;
    }
}
