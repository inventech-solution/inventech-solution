<?php
session_start();
include_once "../../database.php";
include_once "../models/User.php";

class AuthController {
    private $conn;
    private $user;

    public function __construct($db) {
        $this->conn = $db;
        $this->user = new User($db);
    }

    public function register() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $email = trim($_POST['email']);
            $password = trim($_POST['password']);
            $mobile = trim($_POST['mobile']);
            $type = "user"; // Default type

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $_SESSION['error'] = "Invalid email format";
                header("Location: ../../register.php");
            
                exit();
            }

            if ($this->user->register($email, $password, $mobile, $type)) {
                $_SESSION['success'] = "Registration successful! Proceed to payment.";
                //header("Location: ../../payment.php");
                
                exit();
            } else {
                $_SESSION['error'] = "Registration failed. Email may already exist.";
                //header("Location: ../../register.php");
                exit();
            }
        }
    }

    public function login() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $email = trim($_POST['email']);
            $password = trim($_POST['password']);

            $userData = $this->user->login($email, $password);
            
            if ($userData) {
                $_SESSION['user'] = $userData;
                header("Location: ../../header.php");
                exit();
            } else {
                $_SESSION['error'] = "Invalid email or password!";
                header("Location: ../../index.php");
                exit();
            }
        }
    }

    public function logout() {
        session_destroy();
        header("Location: ../../index.php");
        exit();
    }
}

$auth = new AuthController($conn);

if (isset($_POST['signup'])) {
    $auth->register();
}
if (isset($_POST['login'])) {
    $auth->login();
}
if (isset($_GET['logout'])) {
    $auth->logout();
}
// Razorpay Payment Integration
/*if (isset($_POST['pay_now'])) {
    require('../../vendor/autoload.php');
    use Razorpay\Api\Api;

    $api_key = "your_razorpay_api_key";
    $api_secret = "your_razorpay_api_secret";
    $api = new Api($api_key, $api_secret);

    $order = $api->order->create([
        'receipt' => uniqid(),
        'amount' => 1000 * 100, // Amount in paisa (INR 1000 here)
        'currency' => 'INR',
        'payment_capture' => 1 // Auto capture payment
    ]);

    $_SESSION['razorpay_order_id'] = $order['id'];
    header("Location: ../../razorpay_payment.php?order_id=" . $order['id']);
    exit();
}*/
?>