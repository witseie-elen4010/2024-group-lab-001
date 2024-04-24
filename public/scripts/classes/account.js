document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector(".account-container"),
          passwordShowHide = document.querySelectorAll(".showHidePassword"),
          passwordFields = document.querySelectorAll(".password"),
          signUp = document.querySelector(".signup-link"),
          login = document.querySelector(".login-link");

    // Show/hide Password and Change Icon
    passwordShowHide.forEach(eyeIcon => {
        eyeIcon.addEventListener("click", () => {
            passwordFields.forEach(pwField => {
                if (pwField.type === "password") {
                    pwField.type = "text";
                    passwordShowHide.forEach(icon => {
                        icon.classList.replace("uil-eye-slash", "uil-eye");
                    })
                } else {
                    pwField.type = "password";
                    passwordShowHide.forEach(icon => {
                        icon.classList.replace("uil-eye", "uil-eye-slash");
                    })
                }
            })
        })
    });

    // Switch Between Signup and Login Form
    signUp.addEventListener("click", () => {
        container.classList.add("active");
    });

    login.addEventListener("click", () => {
        container.classList.remove("active");
    });
});
