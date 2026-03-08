(function () {
    if (!("serviceWorker" in navigator)) {
        return;
    }

    let deferredPrompt;
    const installBtn = document.getElementById("installBtn");

    window.addEventListener("load", function () {
        var swPath = location.pathname.includes("/html/") ? "../sw.js" : "./sw.js";

        navigator.serviceWorker.register(swPath).catch(function (error) {
            console.warn("Service worker registration failed:", error);
        });
    });

    // Capture the install prompt event
    window.addEventListener("beforeinstallprompt", function (e) {
        e.preventDefault();
        deferredPrompt = e;
        // Button is already visible, just store the prompt
    });

    // Handle install button click
    if (installBtn) {
        installBtn.addEventListener("click", async function () {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response: ${outcome}`);
                deferredPrompt = null;
            } else {
                // Show browser-specific instructions
                showInstallInstructions();
            }
        });
    }

    function showInstallInstructions() {
        const userAgent = navigator.userAgent.toLowerCase();
        let instructions = "";

        if (userAgent.includes("firefox")) {
            instructions = "Firefox: Click the address bar icon (⋮) or go to Menu > More tools > Install this site";
        } else if (userAgent.includes("safari")) {
            instructions = "Safari: Tap the Share button (□↑) and select 'Add to Home Screen'";
        } else if (userAgent.includes("edg")) {
            instructions = "Edge: Click the menu (⋯) > Apps > Install WriteWise";
        } else {
            instructions = "Check your browser menu for 'Install app' or 'Add to home screen' option";
        }

        alert("Install WriteWise:\n\n" + instructions);
    }

    // Detect if already installed
    window.addEventListener("appinstalled", function () {
        console.log("WriteWise was installed successfully");
        // Button remains visible for users who want to see install instructions
    });
})();
