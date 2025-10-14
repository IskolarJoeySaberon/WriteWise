// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  // --- Live Preview Switcher ---
  const styleSwitcher = document.getElementById('style-switcher');
  const livePreview = document.getElementById('preview-content');
  function updateLivePreview() {
    const style = styleSwitcher.value;
    let content = '';
    if (style === 'apa') content = apaOutputSpan.innerHTML;
    else if (style === 'mla') content = mlaOutputSpan.innerHTML;
    else if (style === 'chicago') content = chicagoOutputSpan.innerHTML;
    livePreview.innerHTML = content || 'Waiting for input...';
  }
  styleSwitcher.addEventListener('change', updateLivePreview);


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

    // Update live preview after generation
    updateLivePreview();

  }); // End of form submit event listener

  // --- Batch Upload Handler ---
  const batchUpload = document.getElementById('batch-upload');
  batchUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      let refs = [];
      if (file.name.endsWith('.json')) {
        try { refs = JSON.parse(evt.target.result); } catch { alert('Invalid JSON'); return; }
      } else if (file.name.endsWith('.csv')) {
        // Simple CSV parser: author,year,title,publisher,url per line
        refs = evt.target.result.split(/\r?\n/).filter(Boolean).map(line => {
          const [author, year, title, publisher, url] = line.split(',');
          return { author, year, title, publisherSource: publisher, url };
        });
      }
      // For each ref, generate and append citations
      let apa = '', mla = '', chicago = '';
      refs.forEach(ref => {
        // Use the same logic as above, but simplified for batch
        let a = ref.author || '', y = ref.year || '', t = ref.title || '', p = ref.publisherSource || '', u = ref.url || '';
        apa += `<div>` + (a ? a + '. ' : '') + (y ? `(${y}). ` : '') + (t ? `<em>${t}</em>. ` : '') + (p ? p + '. ' : '') + (u ? u : '') + `</div>`;
        mla += `<div>` + (a ? a + '. ' : '') + (t ? `<em>${t}</em>. ` : '') + (p ? p + ', ' : '') + (y ? y + '.' : '') + (u ? ', ' + u + '.' : '') + `</div>`;
        chicago += `<div>` + (a ? a + '. ' : '') + (t ? `<em>${t}</em>. ` : '') + (p ? p + ', ' : '') + (y ? y + '.' : '') + (u ? '. ' + u + '.' : '') + `</div>`;
      });
      apaOutputSpan.innerHTML = apa || 'No citations.';
      mlaOutputSpan.innerHTML = mla || 'No citations.';
      chicagoOutputSpan.innerHTML = chicago || 'No citations.';
      updateLivePreview();
    };
    reader.readAsText(file);
  });

  // --- Export Options ---
  document.getElementById('copy-citation').addEventListener('click', function () {
    const text = livePreview.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert('Citation copied to clipboard!');
    });
  });
  document.getElementById('download-docx').addEventListener('click', function () {
    const text = livePreview.innerHTML.replace(/<[^>]+>/g, '');
    const blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'citation.docx';
    a.click();
  });
  document.getElementById('download-bibtex').addEventListener('click', function () {
    // Simple BibTeX export (for demonstration)
    const text = `@article{sample,\n  author = {${authorInput.value}},\n  title = {${titleInput.value}},\n  year = {${yearInput.value}},\n  journal = {${publisherSourceInput.value}},\n  url = {${urlInput.value}}\n}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'citation.bib';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });


}); // End of DOMContentLoaded listener

// -------------------------------
// Mobile nav toggle
// -------------------------------
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".responsive-nav");
if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

// Sidebar and theme toggles are handled centrally by js/site-utils.js.
// Per-page initialization removed to avoid duplicate listeners.