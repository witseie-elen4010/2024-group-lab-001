document.addEventListener("DOMContentLoaded", function() {
    const loginContainer = document.querySelector(".login-container");
    const signupContainer = document.querySelector(".signup-container");
    const guestContainer = document.querySelector(".guest-container");
    const adminContainer = document.querySelector(".admin-container");
    const passwordShowHide = document.querySelectorAll(".showHidePassword");
    const passwordFields = document.querySelectorAll(".password");
    const signUp = document.querySelector(".signup-link");
    const login = document.querySelector(".login-link");
    const guestToLogin = document.querySelector(".guest-to-login");
    const guest = document.querySelector(".guest-link");
    const adminToLogin = document.querySelector(".admin-to-login");
    const admin = document.querySelector(".admin-link");

    // Show/hide Password and Change Icon        
    passwordShowHide.forEach((eyeIcon, index) => {
        eyeIcon.addEventListener('click', () => {
            // Get the associated password field
            const pwField = passwordFields[index];

            // Toggle the password field and eye icon
            if (pwField.type === 'password') {
                pwField.type = 'text';
                eyeIcon.classList.replace('uil-eye-slash', 'uil-eye');
            } else {
                pwField.type = 'password';
                eyeIcon.classList.replace('uil-eye', 'uil-eye-slash');
            }
        });
    }); 

    // Switch to and from Guest Container
    guest.addEventListener("click", () => {
        guestContainer.style.display = "block";
        loginContainer.style.display = "none";
    });

    // Switch Between Signup and Login Containers
    signUp.addEventListener("click", () => {
        loginContainer.style.display = "none";
        signupContainer.style.display = "block";
    });

    guestToLogin.addEventListener("click", () => {
        signupContainer.style.display = "none";
        guestContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    login.addEventListener("click", () => {
        signupContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    admin.addEventListener("click", () => {
        signupContainer.style.display = "none";
        loginContainer.style.display = "none";
        adminContainer.style.display = "block";
    });

    adminToLogin.addEventListener("click", () => {
        adminContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

});
