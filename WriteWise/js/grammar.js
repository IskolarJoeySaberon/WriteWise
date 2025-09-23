"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Quill.js Editor
    const quill = new Quill("#editor", {
        theme: "snow",
        placeholder: "Type here..."
    });

    const getEditorText = () => quill.getText().trim();

    /** =========================
     * Grammar Check
     * ========================= */
    const checkGrammar = () => {
        const text = getEditorText();
        const suggestionsElement = document.getElementById("suggestions");
        const detectedIssuesElement = document.getElementById("detectedIssues");

        if (!text) {
            if (suggestionsElement) suggestionsElement.innerHTML = "Please enter text.";
            if (detectedIssuesElement) detectedIssuesElement.innerHTML = "";
            return;
        }

        if (suggestionsElement) suggestionsElement.innerHTML = "";
        if (detectedIssuesElement) detectedIssuesElement.innerHTML = "";
        quill.removeFormat(0, quill.getLength());

        // Use the free public endpoint for testing
        fetch("https://api.languagetool.org/v2/check", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ text: text, language: "en-US" })
        })
            .then(response => response.json())
            .then(data => {
                const matches = Array.isArray(data.matches) ? data.matches : [];
                if (matches.length === 0) {
                    if (suggestionsElement) suggestionsElement.innerHTML = "✅ No grammar issues found.";
                } else {
                    highlightErrors(matches);
                    updateChecklist(matches);
                }
                updateReadability(text, matches);
            })
            .catch(error => {
                console.error("Grammar Check Error:", error);
                if (suggestionsElement) suggestionsElement.innerHTML = "⚠️ Could not check grammar. Please try again.";
                quill.removeFormat(0, quill.getLength());
            });
    };

    // Wire the button click
    const grammarBtn = document.getElementById("checkGrammarBtn");
    if (grammarBtn) {
        grammarBtn.addEventListener("click", checkGrammar);
    }

    /** =========================
     * Highlight Errors
     * ========================= */
    const highlightErrors = (matches) => {
        const suggestionsElement = document.getElementById("suggestions");
        const detectedIssuesElement = document.getElementById("detectedIssues");
        const plain = quill.getText();

        if (suggestionsElement) suggestionsElement.innerHTML = "";
        if (detectedIssuesElement) detectedIssuesElement.innerHTML = "";

        matches.forEach(match => {
            const { offset, length, replacements = [], message } = match;
            const isClarity = match.rule?.category?.id === "STYLE" || match.rule?.issueType === "style";
            const formatName = isClarity ? "error-clarity" : "error-typo";

            // Highlight inside editor
            quill.formatText(offset, length, { [formatName]: true }, "user");

            // Suggestion card
            const suggestionBox = document.createElement("div");
            suggestionBox.className = "suggestion-box";

            const wrongWord = plain.substr(offset, length);
            const wrongSpan = document.createElement("span");
            wrongSpan.textContent = wrongWord;
            wrongSpan.className = formatName;
            wrongSpan.style.cursor = "pointer";
            wrongSpan.addEventListener("click", () => {
                quill.setSelection(offset, length, "user");
                quill.focus();
            });

            const errorMsg = document.createElement("p");
            errorMsg.className = "suggestion-title";
            errorMsg.innerHTML = `<span class="error">Issue:</span> ${message} — `;
            errorMsg.appendChild(wrongSpan);
            suggestionBox.appendChild(errorMsg);

            // Replacement buttons
            const buttonsContainer = document.createElement("div");
            buttonsContainer.className = "suggestion-options";

            const reps = replacements.length ? replacements : [{ value: levenshteinSuggest(wrongWord) }];

            reps.forEach(rep => {
                const btn = document.createElement("button");
                btn.textContent = rep.value;
                btn.className = "suggestion-btn";
                btn.addEventListener("click", () => {
                    applyCorrection(offset, length, rep.value);
                    setTimeout(checkGrammar, 50); // refresh after correction
                });
                buttonsContainer.appendChild(btn);
            });

            suggestionBox.appendChild(buttonsContainer);
            if (suggestionsElement) suggestionsElement.appendChild(suggestionBox);

            // Issues Detected entry
            const issueEntry = document.createElement("p");
            issueEntry.innerHTML = `<span class="${formatName}" style="cursor:pointer;">${wrongWord}</span> → ${message}`;
            issueEntry.querySelector("span").addEventListener("click", () => {
                quill.setSelection(offset, length, "user");
                quill.focus();
            });
            if (detectedIssuesElement) detectedIssuesElement.appendChild(issueEntry);
        });
    };

    const applyCorrection = (offset, length, replacement) => {
        if (!replacement) return;
        quill.deleteText(offset, length);
        quill.insertText(offset, replacement);
    };

    /** =========================
     * Checklist
     * ========================= */
    const updateChecklist = (matches) => {
        const checklistItems = document.querySelectorAll("#checklist li");
        checklistItems.forEach(item => item.classList.remove("action-required"));
        matches.forEach(match => {
            const msg = (match.message || "").toLowerCase();
            if (msg.includes("redundant") || msg.includes("repetition")) markChecklistItem("No redundant words");
            if (msg.includes("clarity") || msg.includes("confusing")) markChecklistItem("Clear sentences");
            if (msg.includes("tense")) markChecklistItem("Correct verb tense");
            if (msg.includes("concise") || msg.includes("wordy")) markChecklistItem("Concise phrasing");
        });
    };

    const markChecklistItem = (text) => {
        document.querySelectorAll("#checklist li").forEach(item => {
            if (item.textContent.indexOf(text) !== -1) item.classList.add("action-required");
        });
    };

    /** =========================
     * Readability + Grammar Summary
     * ========================= */
    const interpretReadability = (score) => {
        if (score >= 90) return "Very easy (like casual conversation)";
        if (score >= 80) return "Easy (college level)";
        if (score >= 70) return "Fairly easy (senior high school)";
        if (score >= 60) return "Standard (junior high school)";
        if (score >= 50) return "Somewhat difficult (upper elementary)";
        if (score >= 30) return "Challenging (basic literacy)";
        return "Advanced style (scholarly or technical writing)";
    };

    const countSyllables = (word) => {
        if (!word) return 1;
        word = word.toLowerCase().replace(/[^a-z]/g, "");
        if (word.length <= 3) return 1;
        if (word.length > 20) return 6;
        word = word.replace(/e$/, "");
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? Math.min(matches.length, 6) : 1;
    };

    const perceivedLevel = (words, sentences, syllables) => {
        const avgSentenceLength = words / Math.max(1, sentences);
        const avgWordLength = syllables / Math.max(1, words);

        if (avgSentenceLength <= 12 && avgWordLength <= 1.5)
            return "Easy (like everyday conversation)";
        if (avgSentenceLength <= 17 && avgWordLength <= 1.7)
            return "Moderate (high school level)";
        if (avgSentenceLength <= 25 && avgWordLength <= 1.9)
            return "Challenging (college level)";
        return "Reads like advanced academic writing";
    };

    const updateReadability = (text, matches = []) => {
        const summary = document.getElementById("summary");
        if (!summary) return;

        const wordsArr = (text || "").split(/\s+/).filter(Boolean);
        const words = wordsArr.length;

        const sentences = (text.match(/[.!?]+/g) || []).length || (words ? 1 : 0);

        let syllables = 0;
        for (const w of wordsArr) syllables += countSyllables(w);

        const score = 206.835
            - 1.015 * (Math.max(1, words) / Math.max(1, sentences))
            - 84.6 * (syllables / Math.max(1, words));

        const issues = Array.isArray(matches) ? matches.length : 0;
        const rawAccuracy = 100 - (issues / Math.max(1, words) * 100);
        const grammarAccuracy = Math.max(0, Math.min(100, Number(rawAccuracy.toFixed(1))));

        const interpretation = interpretReadability(score);
        const perceived = perceivedLevel(words, sentences, syllables);

        if (!words) {
            summary.innerHTML = `
        <p><strong>Readability:</strong> —</p>
        <p><strong>Perceived As:</strong> —</p>
        <p><strong>Grammar Accuracy:</strong> —</p>
      `;
            return;
        }

        summary.innerHTML = `
      <p><strong>Readability:</strong> ${interpretation}</p>
      <p><strong>Perceived As:</strong> ${perceived}</p>
      <p><strong>Grammar Accuracy:</strong> about ${grammarAccuracy}%</p>
    `;
    };

    /** =========================
     * Fallback Suggestion
     * ========================= */
    const levenshteinSuggest = (word) => {
        const dictionary = ["the", "this", "that", "example", "grammar", "clarity"];
        let best = dictionary[0], bestDist = Infinity;
        dictionary.forEach(d => {
            const dist = levenshtein(word, d);
            if (dist < bestDist) { bestDist = dist; best = d; }
        });
        return best;
    };

    const levenshtein = (a, b) => {
        const matrix = Array.from({ length: a.length + 1 }, () => []);
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                matrix[i][j] = a[i - 1] === b[j - 1]
                    ? matrix[i - 1][j - 1]
                    : Math.min(
                        matrix[i - 1][j] + 1,     // deletion
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j - 1] + 1  // substitution
                    );
            }
        }
        return matrix[a.length][b.length];

    };

    // === Word Counter with Hard Limit ===
    const wordCountDisplay = document.getElementById("wordCount");
    const wordLimit = 200;

    quill.on("text-change", (delta, oldDelta, source) => {
        const text = quill.getText().trim();
        let words = text.split(/\s+/).filter(Boolean);

        // If over the limit, trim back to 200 words
        if (words.length > wordLimit && source === "user") {
            words = words.slice(0, wordLimit);
            const trimmed = words.join(" ") + " ";
            quill.setText(trimmed); // replace editor content with trimmed text
            quill.setSelection(quill.getLength(), 0); // move cursor to end
        }

        // Update counter
        if (wordCountDisplay) wordCountDisplay.textContent = Math.min(words.length, wordLimit);

        // Style if limit reached
        const counterBox = document.querySelector(".word-counter");
        if (counterBox) {
            counterBox.classList.toggle("limit-reached", words.length >= wordLimit);
        }
    });


    /** =========================
     * Citation Generator
     * ========================= */
    const citationForm = document.getElementById("citationForm");
    const citationModal = document.getElementById("citationModal");
    const openCitationBtn = document.getElementById("insertCitation");
    const closeCitationBtn = document.getElementById("closeCitation");

    if (openCitationBtn && citationModal && citationForm) {
        // Open modal
        openCitationBtn.addEventListener("click", () => {
            citationModal.style.display = "block";
            citationModal.removeAttribute("hidden");
            citationModal.setAttribute("aria-hidden", "false");
        });

        // Close modal
        if (closeCitationBtn) {
            closeCitationBtn.addEventListener("click", () => {
                citationModal.style.display = "none";
                citationModal.setAttribute("hidden", "");
                citationModal.setAttribute("aria-hidden", "true");
            });
        }

        // Handle form submit
        citationForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const author = (document.getElementById("author")?.value || "").trim();
            const year = (document.getElementById("year")?.value || "").trim();
            const title = (document.getElementById("title")?.value || "").trim();
            const publisher = (document.getElementById("publisher")?.value || "").trim();
            const url = (document.getElementById("url")?.value || "").trim();
            const style = (document.getElementById("style")?.value || "apa").trim();

            if (!author || !year || !title) {
                alert("Please fill in Author, Year, and Title.");
                return;
            }

            let citation = "";
            switch (style) {
                case "apa":
                    citation = `${author} (${year}). ${title}. ${publisher ? publisher + ". " : ""}${url}`;
                    break;
                case "mla":
                    citation = `${author}. "${title}." ${publisher ? publisher + ", " : ""}${year}${url ? ", " + url : ""}.`;
                    break;
                case "chicago":
                    citation = `${author}. ${title}. ${publisher ? publisher + ", " : ""}${year}${url ? ". " + url : ""}.`;
                    break;
                default:
                    citation = `(${author}, ${year})`;
            }

            // Close modal
            citationModal.style.display = "none";
            citationModal.setAttribute("hidden", "");
            citationModal.setAttribute("aria-hidden", "true");
            citationForm.reset();

            // Insert into Quill editor
            quill.focus();
            const range = quill.getSelection(true);
            const index = range ? range.index : quill.getLength();
            quill.insertText(index, citation + " ", "user");
        });
    }

    // === Citation Modal Logic ===
    if (openCitationBtn && citationModal) {
        openCitationBtn.addEventListener("click", () => {
            citationModal.style.display = "block";
            citationModal.removeAttribute("hidden");
            citationModal.setAttribute("aria-hidden", "false");
        });
    }

    if (closeCitationBtn && citationModal) {
        closeCitationBtn.addEventListener("click", () => {
            citationModal.style.display = "none";
            citationModal.setAttribute("hidden", "");
            citationModal.setAttribute("aria-hidden", "true");
        });
    }

    // Optional: close when clicking outside modal
    window.addEventListener("click", (e) => {
        if (e.target === citationModal) {
            citationModal.style.display = "none";
            citationModal.setAttribute("hidden", "");
            citationModal.setAttribute("aria-hidden", "true");
        }
    });

    // Optional: close on Escape key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && citationModal.style.display === "block") {
            citationModal.style.display = "none";
            citationModal.setAttribute("hidden", "");
            citationModal.setAttribute("aria-hidden", "true");
        }
    });


    // Expose function to button
    window.checkGrammar = checkGrammar;
});


/** =========================
 * Theme + Sidebar
 * ========================= */
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    themeToggle.innerHTML = document.body.classList.contains("dark-mode")
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
});
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");
toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
});