<?php
include_once "../../database.php";
$sql = "SELECT * FROM metrics";
$result = $conn->query($sql);

$metrics = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $metrics[] = $row;
    }
    echo json_encode($metrics);
} else {
    echo json_encode([]);
}

$conn->close();
?>
