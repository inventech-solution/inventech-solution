<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            document.querySelector("input[name='email']").addEventListener("change", validateEmail);
            document.querySelector("input[name='password']").addEventListener("change", validatePassword);
            document.querySelector("input[name='mobile']").addEventListener("change", validateMobile);
        });

        function validateEmail() {
            let email = document.querySelector("input[name='email']").value;
            let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showError("Invalid email format", "email");
            } else {
                clearError("email");
            }
        }

        function validatePassword() {
            let password = document.querySelector("input[name='password']").value;
            if (password.length < 6) {
                showError("Password must be at least 6 characters", "password");
            } else {
                clearError("password");
            }
        }

        function validateMobile() {
            let mobile = document.querySelector("input[name='mobile']").value;
            let mobilePattern = /^[0-9]{10,15}$/;
            if (!mobilePattern.test(mobile)) {
                showError("Invalid mobile number", "mobile");
            } else {
                clearError("mobile");
            }
        }

        function showError(message, field) {
            let inputField = document.querySelector("input[name='" + field + "']");
            if (!inputField.nextElementSibling || !inputField.nextElementSibling.classList.contains("error-message")) {
                let errorElement = document.createElement("small");
                errorElement.classList.add("error-message", "text-danger");
                errorElement.textContent = message;
                inputField.parentNode.appendChild(errorElement);
            }
        }

        function clearError(field) {
            let inputField = document.querySelector("input[name='" + field + "']");
            if (inputField.nextElementSibling && inputField.nextElementSibling.classList.contains("error-message")) {
                inputField.nextElementSibling.remove();
            }
        }
    </script>
</head>
<body>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <h2 class="text-center">Signup</h2>
                
                <?php if (isset($_SESSION['error'])): ?>
                    <div class="alert alert-danger">
                        <?php echo $_SESSION['error']; unset($_SESSION['error']); ?>
                    </div>
                <?php endif; ?>
                
                <?php if (isset($_SESSION['success'])): ?>
                    <div class="alert alert-success">
                        <?php echo $_SESSION['success']; unset($_SESSION['success']); ?>
                    </div>
                <?php endif; ?>
                
                <form name="signupForm" action="backend/controllers/AuthController.php" method="POST">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="mobile" class="form-label">Mobile Number</label>
                        <input type="text" name="mobile" class="form-control" required>
                    </div>
                    <button type="submit" name="signup" class="btn btn-success w-100">Signup & Proceed to Payment</button>
                </form>
                <p class="text-center mt-3">Already have an account? <a href="index.php">Login</a></p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
