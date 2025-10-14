document.addEventListener("DOMContentLoaded", () => {
    // Hero entrance animation
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.4 } });

    tl.from(".hero-content h1", {
        y: 60,
        opacity: 0,
        scale: 0.95
    })
        .from(".hero-content p", {
            y: 30,
            opacity: 0,
            scale: 0.98
        }, "-=1.0")
        .from(".hero-content .btn", {
            y: 20,
            opacity: 0,
            scale: 0.98,
            stagger: 0.2
        }, "-=1.0");

    // Dashboard progress bar animation
    const progress = 25; // You can make this dynamic later
    gsap.to("#progressFill", {
        width: progress + "%",
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
    });
    document.getElementById("progressText").textContent = progress + "% completed";

    // Parallax effect on hero text
    const hero = document.querySelector(".hero-content");
    if (hero) {
        hero.addEventListener("mousemove", (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 6;
            const y = (e.clientY / innerHeight - 0.5) * 4;
            gsap.to(".hero-content h1", {
                x,
                y,
                duration: 0.6,
                ease: "power3.out"
            });
            gsap.to(".hero-content p", {
                x: -x,
                y: -y,
                duration: 0.6,
                ease: "power3.out"
            });
        });
    }

    document.querySelector(".search-input").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            const query = e.target.value.toLowerCase().trim();

            if (query.includes("citation")) {
                window.location.href = "citations.html";
            } else if (query.includes("grammar")) {
                window.location.href = "grammar.html";
            } else if (query.includes("chapter")) {
                window.location.href = "chapter-guide.html";
            } else if (query.includes("tutorial") || query.includes("lessons") || query.includes("Lessons")) {
                window.location.href = "learning.html#lessons";
            } else if (query.includes("keywords")) {
                window.location.href = "keywords.html";
            } else {
                alert("Topic not found. Try keywords like 'citation', 'grammar', or 'chapter'.");
            }
        }
    });
});