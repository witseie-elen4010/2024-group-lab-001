document.addEventListener("DOMContentLoaded", function() {
    const enterWebsiteBtn = document.getElementById("enterWebsiteBtn");

    enterWebsiteBtn.addEventListener("click", function() {
        // Redirect to the Account Page
        window.location.href = "/account";
    });
});
