function acceptCookies() {
    // Set a cookie to indicate user's consent
    // document.cookie = "cookies_accepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    // Hide the consent banner
    document.getElementById("cookieConsentBanner").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    const enterWebsiteBtn = document.getElementById("enterWebsiteBtn");

    enterWebsiteBtn.addEventListener("click", function() {
        // Redirect to the Account Page
        window.location.href = "/account";
    });

    // Check if the user has previously accepted cookies
    // if (!document.cookie.split(';').some((item) => item.trim().startsWith('cookies_accepted='))) {
    //     // Show the cookie consent banner if the user hasn't accepted cookies
    //     document.getElementById("cookieConsentBanner").style.display = "block";
    // }
});
