document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------
    // Debounce helper
    // -------------------------------
    function debounce(func, delay = 500) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // -------------------------------
    // Keyword generation
    // -------------------------------
    function generateKeywords() {
        const topicInput = document.getElementById("topicInput");
        const topic = topicInput.value.trim().toLowerCase();
        const keywordList = document.getElementById("keywordList");

        if (!topic) {
            clearSuggestions();
            return;
        }

        keywordList.innerHTML = "<li>Generating suggestions...</li>";

        setTimeout(() => {
            const suggestions = generateRelatedKeywords(topic);

            keywordList.innerHTML = suggestions.length > 0
                ? suggestions.map(keyword => `<li>${keyword}</li>`).join("")
                : "<li>No relevant suggestions found.</li>";

            populateList("relatedAreas", generateRelatedAreas(topic));
            populateList("scopeDelimiters", generateScopeDelimiters(topic));
            displayThesisTitles(topic);
        }, 800);
    }

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

    function generateRelatedAreas(topic) {
        return [
            `Emerging research on ${topic}`,
            `Historical insights into ${topic}`,
            `Technological advancements in ${topic}`,
            `Social implications of ${topic}`
        ];
    }

    function generateScopeDelimiters(topic) {
        return [
            `Study limitations in ${topic}`,
            `Geographical scope of ${topic}`,
            `Ethical considerations in ${topic}`,
            `Academic perspectives on ${topic}`
        ];
    }

    function populateList(elementId, data) {
        document.getElementById(elementId).innerHTML = data.length
            ? data.map(item => `<li>${item}</li>`).join("")
            : "<li>No suggestions available.</li>";
    }

    function displayThesisTitles(topic) {
        const container = document.getElementById("thesisContainer");
        container.innerHTML = "";
        const titles = generateThesisTitles(topic);
        titles.forEach(thesis => {
            const div = document.createElement("div");
            div.classList.add("thesis-card");
            div.innerHTML = `<h3>${thesis.title}</h3><p>${thesis.objective}</p>`;
            container.appendChild(div);
        });
    }

    function generateThesisTitles(topic) {
        return [
            { title: `Analyzing the Impact of ${topic} on Society`, objective: `Examining historical and modern influences of ${topic}.` },
            { title: `Future Prospects of ${topic}: Advancements and Challenges`, objective: `Exploring technological, social, or economic developments related to ${topic}.` },
            { title: `The Role of ${topic} in Innovation and Global Development`, objective: `Investigating how ${topic} contributes to progress in various industries.` },
            { title: `Ethical Considerations in ${topic}: Balancing Progress and Responsibility`, objective: `Addressing the moral implications and responsible use of ${topic}.` },
            { title: `${topic} and Its Effects on Human Behavior`, objective: `Studying psychological, cultural, or behavioral shifts due to ${topic}.` }
        ];
    }

    function clearSuggestions() {
        document.getElementById("keywordList").innerHTML = "";
        document.getElementById("relatedAreas").innerHTML = "";
        document.getElementById("scopeDelimiters").innerHTML = "";
        document.getElementById("thesisContainer").innerHTML = "";
    }

    // Clear results if input is empty (guarded)
    const topicInputEl = document.getElementById("topicInput");
    if (topicInputEl) {
        topicInputEl.addEventListener("input", function () {
            if (this.value.trim() === "") clearSuggestions();
        });

        // Debounced keyword generation
        topicInputEl.addEventListener("input", debounce(generateKeywords, 600));
    }

    // Sidebar + Theme toggles are handled centrally by js/site-utils.js
    // Per-page initialization removed to avoid duplicate listeners and ensure consistent behavior.
    // Sidebar + Theme toggles are handled centrally by js/site-utils.js
    // Per-page initialization removed to avoid duplicate listeners and ensure consistent behavior.
});