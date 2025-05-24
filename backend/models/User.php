<?php
include_once "../../database.php";

class User {
    private $conn;

    // Constructor to initialize the database connection
    public function __construct($mysqli) {
        $this->conn = $mysqli;
    }

    // Register method to create a new user account
    public function register($email, $password, $mobile, $type) {
        $email = $this->conn->real_escape_string($email);
        $mobile = $this->conn->real_escape_string($mobile);
        $type = $this->conn->real_escape_string($type);
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT); // correctly hashing the password
        
        // Use the hashed password in the query
        $query = "INSERT INTO users (email, password, mobile, level) VALUES ('$email', '$hashedPassword', '$mobile', '$type')";
        
        if ($this->conn->query($query)) {
            return true;
            $this->conn->error;
        } else {
            error_log("Database error: " . $this->conn->error); // Log error to PHP error log
    echo $this->conn->error;
        }
    }

    public function login($email, $password) {
        $email = $this->conn->real_escape_string($email);
        $query = "SELECT * FROM users WHERE email = '$email'";
        $result = $this->conn->query($query);
        if ($result && $result->num_rows > 0) {
            
            $userData = $result->fetch_assoc();
            if (password_verify($password, $userData['password'])) {
                // Increment login count
                $updateQuery = "UPDATE users SET logins = logins + 1 WHERE email = '$email'";
                $this->conn->query($updateQuery);
                return $userData;
            }
        }
        return null;
    }

    public function verify_password($email, $password) {
        $email = $this->conn->real_escape_string($email);
        $query = "SELECT password FROM users WHERE email = '$email'";
        $result = $this->conn->query($query);
        if ($result && $result->num_rows > 0) {
            $userData = $result->fetch_assoc();
            return password_verify($password, $userData['password']);
        }
        return false;
    }

    private function sendWebhook($email, $mobile, $type) {
        $webhook_url = "https://email-marketing-tool.com/api/webhook";
        $data = [
            "email" => $email,
            "mobile" => $mobile,
            "type" => $type
        ];
        
        $options = [
            "http" => [
                "header" => "Content-Type: application/json",
                "method" => "POST",
                "content" => json_encode($data)
            ]
        ];
        
        $context = stream_context_create($options);
        file_get_contents($webhook_url, false, $context);
    }
}
