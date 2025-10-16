console.log("✅ plagiarism.js loaded");

// ===== Modal helpers =====
function openModal(message, title = "Notice", type = "info", isHTML = false) {
  const modal = document.getElementById("appModal");
  if (!modal) { alert(message); return; }
  const msgEl = document.getElementById("modalMessage");
  const titleEl = document.getElementById("modalTitle");
  if (titleEl) titleEl.textContent = title;
  if (msgEl) {
    if (isHTML) msgEl.innerHTML = message;
    else msgEl.textContent = message;
  }
  modal.classList.remove("modal--info", "modal--success", "modal--warning", "modal--danger");
  modal.classList.add(`modal--${type}`);
  modal.classList.remove("hidden");
}
function closeModal() {
  const modal = document.getElementById("appModal");
  if (modal) modal.classList.add("hidden");
}
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("appModal");
  if (modal) {
    const closeBtn = document.getElementById("modalClose");
    const okBtn = document.getElementById("modalOk");
    const backdrop = modal.querySelector(".modal-backdrop");
    closeBtn && closeBtn.addEventListener("click", closeModal);
    okBtn && okBtn.addEventListener("click", closeModal);
    backdrop && backdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }
});

// Similarity summary modal (guard duplicate popups)
let __lastSummaryAt = 0;
function showSummaryModal(avgScore) {
  const now = Date.now();
  if (now - __lastSummaryAt < 300) return;
  __lastSummaryAt = now;
  let type = "success";
  if (avgScore > 50) type = "danger";
  else if (avgScore > 20) type = "warning";
  const msg = `Overall Similarity: <strong>${avgScore.toFixed(1)}%</strong><br/><small>Higher means more similar.</small><br/><a href="#results">View details</a>`;
  openModal(msg, "Similarity Result", type, true);
}

// Function: Jaccard Similarity
function jaccardSimilarity(text1, text2) {
  const set1 = new Set(text1.toLowerCase().split(/\W+/).filter(Boolean));
  const set2 = new Set(text2.toLowerCase().split(/\W+/).filter(Boolean));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : (intersection.size / union.size);
}

// File Upload
document.getElementById("fileUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (file && file.type === "text/plain") {
    const reader = new FileReader();
    reader.onload = e => document.getElementById("referenceText").value = e.target.result;
    reader.readAsText(file);
  } else {
    openModal("Please upload a valid .txt file", "Invalid File", "warning");
  }
});

// Check Similarity Button
document.getElementById("checkBtn").addEventListener("click", () => {
  const studentText = document.getElementById("studentText").value.trim();
  const referenceText = document.getElementById("referenceText").value.trim();
  const resultsDiv = document.getElementById("results");
  const highlightedTextDiv = document.getElementById("highlightedText");
  const scoreDisplay = document.getElementById("similarityScore");
  const progressBar = document.getElementById("progressBar");

  if (!studentText || !referenceText) {
    openModal("Please paste or upload reference text and your work.", "Missing Input", "warning");
    return;
  }

  highlightedTextDiv.innerHTML = "";

  const studentSentences = studentText.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
  const referenceSentences = referenceText.split(/[.!?]/).map(s => s.trim()).filter(Boolean);

  let totalScore = 0;

  studentSentences.forEach(sentence => {
    let maxScore = 0;
    referenceSentences.forEach(ref => {
      const sim = jaccardSimilarity(sentence, ref);
      if (sim > maxScore) maxScore = sim;
    });
    totalScore += maxScore;

    let className = "low";
    if (maxScore > 0.5) className = "high";
    else if (maxScore >= 0.2) className = "moderate";

    const span = document.createElement("span");
    span.textContent = `${sentence}  [Similarity: ${(maxScore * 100).toFixed(1)}%]`;
    span.classList.add(className);
    highlightedTextDiv.appendChild(span);
  });

  const avgScore = (totalScore / studentSentences.length) * 100;
  scoreDisplay.textContent = `Overall Similarity Score: ${avgScore.toFixed(1)}%`;

  // Progress bar
  progressBar.style.width = `${avgScore}%`;
  if (avgScore > 50) progressBar.style.background = "#dc3545";   // red
  else if (avgScore > 20) progressBar.style.background = "#ffc107"; // yellow
  else progressBar.style.background = "#28a745"; // green

  resultsDiv.classList.remove("hidden");
  showSummaryModal(avgScore);
});

// Ripple effect on Check Similarity button
const checkBtn = document.getElementById("checkBtn");
checkBtn.addEventListener("click", function (e) {
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");
  this.appendChild(ripple);

  const rect = this.getBoundingClientRect();
  ripple.style.left = `${e.clientX - rect.left}px`;
  ripple.style.top = `${e.clientY - rect.top}px`;

  setTimeout(() => ripple.remove(), 600);
});

// Help Button Toggle (robust)
const helpBtn = document.getElementById("helpBtn");
const helpPanel = document.getElementById("helpPanel");
const closeHelp = document.getElementById("closeHelp");

let helpOpen = false;
let helpLastToggle = 0;
const HELP_TOGGLE_COOLDOWN = 200;

function openHelp() {
  if (!helpPanel) return;
  helpPanel.classList.remove("hidden");
  helpPanel.setAttribute("aria-hidden", "false");
  helpBtn && helpBtn.setAttribute("aria-expanded", "true");
  helpOpen = true;
}
function closeHelpPanel() {
  if (!helpPanel) return;
  helpPanel.classList.add("hidden");
  helpPanel.setAttribute("aria-hidden", "true");
  helpBtn && helpBtn.setAttribute("aria-expanded", "false");
  helpOpen = false;
}
function toggleHelp() {
  const now = Date.now();
  if (now - helpLastToggle < HELP_TOGGLE_COOLDOWN) return;
  helpLastToggle = now;
  helpOpen ? closeHelpPanel() : openHelp();
}

helpBtn && helpBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleHelp();
});
closeHelp && closeHelp.addEventListener("click", (e) => {
  e.stopPropagation();
  closeHelpPanel();
});

document.addEventListener("click", (e) => {
  if (!helpOpen) return;
  if (!helpPanel.contains(e.target) && e.target !== helpBtn) {
    closeHelpPanel();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && helpOpen) {
    closeHelpPanel();
  }
});

// Prevent help form reload
document.querySelector(".help-form").addEventListener("submit", e => {
  e.preventDefault();
  openModal("✅ Your question has been sent!", "Sent", "success");
  e.target.reset();
});

// Close modal when clicking the "View details" anchor
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.matches("a[href='#results']")) {
    setTimeout(() => closeModal(), 0);
  }
});