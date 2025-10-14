document.addEventListener("DOMContentLoaded", () => {
    // --- Progress Tracker Logic ---
    const progressBar = document.getElementById("tracker-progress");
    const progressText = document.getElementById("tracker-label");
    const activityCards = document.querySelectorAll('.lesson-card');
    let completed = Array(activityCards.length).fill(false);
    const total = completed.length;
    function updateProgress() {
        const done = completed.filter(Boolean).length;
        let percent = Math.round((done / total) * 100);
        if (progressBar && progressText) {
            progressBar.style.width = percent + "%";
            progressText.textContent = percent + "% Complete";
            progressText.style.display = 'block';
            progressText.style.textAlign = 'center';
            progressText.style.width = '100%';
        }
    }
    updateProgress();

    // Shuffle options for matching selects so answers aren't in a predictable order
    (function shuffleMatchingSelects(){
        function shuffle(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
        const selects = document.querySelectorAll('#tabLessons select');
        selects.forEach(sel => {
            // Keep placeholder (first option with empty value) in place
            const opts = Array.from(sel.options);
            if (!opts || opts.length <= 2) return;
            let placeholder = null;
            if (opts[0] && opts[0].value === '') {
                placeholder = opts.shift();
            }
            const shuffled = shuffle(opts);
            // Rebuild options: placeholder (if any) + shuffled others
            sel.innerHTML = '';
            if (placeholder) sel.appendChild(placeholder);
            shuffled.forEach(o => sel.appendChild(o));
            // Reset selection to placeholder
            sel.value = '';
        });
    })();

    // Expose a reset function for the Lessons tab, used by the reset modal in learning.html
    // This clears selections, inputs, drag orders, hotspot info, feedback labels, and progress.
    window.__resetLessonsInteractive = function (opts) {
        try {
            const allowedTitles = (opts && Array.isArray(opts.titles)) ? new Set(opts.titles.map(s => (s||'').trim())) : null;
            // Backup snapshot for Undo capability
            const backup = {
                selects: [], inputs: [], lists: [], statuses: [], hotspotText: []
            };
            // Save, clear, and reshuffle selects
            document.querySelectorAll('#tabLessons .lesson-card').forEach(card => {
                const title = (card.querySelector('.lesson-title')?.textContent || '').trim();
                if (allowedTitles && !allowedTitles.has(title)) return;
                card.querySelectorAll('select').forEach(sel => {
                    backup.selects.push({ el: sel, value: sel.value });
                    // reshuffle options but keep placeholder
                    const opts = Array.from(sel.options);
                    const hasPlaceholder = opts[0] && opts[0].value === '';
                    const placeholder = hasPlaceholder ? opts.shift() : null;
                    // Fisher-Yates shuffle
                    for (let i = opts.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [opts[i], opts[j]] = [opts[j], opts[i]];
                    }
                    sel.innerHTML = '';
                    if (placeholder) sel.appendChild(placeholder);
                    opts.forEach(o => sel.appendChild(o));
                    sel.value = '';
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                });
            });
            // Save and clear inputs
            document.querySelectorAll('#tabLessons .lesson-card').forEach(card => {
                const title = (card.querySelector('.lesson-title')?.textContent || '').trim();
                if (allowedTitles && !allowedTitles.has(title)) return;
                card.querySelectorAll('input[type="text"]').forEach(inp => {
                    backup.inputs.push({ el: inp, value: inp.value }); inp.value = ''; inp.dispatchEvent(new Event('input', { bubbles: true }));
                });
            });
            // Save and clear feedback/result boxes
            document.querySelectorAll('#tabLessons .lesson-card').forEach(card => {
                const title = (card.querySelector('.lesson-title')?.textContent || '').trim();
                if (allowedTitles && !allowedTitles.has(title)) return;
                card.querySelectorAll('.matchingResultEthics, .matchingResultStat, .orderResult, [id$="Result"]').forEach(n => {
                    backup.selects.push({ el: n, value: n.textContent }); n.textContent = ''; n.className = n.className.replace(/\b(success|error|animated|pulse|tada)\b/g, '').trim();
                });
            });
            // Reset lesson completion statuses
            document.querySelectorAll('#tabLessons .lesson-card').forEach(card => {
                const title = (card.querySelector('.lesson-title')?.textContent || '').trim();
                if (allowedTitles && !allowedTitles.has(title)) return;
                const status = card.querySelector('.lesson-status');
                if (status) { backup.statuses.push({ el: status, text: status.textContent, cls: status.className }); status.textContent = 'Not Completed'; status.classList.remove('completed'); }
            });
            // Clear hotspot info boxes
            document.querySelectorAll('#tabLessons .lesson-card .infographic').forEach(info => {
                const title = (info.closest('.lesson-card')?.querySelector('.lesson-title')?.textContent || '').trim();
                if (allowedTitles && !allowedTitles.has(title)) return;
                const infoBox = info.querySelector('[id^="hotspot-info"], .hotspot-info, .hotspot-info-2-1, .hotspot-info-2-2, .hotspot-info-3-1, .hotspot-info-3-2, .hotspot-info-4-1, .hotspot-info-4-2, .hotspot-info-5-1, .hotspot-info-5-2');
                if (infoBox) { backup.hotspotText.push({ el: infoBox, text: infoBox.textContent, disp: infoBox.style.display }); infoBox.textContent=''; infoBox.style.display='none'; }
            });
            // Re-scramble drag lists and backup their previous order
            document.querySelectorAll('#tabLessons .lesson-card .drag-list').forEach(list => {
                const title = (list.closest('.lesson-card')?.querySelector('.lesson-title')?.textContent || '').trim();
                if (allowedTitles && !allowedTitles.has(title)) return;
                const items = Array.from(list.querySelectorAll('.drag-item'));
                backup.lists.push({ el: list, order: items.map(i => i.textContent) });
                // Shuffle
                for (let i = items.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    list.appendChild(items[j]);
                    items.splice(j, 1);
                }
            });
            // Reset internal progress state
            completed = Array(activityCards.length).fill(false);
            updateProgress();
            // Toast-like message (using lessons toast container)
            const toastRoot = document.getElementById('toastLessons');
            if (toastRoot) {
                const t = document.createElement('div'); t.className = 'toast info'; t.style.background = '#0b5ed7'; t.style.color = '#fff'; t.style.padding = '10px 12px'; t.style.borderRadius = '8px'; t.style.boxShadow='0 2px 8px rgba(0,0,0,.15)'; t.style.marginTop='8px';
                const msg = document.createElement('span'); msg.textContent = 'Lessons reset. You can try again now.'; t.appendChild(msg);
                const undo = document.createElement('button'); undo.textContent = 'Undo'; undo.className = 'btn small'; undo.style.marginLeft = '10px'; undo.style.background = '#084298'; undo.style.border='none'; undo.style.color='#fff';
                undo.addEventListener('click', () => {
                    try {
                        // Restore selects and inputs
                        backup.selects.forEach(s => { if (s.el) { s.el.value = s.value || ''; s.el.dispatchEvent(new Event('change', { bubbles: true })); } });
                        backup.inputs.forEach(i => { if (i.el) { i.el.value = i.value || ''; i.el.dispatchEvent(new Event('input', { bubbles: true })); } });
                        // Restore feedback texts if we captured any
                        // (they were packed into backup.selects to avoid a separate array)
                        // Restore statuses
                        backup.statuses.forEach(st => { if (st.el) { st.el.textContent = st.text; st.el.className = st.cls; } });
                        // Restore hotspot texts
                        backup.hotspotText.forEach(h => { if (h.el) { h.el.textContent = h.text || ''; h.el.style.display = h.disp || ''; } });
                        // Restore drag lists order (by text match)
                        backup.lists.forEach(listBk => {
                            const list = listBk.el; if (!list) return; const current = Array.from(list.querySelectorAll('.drag-item'));
                            listBk.order.forEach(txt => {
                                const node = current.find(n => n.textContent.trim() === txt.trim());
                                if (node) list.appendChild(node);
                            });
                        });
                        // Progress won't know granular correctness; we keep it reset to avoid inconsistency
                        completed = Array(activityCards.length).fill(false);
                        updateProgress();
                    } finally { if (t.parentNode) t.remove(); }
                });
                t.appendChild(undo);
                toastRoot.appendChild(t);
                setTimeout(() => { if (t.parentNode) { t.style.opacity='0.9'; t.style.transition='opacity .3s ease, transform .3s ease'; t.style.transform='translateY(4px)'; } }, 10);
                setTimeout(() => { if (t.parentNode) t.remove(); }, 6000);
            }
        } catch (e) { console.warn('Lessons reset failed', e); }
    };

    // --- Lesson 5.1: Descriptive Statistics Matching ---
    document.querySelectorAll('.lesson-card').forEach(card => {
        const matchBtn = card.querySelector('.check-matching-stat');
        if (matchBtn) {
            matchBtn.addEventListener('click', () => {
                const selects = [
                    card.querySelector('#match-stat-1'),
                    card.querySelector('#match-stat-2'),
                    card.querySelector('#match-stat-3')
                ];
                const resultBox = card.querySelector('.matchingResultStat');
                // Correct: Mean: C, Median: A, Mode: B
                const correct = ['C', 'A', 'B'];
                let allCorrect = selects.every((sel, i) => sel && sel.value.trim().toUpperCase() === correct[i]);
                let cardIdx = Array.from(activityCards).indexOf(card);
                if (allCorrect) {
                    resultBox.textContent = 'Great job! All answers are correct.';
                    resultBox.className = 'success animated pulse';
                    if (cardIdx !== -1) completed[cardIdx] = true;
                    const status = card.querySelector('.lesson-status');
                    if (status) {
                        status.textContent = 'Completed';
                        status.classList.add('completed');
                    }
                    updateProgress();
                } else {
                    resultBox.textContent = 'Some answers are incorrect. Try again!';
                    resultBox.className = 'error';
                }
            });
        }
    });
    // --- Lesson 5.2: Inferential Statistics Fill-in-the-Blank ---
    const fillBtn5 = document.getElementById('checkFillBlank5');
    if (fillBtn5) {
        fillBtn5.addEventListener('click', () => {
            const input1 = document.getElementById('fillBlank5');
            const input2 = document.getElementById('fillBlank5b');
            const result = document.getElementById('fillBlank5Result');
            const answer1 = 'predictions';
            const answer2 = 'inferences';
            let card = fillBtn5.closest('.lesson-card');
            let cardIdx = Array.from(activityCards).indexOf(card);
            if (input1.value.trim().toLowerCase() === answer1 && input2.value.trim().toLowerCase() === answer2) {
                result.textContent = 'Correct!';
                result.className = 'success animated tada';
                if (cardIdx !== -1) completed[cardIdx] = true;
                const status = card.querySelector('.lesson-status');
                if (status) {
                    status.textContent = 'Completed';
                    status.classList.add('completed');
                }
                updateProgress();
            } else {
                result.textContent = 'Try again.';
                result.className = 'error';
            }
        });
    }

    // ...all remaining code from the second block goes here, unwrapped...
    // --- Chapter Navigation Logic ---
    const chapters = document.querySelectorAll(".chapter");
    const prevButton = document.getElementById("prevChapter");
    const nextButton = document.getElementById("nextChapter");
    let currentChapterIndex = 0;

    function showChapter(index) {
        chapters.forEach((chapter, i) => {
            chapter.style.display = i === index ? "block" : "none";
        });
        if (prevButton) prevButton.style.display = index === 0 ? "none" : "inline-block";
        if (nextButton) nextButton.style.display = index === chapters.length - 1 ? "none" : "inline-block";
    }
    showChapter(currentChapterIndex);

    if (nextButton) nextButton.addEventListener("click", () => {
        if (currentChapterIndex < chapters.length - 1) {
            currentChapterIndex++;
            showChapter(currentChapterIndex);
        }
    });
    if (prevButton) prevButton.addEventListener("click", () => {
        if (currentChapterIndex > 0) {
            currentChapterIndex--;
            showChapter(currentChapterIndex);
        }
    });

    // Per-chapter navigation
    document.getElementById("nextChapter1")?.addEventListener("click", () => {
        currentChapterIndex = 1;
        showChapter(currentChapterIndex);
    });
    document.getElementById("prevChapter2")?.addEventListener("click", () => {
        currentChapterIndex = 0;
        showChapter(currentChapterIndex);
    });
    document.getElementById("nextChapter2")?.addEventListener("click", () => {
        currentChapterIndex = 2;
        showChapter(currentChapterIndex);
    });
    document.getElementById("prevChapter3")?.addEventListener("click", () => {
        currentChapterIndex = 1;
        showChapter(currentChapterIndex);
    });
    document.getElementById("nextChapter3")?.addEventListener("click", () => {
        currentChapterIndex = 3;
        showChapter(currentChapterIndex);
    });
    document.getElementById("prevChapter4")?.addEventListener("click", () => {
        currentChapterIndex = 2;
        showChapter(currentChapterIndex);
    });
    document.getElementById("nextChapter4")?.addEventListener("click", () => {
        currentChapterIndex = 4;
        showChapter(currentChapterIndex);
    });
    document.getElementById("prevChapter5")?.addEventListener("click", () => {
        currentChapterIndex = 3;
        showChapter(currentChapterIndex);
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
    // Per-page initialization removed to avoid duplicate listeners and ensure consistent behavior.

    // --- Progress Tracker Logic ---
    // --- Ethics Matching Activity (Chapter 2) ---
    document.querySelectorAll('.check-matching-ethics').forEach((btn) => {
        btn.addEventListener('click', () => {
            // Get the selects for ethics matching
            const card = btn.closest('.lesson-card');
            const selects = [
                card.querySelector('#match-ethics-1'),
                card.querySelector('#match-ethics-2'),
                card.querySelector('#match-ethics-3')
            ];
            const resultBox = card.querySelector('.matchingResultEthics');
            // Correct answers: 1: A, 2: B, 3: C
            const correct = ["A", "B", "C"];
            // Accept answers case-insensitively and trimmed
            let allCorrect = selects.every((sel, i) => sel && sel.value.trim().toUpperCase() === correct[i]);
            // Find the index of the parent lesson-card
            let cardIdx = Array.from(activityCards).indexOf(card);
            // Always enable selects and button for unlimited attempts
            selects.forEach(sel => { if (sel) sel.disabled = false; });
            btn.disabled = false;
            if (allCorrect) {
                resultBox.textContent = 'Great job! All answers are correct.';
                resultBox.className = 'success animated pulse';
                if (cardIdx !== -1) completed[cardIdx] = true;
                // Update lesson status to Completed
                const status = card.querySelector('.lesson-status');
                if (status) {
                    status.textContent = 'Completed';
                    status.classList.add('completed');
                }
                updateProgress();
            } else {
                resultBox.textContent = 'Some answers are incorrect. Try again!';
                resultBox.className = 'error';
            }
        });
    });


    // --- Infographic Hotspots (click to show hint, accessible, no hover glitches) ---
    document.querySelectorAll('.infographic').forEach(infographic => {
        const hotspots = infographic.querySelectorAll('.hotspot');
        // Try to find a local info box, fallback to global
        let infoBox = infographic.querySelector('[id^="hotspot-info"], .hotspot-info, .hotspot-info-2-1, .hotspot-info-2-2, .hotspot-info-3-1, .hotspot-info-3-2, .hotspot-info-4-1, .hotspot-info-4-2, .hotspot-info-5-1, .hotspot-info-5-2');
        if (!infoBox) infoBox = document.getElementById('hotspot-info');

        // Adjust overlay to match image height so hints below aren't covered by overlay
        const img = infographic.querySelector('img');
        const overlay = infographic.querySelector('.infographic-hotspots');
        function setOverlaySize() {
            try {
                if (!overlay || !img) return;
                const h = img.clientHeight || img.naturalHeight || 0;
                overlay.style.height = (h ? h + 'px' : '100%');
                overlay.style.width = '100%';
            } catch(e) { /* ignore */ }
        }
        if (img && overlay) {
            setOverlaySize();
            // ResizeObserver for dynamic updates
            try {
                const ro = new ResizeObserver(() => setOverlaySize());
                ro.observe(img);
                window.addEventListener('resize', setOverlaySize);
                img.addEventListener('load', setOverlaySize, { once: true });
            } catch(e) {
                // Fallback: window resize
                window.addEventListener('resize', setOverlaySize);
                img.addEventListener('load', setOverlaySize, { once: true });
            }
        }
        hotspots.forEach(btn => {
            if (btn.dataset.bound === '1') return; // prevent double-binding
            btn.dataset.bound = '1';
            btn.addEventListener("click", e => {
                if (!infoBox) return; // nothing to show into
                const text = btn.getAttribute("data-info") || '';
                // Toggle: if already showing this hint, hide it; else show
                if ((infoBox.textContent || '').trim() === text.trim()) {
                    infoBox.textContent = "";
                    infoBox.style.display = "none";
                } else {
                    infoBox.textContent = text;
                    infoBox.style.display = "block";
                }
            });
        });
        // Delegated capture listener as a safety net (handles dynamically added hotspots too)
        if (!infographic.__hotspotsDelegated) {
            infographic.__hotspotsDelegated = true;
            infographic.addEventListener('click', (ev) => {
                const target = ev.target.closest && ev.target.closest('.hotspot');
                if (!target) return;
                ev.stopPropagation();
                ev.preventDefault();
                const text = target.getAttribute('data-info') || '';
                const box = infoBox || infographic.querySelector('[id^="hotspot-info"], .hotspot-info');
                if (!box) return;
                if ((box.textContent || '').trim() === text.trim()) { box.textContent = ''; box.style.display = 'none'; }
                else { box.textContent = text; box.style.display = 'block'; }
            }, true);
        }
    });

    // --- Drag & Drop and Fill-in-the-Blank for all lessons ---
    // Scramble drag-list items on page load
    document.querySelectorAll('.drag-list').forEach(list => {
        const items = Array.from(list.children);
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            list.appendChild(items[j]);
            items.splice(j, 1);
        }
    });
    // Drag-and-drop: for each .drag-list, allow reordering and check order
    document.querySelectorAll('.drag-list').forEach(list => {
        let dragSrc = null;
        function attachDragEvents() {
            list.querySelectorAll('.drag-item').forEach(item => {
                item.setAttribute('draggable', 'true');
                item.ondragstart = e => {
                    dragSrc = item;
                    setTimeout(() => item.classList.add('dragging'), 0);
                };
                item.ondragend = e => {
                    item.classList.remove('dragging');
                };
                item.ondragover = e => {
                    e.preventDefault();
                };
                item.ondrop = e => {
                    e.preventDefault();
                    if (dragSrc && dragSrc !== item) {
                        list.insertBefore(dragSrc, item.nextSibling);
                        attachDragEvents(); // Re-attach after DOM change
                    }
                };
            });
        }
        attachDragEvents();
    });
    // Drag-and-drop check buttons
    document.querySelectorAll('.check-order-btn, .check-sampling, .check-exp-design, .check-stat-terms').forEach((btn, idx) => {
        btn.addEventListener('click', e => {
            const card = btn.closest('.lesson-card');
            const list = card ? card.querySelector('.drag-list') : null;
            if (!list) return;
            const items = Array.from(list.querySelectorAll('.drag-item'));
            let correctOrder = [];
            // Set correct order for each activity by id
            if (list.id === 'research-steps') correctOrder = ['Formulate Question', 'Review Literature', 'Collect Data', 'Analyze Results', 'Draw Conclusions'];
            if (list.id === 'sampling-types-3-1') correctOrder = ['Random', 'Systematic', 'Stratified', 'Cluster'];
            if (list.id === 'exp-design-4-1') correctOrder = ['Hypothesis', 'Variables', 'Experiment', 'Analysis'];
            if (list.id === 'stat-terms-5-1') correctOrder = ['Mean', 'Median', 'Mode'];
            let correct = items.every((item, i) => item.textContent.trim() === correctOrder[i]);
            let resultBox = btn.parentElement.querySelector('div[class*="Result"]') || btn.parentElement.querySelector('div[id*="Result"]');
            // Find the index of the parent lesson-card
            let cardIdx = Array.from(activityCards).indexOf(card);
            // Always allow unlimited attempts: never disable button or drag items
            btn.disabled = false;
            items.forEach(item => item.draggable = true);
            if (correct) {
                resultBox.textContent = 'Great job! All steps are correct.';
                resultBox.className = 'success animated pulse';
                // Mark as completed, but do NOT lock out or disable further attempts
                if (cardIdx !== -1) completed[cardIdx] = true;
                // Update lesson status to Completed, but allow further attempts
                const status = card.querySelector('.lesson-status');
                if (status) {
                    status.textContent = 'Completed';
                    status.classList.add('completed');
                }
                updateProgress();
            } else {
                resultBox.textContent = 'Some steps are incorrect. Try again!';
                resultBox.className = 'error';
                // Remove completed status if user makes a mistake after getting it correct
                if (cardIdx !== -1) completed[cardIdx] = false;
                const status = card.querySelector('.lesson-status');
                if (status) {
                    status.textContent = 'Not Completed';
                    status.classList.remove('completed');
                }
                updateProgress();
            }
        });
    });
    // Fill-in-the-blank check buttons
    // Fill-in-the-blank check buttons (supporting two blanks for specific lessons)
    [1, 2, 3, 4, 5].forEach(num => {
        const btn = document.getElementById('checkFillBlank' + num);
        if (btn) {
            btn.addEventListener('click', () => {
                const card = btn.closest('.lesson-card');
                const cardIdx = Array.from(activityCards).indexOf(card);
                // Expected pairs per lesson:
                // 1: Types of Research -> quantitative + qualitative
                // 2: Informed Consent -> agree + understand
                // 3: Probability Sampling -> random + equal
                // 4: Survey Design -> leading + clear
                // 5: Inferential Statistics -> predictions + inferences (handled separately earlier as well)
                const pairs = {
                    1: ['quantitative', 'qualitative'],
                    2: ['agree', 'understand'],
                    3: ['random', 'equal'],
                    4: ['leading', 'clear'],
                    5: ['predictions', 'inferences']
                };
                const first = document.getElementById('fillBlank' + num);
                const second = document.getElementById('fillBlank' + num + 'b');
                const result = document.getElementById('fillBlank' + num + 'Result');
                const expected = pairs[num];
                if (!expected || !first) return;
                const ok1 = (first.value || '').trim().toLowerCase() === expected[0];
                const ok2 = expected[1] ? (second && (second.value || '').trim().toLowerCase() === expected[1]) : true;
                if (ok1 && ok2) {
                    if (result) { result.textContent = 'Correct!'; result.className = 'success animated tada'; }
                    if (cardIdx !== -1) completed[cardIdx] = true;
                    const status = card ? card.querySelector('.lesson-status') : null;
                    if (status) { status.textContent = 'Completed'; status.classList.add('completed'); }
                    updateProgress();
                } else {
                    if (result) { result.textContent = 'Try again.'; result.className = 'error'; }
                }
            });
        }
    });


    // --- Chapter 2: True/False ---
    const tfBtns = document.querySelectorAll(".tf-btn");
    if (tfBtns.length) {
        tfBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const feedback = btn.parentElement.querySelector(".tf-feedback");
                if (btn.dataset.answer === "true") {
                    feedback.textContent = "Correct!";
                    feedback.className = "success animated tada tf-feedback";
                    completed[1] = true;
                    updateProgress();
                } else {
                    feedback.textContent = "Try again.";
                    feedback.className = "error tf-feedback";
                }
            });
        });
    }

    // --- Chapter 3: Matching ---
    // (Removed misplaced/duplicated event listener and extra closing brackets)

    // --- Chapter 5: Fill in the Blank ---
    const fillCheck = document.querySelector(".fillblank-final-check");
    if (fillCheck) {
        fillCheck.addEventListener("click", () => {
            const input = document.querySelector(".fill-blank-final");
            const feedback = document.querySelector(".fillblank-final-feedback");
            if (input.value.trim().toLowerCase() === input.dataset.answer) {
                input.classList.add("correct");
                input.classList.remove("incorrect");
                feedback.textContent = "Correct!";
                feedback.className = "success animated tada fillblank-final-feedback";
                completed[4] = true;
                updateProgress();
            } else {
                input.classList.remove("correct");
                input.classList.add("incorrect");
                feedback.textContent = "Try again.";
                feedback.className = "error fillblank-final-feedback";
            }
        });
    }



    // End of DOMContentLoaded
});

