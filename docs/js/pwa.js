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
    });

    // Handle install button click
    if (installBtn) {
        installBtn.innerHTML = '<i class="fa-solid fa-download"></i> Install App';

        installBtn.addEventListener("click", async function () {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response: ${outcome}`);
                deferredPrompt = null;
            } else {
                // Fall back to manual instructions if prompt is unavailable.
                showInstallInstructions();
            }
        });
    }

    function showInstallInstructions() {
        let instructions =
            "Open your browser menu and look for one of these options:\n" +
            "- Install app\n" +
            "- Add to Home screen\n" +
            "- Install this site\n\n" +
            "If you do not see it right away, check the three-dot menu, Share menu, or More tools section.";

        alert("Install WriteWise:\n\n" + instructions);
    }

    // Detect if already installed
    window.addEventListener("appinstalled", function () {
        console.log("WriteWise was installed successfully");
        // Button remains visible for users who want to see install instructions
    });
})();
