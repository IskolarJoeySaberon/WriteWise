(function () {
    if (!("serviceWorker" in navigator)) {
        return;
    }

    window.addEventListener("load", function () {
        var swPath = location.pathname.includes("/html/") ? "../sw.js" : "./sw.js";

        navigator.serviceWorker.register(swPath).catch(function (error) {
            console.warn("Service worker registration failed:", error);
        });
    });
})();
