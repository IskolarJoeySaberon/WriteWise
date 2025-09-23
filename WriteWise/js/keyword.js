document.addEventListener("DOMContentLoaded", () => {

    // Debounce function to control rapid input calls
    function debounce(func, delay = 500) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Function to generate keywords dynamically based on user input
    function generateKeywords() {
        const topicInput = document.getElementById("topicInput");
        const topic = topicInput.value.trim().toLowerCase();
        const keywordList = document.getElementById("keywordList");

        // If the input is empty, clear all sections
        if (!topic) {
            clearSuggestions();
            return;
        }

        keywordList.innerHTML = "<li>Generating suggestions...</li>"; // Loading effect

        setTimeout(() => {
            const suggestions = generateRelatedKeywords(topic);

            keywordList.innerHTML = suggestions.length > 0
                ? suggestions.map(keyword => `<li>${keyword}</li>`).join("")
                : "<li>No relevant suggestions found.</li>";

            // Generate related research areas, delimiters, and thesis titles dynamically
            populateList("relatedAreas", generateRelatedAreas(topic));
            populateList("scopeDelimiters", generateScopeDelimiters(topic));
            displayThesisTitles(topic);
        }, 800);
    }

    // Function to generate keyword suggestions dynamically
    function generateRelatedKeywords(topic) {
        const words = topic.split(" ");
        let suggestions = [];

        words.forEach(word => {
            if (word.length > 3) {
                suggestions.push(
                    `Impact of ${word}`,
                    `Current trends in ${word}`,
                    `Future developments in ${word}`,
                    `Challenges surrounding ${word}`,
                    `Innovations in ${word}`
                );
            }
        });

        return suggestions;
    }

    // Function to generate related research areas based on input
    function generateRelatedAreas(topic) {
        return [
            `Emerging research on ${topic}`,
            `Historical insights into ${topic}`,
            `Technological advancements in ${topic}`,
            `Social implications of ${topic}`
        ];
    }

    // Function to generate scope delimiters dynamically
    function generateScopeDelimiters(topic) {
        return [
            `Study limitations in ${topic}`,
            `Geographical scope of ${topic}`,
            `Ethical considerations in ${topic}`,
            `Academic perspectives on ${topic}`
        ];
    }

    // Function to populate lists dynamically
    function populateList(elementId, data) {
        document.getElementById(elementId).innerHTML = data.length
            ? data.map(item => `<li>${item}</li>`).join("")
            : "<li>No suggestions available.</li>";
    }

    // Function to generate thesis titles dynamically
    function displayThesisTitles(topic) {
        const container = document.getElementById("thesisContainer");
        container.innerHTML = "";

        // Generate dynamic thesis titles
        const titles = generateThesisTitles(topic);

        titles.forEach(thesis => {
            const div = document.createElement("div");
            div.classList.add("thesis-card");
            div.innerHTML = `<h3>${thesis.title}</h3><p>${thesis.objective}</p>`;
            container.appendChild(div);
        });
    }

    // Function to create dynamic thesis titles
    function generateThesisTitles(topic) {
        return [
            { title: `Analyzing the Impact of ${topic} on Society`, objective: `Examining historical and modern influences of ${topic}.` },
            { title: `Future Prospects of ${topic}: Advancements and Challenges`, objective: `Exploring technological, social, or economic developments related to ${topic}.` },
            { title: `The Role of ${topic} in Innovation and Global Development`, objective: `Investigating how ${topic} contributes to progress in various industries.` },
            { title: `Ethical Considerations in ${topic}: Balancing Progress and Responsibility`, objective: `Addressing the moral implications and responsible use of ${topic}.` },
            { title: `${topic} and Its Effects on Human Behavior`, objective: `Studying psychological, cultural, or behavioral shifts due to ${topic}.` }
        ];
    }

    // Function to clear all displayed results when input is empty
    function clearSuggestions() {
        document.getElementById("keywordList").innerHTML = "";
        document.getElementById("relatedAreas").innerHTML = "";
        document.getElementById("scopeDelimiters").innerHTML = "";
        document.getElementById("thesisContainer").innerHTML = "";
    }

    // Attach event listener to clear results if input is empty
    document.getElementById("topicInput").addEventListener("input", function () {
        if (this.value.trim() === "") {
            clearSuggestions();
        }
    });

    const themeToggle = document.getElementById("themeToggle");

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        // Save the theme preference
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");

        // Change the icon dynamically
        themeToggle.innerHTML = document.body.classList.contains("dark-mode")
            ? '<i class="fa-solid fa-sun"></i>'  // Sun icon for light mode
            : '<i class="fa-solid fa-moon"></i>'; // Moon icon for dark mode
    });

    // Load theme preference on page refresh
    window.onload = () => {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    };

    // Load theme preference on page load
    if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");

    // Attach debounce to input field for better efficiency
    document.getElementById("topicInput").addEventListener("input", debounce(generateKeywords, 600));

    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.querySelector(".sidebar");

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });

});