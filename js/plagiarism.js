console.log("✅ plagiarism.js loaded");

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
    alert("Please upload a valid .txt file");
  }
});

// Check Similarity Button
document.getElementById("checkBtn").addEventListener("click", () => {
  const studentText = document.getElementById("studentText").value.trim();
  const referenceText = document.getElementById("referenceText").value.trim();
  const resultsDiv = document.getElementById("results");
  const highlightedTextDiv = document.getElementById("highlightedText");
  const scoreDisplay = document.getElementById("similarityScore");

  if (!studentText || !referenceText) {
    alert("Please paste or upload reference text and your work.");
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

  // Update progress bar
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${avgScore}%`;

  // Change color depending on severity
  if (avgScore > 50) {
    progressBar.style.background = "#dc3545"; // red
  } else if (avgScore > 20) {
    progressBar.style.background = "#ffc107"; // yellow
  } else {
    progressBar.style.background = "#28a745"; // green
  }


  resultsDiv.classList.remove("hidden");
});

// Help Button Toggle
const helpBtn = document.getElementById("helpBtn");
const helpPanel = document.getElementById("helpPanel");
const closeHelp = document.getElementById("closeHelp");

helpBtn.addEventListener("click", () => {
  helpPanel.classList.toggle("hidden");
});

closeHelp.addEventListener("click", () => {
  helpPanel.classList.add("hidden");
});

// Prevent form reload
document.querySelector(".help-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("✅ Your question has been sent!");
  e.target.reset();
});

console.log("✅ plagiarism.js loaded");


// ============ PLAGIARISM CHECKER ============
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
    alert("Please upload a valid .txt file");
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
    alert("Please paste or upload reference text and your work.");
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
});

// Ripple effect on Check Similarity button
const checkBtn = document.getElementById("checkBtn");
checkBtn.addEventListener("click", function (e) {
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");
  this.appendChild(ripple);

  // Position ripple
  const rect = this.getBoundingClientRect();
  ripple.style.left = `${e.clientX - rect.left}px`;
  ripple.style.top = `${e.clientY - rect.top}px`;

  setTimeout(() => ripple.remove(), 600);
});

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

// Sidebar + Theme toggles are handled centrally by js/site-utils.js
// Per-page initialization removed to avoid duplicate listeners.