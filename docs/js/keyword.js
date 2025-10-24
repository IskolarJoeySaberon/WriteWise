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

    // Known acronyms and Tagalog helpers
    const KNOWN_ACRONYMS = new Set(['ai', 'ml', 'nlp', 'ui', 'ux', 'ar', 'vr', 'iot', 'rpa', 'devops', 'qa', 'it', 'cs', '5g', '3d']);
    const TAGALOG_COMMON = new Set([
        'ang', 'mga', 'ng', 'sa', 'si', 'sina', 'kay', 'kina', 'ni', 'nila', 'natin', 'namin', 'ninyong', 'ninyo',
        'ako', 'ikaw', 'ka', 'siya', 'kami', 'tayo', 'sila', 'ito', 'iyan', 'iyon', 'doon', 'dito', 'diyan',
        'ganito', 'ganyan', 'ganon', 'hindi', 'oo', 'wala', 'meron', 'may', 'mayroon', 'bakit', 'paano', 'saan',
        'kailan', 'dahil', 'para', 'pero', 'at', 'o', 'kung', 'habang', 'kapag', 'kahit', 'basta', 'pwede', 'puwede',
        'maari', 'maaari', 'salamat', 'po', 'opo', 'ho', 'oho', 'araw', 'gabi', 'bata', 'tao', 'bahay', 'trabaho', 'paaralan'
    ]);

    function looksTagalogWord(t) {
        if (!t) return false;
        if (TAGALOG_COMMON.has(t)) return true;
        if (!/^[a-z]+$/.test(t)) return false;
        const vowelRe = /[aeiouy]/;
        if (!vowelRe.test(t)) return false;
        // Common prefixes and suffixes
        if (/^(mag|nag|pag|pang|maka|makapag|ipag|ika|taga|ka|pa)[a-z]+$/.test(t)) return true;
        if (/^[a-z]+(an|han|in|hin)$/.test(t)) return true;
        // Taglish variations
        if (/^(mag|nag|pag|pang)[a-z]+(s|ing)$/.test(t)) return true;
        return false;
    }

    // Simple heuristic validation for topic keywords
    // Accepts English and Tagalog/Taglish words, common acronyms (AI, ML, 5G, IoT, UX, AR, VR, RPA, NLP),
    // and rejects gibberish using character rules + entropy + keyboard-walk detection.

    // Compute Shannon entropy (bits/char) on a string's characters
    function charEntropy(s) {
        if (!s) return 0;
        const freq = new Map();
        for (const ch of s) freq.set(ch, (freq.get(ch) || 0) + 1);
        const n = s.length;
        let h = 0;
        for (const [, c] of freq) {
            const p = c / n;
            h -= p * Math.log2(p);
        }
        return h;
    }
    function isValidKeyword(raw) {
        if (!raw) return false;
        const topic = String(raw).trim().toLowerCase();
        if (topic.length < 2) return false;

        const allowedAcronyms = KNOWN_ACRONYMS;

        const blacklistedTokens = new Set([
            'asdf', 'asdfg', 'asdfgh', 'qwerty', 'zxcv', 'zxcvb', 'qwrty', 'sdfgh', 'dfghj', 'fghjk', 'ghjkl', 'hjkl', 'lkjh', 'poiuy', 'mnbvcx', 'wasd', 'plok', 'qaz', 'wsx', 'edc', 'rfv', 'tgb', 'yhn', 'ujm'
        ]);

        const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
        function isKeyboardWalk(s) {
            if (!s || s.length < 3) return false;
            for (const row of rows) {
                if (row.includes(s)) return true;
                const rev = row.split('').reverse().join('');
                if (rev.includes(s)) return true;
            }
            return false;
        }

        // Split tokens by spaces and hyphens
        const tokens = topic.split(/[\s\-]+/).filter(Boolean);
        if (!tokens.length) return false;

        const vowelRe = /[aeiouy]/i;
        const tripleRepeatRe = /(.)\1{2,}/i; // aaa, !!!, etc.
        const fourConsonantsRe = /[bcdfghjklmnpqrstvwxyz]{4,}/i;
        const unicodeWordRe = /^[\p{L}\p{N}]+$/u; // any letter or number

        function isGibberishToken(t) {
            const core = t.normalize('NFC');
            // Reject if not purely letters/numbers (unless acronyms handled earlier)
            if (!unicodeWordRe.test(core)) return true;
            // Very short tokens 1-char are often too weak unless acronym handled elsewhere
            if (core.length === 1) return true;
            // Excessive repeats / impossible consonant clusters
            if (tripleRepeatRe.test(core)) return true;
            if (fourConsonantsRe.test(core)) return true;
            // All-consonant long words without vowels (latin scripts)
            if (core.length >= 5 && !vowelRe.test(core)) return true;
            // Entropy checks: extremely low (aaaaaa) or suspiciously high (random-like)
            if (core.length >= 6) {
                const h = charEntropy(core.toLowerCase());
                if (h < 1.2) return true;    // too repetitive
                if (h > 3.9) return true;    // too random for natural words
            }
            return false;
        }
        const validToken = (t) => {
            // allow alphanumeric acronyms
            if (allowedAcronyms.has(t)) return true;
            // accept Tagalog-looking words
            if (looksTagalogWord(t)) return true;
            // reject tokens with illegal characters (non-unicode word chars)
            if (!unicodeWordRe.test(t)) return false;
            // allow short 2-letter meaningful tokens like ai, ux, ui (already whitelisted)
            if (t.length <= 2) return allowedAcronyms.has(t);
            // reject obvious keyboard walks and common nonsense
            if (blacklistedTokens.has(t)) return false;
            if (isKeyboardWalk(t)) return false;
            // reject gibberish via structure + entropy
            if (isGibberishToken(t)) return false;
            // for longer tokens, require at least 2 vowels and balanced ratio (latin scripts)
            if (t.length >= 5) {
                const vowels = (t.match(/[aeiouy]/g) || []).length;
                const consonants = (t.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length;
                if (vowels < 2) return false;
                if (consonants > 0 && vowels / (vowels + consonants) < 0.25) return false; // too vowel-poor
            }
            return true;
        };

        // Topic is valid if at least one token looks valid
        return tokens.some(validToken);
    }

    async function generateKeywords() {
        const topicInput = document.getElementById("topicInput");
        const topic = topicInput.value.trim().toLowerCase();
        const keywordList = document.getElementById("keywordList");

        if (!topic) {
            clearSuggestions();
            return;
        }

        // Quick local heuristic first
        if (!isValidKeyword(topic)) {
            keywordList.innerHTML = "<li>No results found. Try different keywords.</li>";
            document.getElementById("relatedAreas").innerHTML = "";
            document.getElementById("scopeDelimiters").innerHTML = "";
            document.getElementById("thesisContainer").innerHTML = "";
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

    // Removed external dictionary dependency to avoid limiting non-English terms.

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
});