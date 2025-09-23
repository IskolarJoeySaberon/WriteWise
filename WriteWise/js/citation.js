// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

  // Get references to the form and its elements
  const citationForm = document.getElementById('citation-form');
  const authorInput = document.getElementById('author');
  const yearInput = document.getElementById('year');
  const titleInput = document.getElementById('title');
  const publisherSourceInput = document.getElementById('publisher-source');
  const urlInput = document.getElementById('url');

  // Get references to the output areas
  const apaOutputSpan = document.querySelector('#apa-output span');
  const mlaOutputSpan = document.querySelector('#mla-output span');
  const chicagoOutputSpan = document.querySelector('#chicago-output span');

  // Add event listener for form submission
  citationForm.addEventListener('submit', (event) => {
    // Prevent the default form submission behavior (which reloads the page)
    event.preventDefault();

    // Get the trimmed values from the input fields
    const authors = authorInput.value.trim();
    const year = yearInput.value.trim();
    const title = titleInput.value.trim();
    const publisherSource = publisherSourceInput.value.trim();
    const url = urlInput.value.trim();

    // --- Generate Citations ---
    // NOTE: This is a simplified implementation. Real citation generation
    // is complex and depends heavily on source type and specific rules.

    // --- APA Formatting ---
    let apaCitation = '';
    if (authors) {
      // Basic author formatting (assumes "Last, F. M.; Last2, F. M.")
      // A more robust solution would parse names properly.
      let apaAuthors = authors.split(';')
        .map(name => name.trim())
        .filter(name => name) // Remove empty entries
        .join(', '); // APA uses commas between authors
      // Add "&" before the last author if more than one
      if (apaAuthors.includes(', ')) {
        const lastCommaIndex = apaAuthors.lastIndexOf(', ');
        apaAuthors = apaAuthors.substring(0, lastCommaIndex) + ' & ' + apaAuthors.substring(lastCommaIndex + 2);
      }
      apaCitation += `${apaAuthors}. `;
    } else {
      apaCitation += `(n.d.). `; // Use n.d. if no author provided (common practice, though title might move)
    }
    if (year) {
      apaCitation += `(${year}). `;
    } else if (!authors) {
      // If no author AND no year, remove the (n.d.). Title comes first.
      apaCitation = '';
    }

    if (title) {
      // APA typically uses sentence case for titles, but italicizes books/journals
      // Assuming generic title - italicize for simplicity here. Needs refinement based on source type.
      apaCitation += `<em class="italic">${title}</em>. `;
    }
    if (publisherSource) {
      apaCitation += `${publisherSource}. `;
    }
    if (url) {
      // APA 7 doesn't usually require "Retrieved from" unless retrieval date is needed.
      apaCitation += `${url}`;
    }
    // Remove trailing period if it exists before adding final one (handles missing fields)
    apaCitation = apaCitation.trim().replace(/\.$/, '') + '.';
    apaOutputSpan.innerHTML = apaCitation || 'Missing required fields.'; // Use innerHTML to render italics

    // --- MLA Formatting ---
    let mlaCitation = '';
    if (authors) {
      // MLA uses full names and reverses only the first author if multiple
      let mlaAuthors = authors.split(';')
        .map(name => name.trim())
        .filter(name => name);
      if (mlaAuthors.length > 0) {
        // Format: Last, First M. and First M. Last and ...
        // This simplified version just joins them. Proper MLA is more complex.
        mlaCitation += mlaAuthors.join(', ') + '. ';
      }
    }
    if (title) {
      // MLA italicizes books/websites, puts articles in quotes. Assume italic here.
      mlaCitation += `<em class="italic">${title}</em>. `;
    }
    if (publisherSource) {
      // Publisher/Source, then Year
      mlaCitation += `${publisherSource}, `;
    }
    if (year) {
      mlaCitation += `${year}.`; // Period after year
    } else {
      mlaCitation = mlaCitation.trim().replace(/,$/, '.') // Replace trailing comma with period if no year
    }
    if (url) {
      // MLA includes URL, often without http:// or https:// prefix if stable.
      // For simplicity, we include the full URL.
      mlaCitation = mlaCitation.trim().replace(/\.$/, ''); // Remove trailing period if exists
      mlaCitation += `, ${url}.`;
    }
    // Ensure final period
    if (!mlaCitation.endsWith('.')) {
      mlaCitation += '.';
    }
    mlaOutputSpan.innerHTML = mlaCitation || 'Missing required fields.';

    // --- Chicago Formatting (Notes & Bibliography Style - Bibliography) ---
    let chicagoCitation = '';
    if (authors) {
      // Chicago uses full names, reverses first author. Same complexity as MLA.
      let chicagoAuthors = authors.split(';')
        .map(name => name.trim())
        .filter(name => name);
      if (chicagoAuthors.length > 0) {
        // Simple join for now.
        chicagoCitation += chicagoAuthors.join(', ') + '. ';
      }
    }
    if (title) {
      // Italicize books, quotes for articles. Assume italic.
      chicagoCitation += `<em class="italic">${title}</em>. `;
    }
    if (publisherSource) {
      // Publisher, then Year
      chicagoCitation += `${publisherSource}, `;
    }
    if (year) {
      chicagoCitation += `${year}.`;
    } else {
      chicagoCitation = chicagoCitation.trim().replace(/,$/, '.') // Replace trailing comma with period if no year
    }
    if (url) {
      chicagoCitation = chicagoCitation.trim().replace(/\.$/, ''); // Remove trailing period if exists
      chicagoCitation += `. ${url}.`; // Period before URL, period after.
    }
    // Ensure final period
    if (!chicagoCitation.endsWith('.')) {
      chicagoCitation += '.';
    }
    chicagoOutputSpan.innerHTML = chicagoCitation || 'Missing required fields.';

  }); // End of form submit event listener

  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("show");
  });
}); // End of DOMContentLoaded listener

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