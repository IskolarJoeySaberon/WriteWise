const data = {
    beginner: {
        title: 'Beginner', badge: 'RRL Pro', lessons: [
            {
                id: 'b1',
                title: 'Introduction & Thesis Basics',
                content: '<p>Learn to craft a clear thesis statement.</p>',
                video: 'https://www.youtube.com/embed/AKKyeOJkv-c',
                quiz: [
                    { q: 'What is the main purpose of a thesis statement?', options: ['To list sources', 'To state the central argument', 'To summarize the whole paper'], a: 1, explain: 'A thesis presents the central argument your paper will support.' },
                    { q: 'Which element makes a thesis strong?', options: ['Vague topic', 'Clear stance and scope', 'Only questions'], a: 1, explain: 'A strong thesis has a clear stance and a defined scope (what and how much you claim).' },
                    { q: 'A good thesis should be:', options: ['Too broad', 'Specific and arguable', 'A collection of facts'], a: 1, explain: 'Specific and arguable means readers can debate it and you can provide evidence.' },
                    { q: 'When revising a thesis you should:', options: ['Make it more precise', 'Remove the main idea', 'Add unrelated topics'], a: 0, explain: 'Revising usually narrows and clarifies the thesis, not removes it.' }
                ],
                exercise: { prompt: 'Fix: "This paper is about social media."', hint: 'Be specific: include topic, scope, and stance (who/what/where/time).' }
            },
            {
                id: 'b2',
                title: 'Finding Reliable Sources',
                content: '<p>How to find and evaluate sources.</p>',
                video: 'https://www.youtube.com/embed/zIYC6zG265E',
                quiz: [
                    { q: 'Which source is generally most reliable for academic work?', options: ['Personal blog', 'Peer-reviewed journal', 'Social media post'], a: 1, explain: 'Peer-reviewed journals are evaluated by experts before publication.' },
                    { q: 'What indicates a scholarly article?', options: ['No author listed', 'Peer review and references', 'Casual tone'], a: 1, explain: 'Scholarly articles cite sources and often undergo peer review.' },
                    { q: 'When evaluating a source, you should check:', options: ['Author credentials', 'Number of images', 'Font size'], a: 0, explain: 'Author credentials help assess authority and expertise.' },
                    { q: 'A database like JSTOR is best used for:', options: ['Shopping', 'Finding academic articles', 'Sending messages'], a: 1, explain: 'JSTOR archives academic journals and primary sources.' }
                ],
                exercise: { prompt: 'Is "Journal of Applied Research (peer-reviewed)" scholarly?', hint: 'Look for peer-review, editorial board, and publisher.' }
            }
        ]
    },
    intermediate: {
        title: 'Intermediate', badge: 'Citation Master', lessons: [
            {
                id: 'i1',
                title: 'Citations & Reference Management',
                content: '<p>Use citation managers and format references correctly.</p>',
                quiz: [
                    { q: 'Which citation element is required in most styles?', options: ['Author name', 'Color of the journal', 'Author birthplace'], a: 0, explain: 'Author name allows readers to locate the source and assess authority.' },
                    { q: 'In APA style, where does the publication year usually appear?', options: ['After the author', 'At the end of the citation', 'Before the title'], a: 0, explain: 'In APA the year typically follows the author name in parentheses.' },
                    { q: 'A DOI in a citation helps to:', options: ['Provide a stable link to an article', 'Show the article length', 'List funding sources'], a: 0, explain: 'A DOI is a persistent identifier for digital content.' },
                    { q: 'Which tool helps manage references and auto-format bibliographies?', options: ['Citation manager (Zotero/Mendeley)', 'Text editor theme', 'USB drive'], a: 0, explain: 'Citation managers help collect, organize, and format references.' }
                ],
                exercise: null
            }
        ]
    },
    advanced: {
        title: 'Advanced', badge: 'RRL Grandmaster', lessons: [
            {
                id: 'a1',
                title: 'Advanced Methods',
                content: '<p>Advanced methods overview and common pitfalls.</p>',
                quiz: [
                    { q: 'Which is an example of a quantitative method?', options: ['Surveys with numerical responses', 'Open interviews', 'Textual interpretation'], a: 0, explain: 'Quantitative methods collect numerical data that can be statistically analyzed.' },
                    { q: 'Triangulation in research means:', options: ['Using multiple methods or sources', 'Repeating the same test once', 'Using only one data source'], a: 0, explain: 'Triangulation increases validity by cross-checking results from different approaches.' },
                    { q: 'What is overfitting in modeling?', options: ['Model captures noise instead of signal', 'Model generalizes well', 'Model uses fewer variables than needed'], a: 0, explain: 'Overfitting fits the training data too closely and fails to generalize.' },
                    { q: 'Which practice improves reproducibility in methods?', options: ['Documenting steps and data processing', 'Hiding raw data', 'Using random variable names'], a: 0, explain: 'Clear documentation and sharing data/code improves reproducibility.' }
                ],
                exercise: null
            }
        ]
    }
};
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

/* === ENHANCEMENT MODULE: modules, lessons, quizzes, badges, bookmarks === */
(function () {
    const STORAGE_KEY = 'tutorials_progress_v1';
    const BOOKMARK_KEY = 'tutorials_bookmark_v1';

    function loadProgress() { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : { completed: {}, badges: {}, quizzes: {} } } catch (e) { return { completed: {}, badges: {}, quizzes: {} } } }
    function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
    function saveBookmark(id) { localStorage.setItem(BOOKMARK_KEY, id); }
    function loadBookmark() { return localStorage.getItem(BOOKMARK_KEY); }

    document.addEventListener('DOMContentLoaded', () => {
        // UI nodes (enhanced UI added to tutorials.html)
        const lessonList = document.getElementById('lessonList');
        const lessonContent = document.getElementById('lessonContent');
        const moduleTabs = document.querySelectorAll('.module-tab');
        const badgesWrap = document.getElementById('badges');
        const resumeBtn = document.getElementById('resumeBtn');
        const progressTrack = document.getElementById('moduleProgressTrack');
        const progressFill = document.getElementById('moduleProgress');
        const progressTrackBottom = document.getElementById('moduleProgressTrackBottom');
        const progressFillBottom = document.getElementById('moduleProgressBottom');

        if (!lessonList || !lessonContent) return; // enhanced UI not present

        let progress = loadProgress();
        let currentModule = 'beginner';

        // small UI helpers
        const toastRoot = document.getElementById('toast');
        function showToast(message, type = 'info', timeout = 3000, actionLabel, actionCallback) {
            if (!toastRoot) return; const t = document.createElement('div'); t.className = 'toast ' + (type || 'info');
            const msg = document.createElement('div'); msg.textContent = message; t.appendChild(msg);
            let intervalId = null;
            if (actionLabel && typeof actionCallback === 'function') {
                const a = document.createElement('button'); a.className = 'toast-action'; a.style.marginLeft = '10px';
                // show countdown in seconds
                let secs = Math.max(1, Math.ceil(timeout / 1000));
                const updateLabel = () => { a.textContent = `${actionLabel} (${secs}s)`; };
                updateLabel();
                a.addEventListener('click', () => { if (intervalId) clearInterval(intervalId); actionCallback(); if (t.parentNode) t.remove(); });
                t.appendChild(a);
                // progress bar element
                const pbWrap = document.createElement('div'); pbWrap.className = 'toast-progress-wrap'; const pb = document.createElement('div'); pb.className = 'toast-progress'; pbWrap.appendChild(pb); t.appendChild(pbWrap);
                const start = Date.now();
                intervalId = setInterval(() => {
                    const elapsed = Date.now() - start; const remaining = Math.max(0, timeout - elapsed); secs = Math.ceil(remaining / 1000);
                    if (secs <= 0) { clearInterval(intervalId); intervalId = null; pb.style.width = '0%'; return; }
                    updateLabel();
                    const pct = Math.max(0, Math.min(100, (remaining / timeout) * 100)); pb.style.width = pct + '%';
                }, 200);
            }
            toastRoot.appendChild(t);
            const remover = setTimeout(() => { if (t.parentNode) { if (intervalId) clearInterval(intervalId); t.style.opacity = '0'; t.style.transform = 'translateY(6px)'; setTimeout(() => t.remove(), 300); } }, timeout);
            return t;
        }

        // One-time cleanse of any previously saved quiz answers/completions
        // for the learning modules so users can answer fresh. Before deleting,
        // create a backup and offer an Undo action. This runs only once and is
        // guarded by a flag to avoid repeatedly wiping progress.
        const CLEANSed_FLAG = 'tutorials_cleansed_v1';
        try {
            if (!localStorage.getItem(CLEANSed_FLAG)) {
                // build a minimal backup containing the quizzes/completed entries we'll remove
                const backup = { ts: Date.now(), modules: {}, fullProgress: JSON.parse(JSON.stringify(progress || {})) };
                ['beginner', 'intermediate', 'advanced'].forEach(modKey => {
                    const mod = data[modKey];
                    if (!mod || !mod.lessons) return;
                    backup.modules[modKey] = { quizzes: {}, completed: {} };
                    mod.lessons.forEach(l => {
                        if (progress.quizzes && progress.quizzes[l.id]) { backup.modules[modKey].quizzes[l.id] = progress.quizzes[l.id]; delete progress.quizzes[l.id]; }
                        if (progress.completed && progress.completed[l.id]) { backup.modules[modKey].completed[l.id] = true; delete progress.completed[l.id]; }
                    });
                });

                // persist backup so it can be restored if user chooses Undo later
                const bkKey = 'tutorials_backup_v1_' + backup.ts;
                try {
                    localStorage.setItem(bkKey, JSON.stringify(backup));
                    const idxKey = 'tutorials_backups_index_v1';
                    const idx = JSON.parse(localStorage.getItem(idxKey) || '[]');
                    idx.push(bkKey);
                    localStorage.setItem(idxKey, JSON.stringify(idx));
                } catch (e) { console.warn('Failed to save backup', e); }

                saveProgress(progress);
                localStorage.setItem(CLEANSed_FLAG, '1');

                // Offer Undo: restore the backup we just saved
                showToast('Saved quiz answers cleared for core modules so you can answer fresh.', 'info', 7000, 'Undo', () => {
                    try {
                        const raw = localStorage.getItem(bkKey);
                        if (raw) {
                            const b = JSON.parse(raw);
                            progress.quizzes = progress.quizzes || {};
                            progress.completed = progress.completed || {};
                            Object.keys(b.modules || {}).forEach(mk => {
                                const m = b.modules[mk] || {};
                                Object.keys(m.quizzes || {}).forEach(lid => progress.quizzes[lid] = m.quizzes[lid]);
                                Object.keys(m.completed || {}).forEach(lid => progress.completed[lid] = true);
                            });
                            saveProgress(progress);
                            renderLessons(currentModule);
                            renderBadges();
                            updateProgressBar(currentModule);
                            showToast('Saved answers restored.', 'success', 1800);
                        } else {
                            showToast('No backup found to restore.', 'warn', 2200);
                        }
                    } catch (err) { console.warn('Restore failed', err); showToast('Restore failed.', 'warn', 2200); }
                });
            }
        } catch (e) { console.warn('Cleanup of saved answers failed', e); }

        function retryQuiz(lessonId) {
            // backup current saved answers so user can undo
            const backup = progress.quizzes && progress.quizzes[lessonId] ? JSON.parse(JSON.stringify(progress.quizzes[lessonId])) : null;
            if (progress.quizzes && progress.quizzes[lessonId]) { delete progress.quizzes[lessonId]; }
            // also unmark completion for that lesson (safer)
            if (progress.completed && progress.completed[lessonId]) { progress.completed[lessonId] = false; }
            saveProgress(progress);
            showToast('Quiz reset. You can retake it now.', 'info', 6000, 'Undo', () => {
                if (backup) { progress.quizzes = progress.quizzes || {}; progress.quizzes[lessonId] = backup; saveProgress(progress); renderLessons(currentModule); openLesson(lessonId); showToast('Reset undone.', 'success', 1800); }
            });
            // reopen lesson to refresh UI
            openLesson(lessonId);
        }

        function renderBadges() {
            badgesWrap.innerHTML = '';
            const last = progress._lastAwarded;
            Object.keys(progress.badges || {}).forEach(k => {
                const s = document.createElement('span');
                s.className = 'badge';
                s.textContent = progress.badges[k];
                // if this badge was just awarded, add reveal animation
                if (last && k === last) {
                    s.classList.add('revealed');
                    // clear the last-awarded flag after animation so it doesn't replay on reload
                    setTimeout(() => {
                        s.classList.remove('revealed');
                        delete progress._lastAwarded;
                        saveProgress(progress);
                    }, 1200);
                }
                badgesWrap.appendChild(s);
            });
        }

        function findModuleByLesson(id) { for (const key of Object.keys(data)) { const m = data[key]; if (m.lessons.find(l => l.id === id)) return m; } return null; }

        function markCompleted(id) {
            progress.completed[id] = true;
            // find module key and module object
            let moduleKey = null;
            let mod = null;
            for (const key of Object.keys(data)) {
                const m = data[key];
                if (m.lessons.find(l => l.id === id)) {
                    moduleKey = key;
                    mod = m;
                    break;
                }
            }
            if (mod && mod.lessons.every(l => progress.completed[l.id])) {
                progress.badges = progress.badges || {};
                progress.badges[mod.title] = mod.badge;
                // record which badge was just awarded so we can animate it
                progress._lastAwarded = mod.title;
                // toast for badge award
                showToast(`Badge earned: ${mod.badge}`, 'success', 2800);
            }
            saveProgress(progress);
            renderLessons(currentModule);
            renderBadges();
            // update progress bar for the affected module
            updateProgressBar(moduleKey || currentModule);
        }

        function updateProgressBar(moduleKey) {
            // update both top and bottom progress bars (if present)
            const fills = [progressFill, progressFillBottom].filter(Boolean);
            const tracks = [progressTrack, progressTrackBottom].filter(Boolean);
            if (fills.length === 0) return;
            const mod = data[moduleKey];
            if (!mod) { fills.forEach(f => { f.style.width = '0%'; f.setAttribute('aria-valuenow', '0'); f.textContent = ''; }); return; }
            const total = mod.lessons.length;
            const done = mod.lessons.filter(l => progress.completed[l.id]).length;
            const pct = Math.round((done / total) * 100 || 0);
            fills.forEach(f => { f.style.width = pct + '%'; f.setAttribute('aria-valuenow', pct); f.textContent = pct + '%'; });
            tracks.forEach(t => { if (t) t.setAttribute('aria-valuenow', pct); });
        }

        function renderLessons(moduleKey) {
            lessonList.innerHTML = '';
            const mod = data[moduleKey];
            if (!mod) return;
            mod.lessons.forEach(lesson => {
                const item = document.createElement('div');
                item.className = 'lesson-item';
                if (progress.completed[lesson.id]) item.classList.add('completed');
                item.tabIndex = 0;
                const metaParts = [];
                if (lesson.video) metaParts.push('Video');
                if (lesson.quiz?.length) metaParts.push('Quiz');
                if (lesson.exercise) metaParts.push('Exercise');
                const metaText = metaParts.join(' • ');
                item.innerHTML = `<div><div class="title">${lesson.title}</div><div class="meta">${metaText}</div></div><div class="lesson-actions"><button class="btn small bookmark" data-id="${lesson.id}">Bookmark</button><button class="btn small reset" data-id="${lesson.id}" title="Reset quiz">⟲</button></div>`;
                item.addEventListener('click', () => openLesson(lesson.id));
                const bmBtn = item.querySelector('.bookmark');
                bmBtn.addEventListener('click', (e) => { e.stopPropagation(); saveBookmark(lesson.id); showToast('Bookmarked. Use Resume to return.', 'success', 2200); });
                const resetBtn = item.querySelector('.reset');
                resetBtn.addEventListener('click', (e) => { e.stopPropagation(); retryQuiz(lesson.id); });
                lessonList.appendChild(item);
            });
        }

        function openLesson(id) { // locate lesson
            let lesson = null; for (const key of Object.keys(data)) { const l = data[key].lessons.find(x => x.id === id); if (l) { lesson = l; break; } }
            if (!lesson) return;
            lessonContent.innerHTML = '';
            const h = document.createElement('h3'); h.textContent = lesson.title; lessonContent.appendChild(h);

            if (lesson.video) { const iframeWrap = document.createElement('div'); iframeWrap.className = 'video-container'; iframeWrap.innerHTML = `<iframe width="100%" height="315" src="${lesson.video}" frameborder="0" allowfullscreen></iframe>`; lessonContent.appendChild(iframeWrap); }
            lessonContent.insertAdjacentHTML('beforeend', lesson.content || '');

            // QUIZ: persisted per-lesson answers
            if (lesson.quiz && lesson.quiz.length) {
                progress.quizzes = progress.quizzes || {}; const saved = progress.quizzes[lesson.id] || { answers: Array(lesson.quiz.length).fill(null) };
                const qWrap = document.createElement('div'); qWrap.className = 'quiz';
                lesson.quiz.forEach((qObj, qi) => {
                    const qBox = document.createElement('div'); qBox.className = 'q'; qBox.innerHTML = `<div><strong>Q${qi + 1}.</strong> ${qObj.q}</div>`;
                    const ol = document.createElement('ul'); ol.className = 'options';

                    qObj.options.forEach((opt, oi) => {
                        const li = document.createElement('li');
                        const btn = document.createElement('button'); btn.className = 'btn small'; btn.textContent = opt;

                        // If question already answered, disable option buttons
                        if (saved.answers[qi] !== null) btn.disabled = true;

                        btn.addEventListener('click', () => {
                            if (saved.answers[qi] !== null) return; // already answered
                            saved.answers[qi] = oi; progress.quizzes[lesson.id] = saved; saveProgress(progress);

                            let fb = qBox.querySelector('.feedback'); if (!fb) { fb = document.createElement('div'); fb.className = 'feedback'; qBox.appendChild(fb); }
                            if (oi === qObj.a) { fb.textContent = 'Correct!'; fb.style.color = '#28a745'; } else { fb.textContent = 'Not quite — review the lesson.'; fb.style.color = '#b02a37'; }

                            // show explanation if available
                            if (qObj.explain) {
                                const ex = document.createElement('div'); ex.className = 'small'; ex.style.marginTop = '6px'; ex.textContent = qObj.explain; qBox.appendChild(ex);
                            }

                            // disable all buttons for this question
                            ol.querySelectorAll('button').forEach(b => b.disabled = true);

                            // if all answered show summary and evaluate pass threshold
                            const answeredCount = saved.answers.filter(a => a !== null).length;
                            if (answeredCount === lesson.quiz.length) {
                                const correct = saved.answers.reduce((acc, ans, idx) => acc + ((ans === lesson.quiz[idx].a) ? 1 : 0), 0);
                                const summary = document.createElement('div'); summary.className = 'feedback'; summary.style.marginTop = '12px'; summary.textContent = `Quiz complete — ${correct} / ${lesson.quiz.length} correct.`; lessonContent.appendChild(summary);
                                // only auto-complete if pass threshold (60%)
                                const pct = Math.round((correct / lesson.quiz.length) * 100);
                                if (pct >= 60) {
                                    markCompleted(lesson.id);
                                    showToast('Nice work — you passed the quiz!', 'success', 2200);
                                } else {
                                    // do not auto-complete; encourage retry
                                    const advise = document.createElement('div'); advise.className = 'small'; advise.style.marginTop = '8px'; advise.textContent = 'You can review the lesson and retake the quiz to improve your score.'; lessonContent.appendChild(advise);
                                    // add retry button
                                    const retry = document.createElement('button'); retry.className = 'btn retry'; retry.textContent = 'Retry Quiz'; retry.addEventListener('click', () => retryQuiz(lesson.id)); lessonContent.appendChild(retry);
                                    showToast('Quiz completed — try again to pass or press Mark complete.', 'warn', 2800);
                                }
                            }
                        });

                        li.appendChild(btn); ol.appendChild(li);
                    });

                    qBox.appendChild(ol);
                    // keyboard navigation for options
                    ol.addEventListener('keydown', (ev) => {
                        const buttons = Array.from(ol.querySelectorAll('button'));
                        const idx = buttons.findIndex(b => b === document.activeElement);
                        if (ev.key === 'ArrowDown') { ev.preventDefault(); const next = buttons[(idx + 1) % buttons.length]; if (next) next.focus(); }
                        if (ev.key === 'ArrowUp') { ev.preventDefault(); const prev = buttons[(idx - 1 + buttons.length) % buttons.length]; if (prev) prev.focus(); }
                    });

                    // if already answered, show saved feedback & explanation
                    if (saved.answers[qi] !== null) {
                        const chosen = saved.answers[qi];
                        const fb = document.createElement('div'); fb.className = 'feedback';
                        fb.textContent = (chosen === qObj.a) ? 'Correct (saved)' : 'Not correct (saved)';
                        fb.style.color = (chosen === qObj.a) ? '#28a745' : '#b02a37';
                        qBox.appendChild(fb);
                        if (qObj.explain) { const ex = document.createElement('div'); ex.className = 'small'; ex.style.marginTop = '6px'; ex.textContent = qObj.explain; qBox.appendChild(ex); }
                    }

                    qWrap.appendChild(qBox);
                });
                lessonContent.appendChild(qWrap);
            }

            // after rendering the quiz, if saved answers exist check if lesson should be marked completed
            (function checkSavedQuizProgress() {
                const savedAnswers = progress.quizzes && progress.quizzes[lesson.id] && progress.quizzes[lesson.id].answers;
                if (!savedAnswers) return;
                const answered = savedAnswers.filter(a => a !== null).length;
                if (answered === lesson.quiz.length) {
                    const correct = savedAnswers.reduce((acc, ans, idx) => acc + ((ans === lesson.quiz[idx].a) ? 1 : 0), 0);
                    const pct = Math.round((correct / lesson.quiz.length) * 100);
                    if (pct >= 60) { progress.completed[lesson.id] = true; saveProgress(progress); renderLessons(currentModule); renderBadges(); updateProgressBar(currentModule); }
                }
            })();

            // Exercise
            if (lesson.exercise) { const ex = document.createElement('div'); ex.className = 'exercise'; ex.innerHTML = `<div><strong>Exercise:</strong> ${lesson.exercise.prompt}</div>`; const ta = document.createElement('textarea'); ta.placeholder = 'Write your answer here...'; const hintBtn = document.createElement('button'); hintBtn.className = 'btn small'; hintBtn.textContent = 'Hint'; hintBtn.addEventListener('click', () => alert(lesson.exercise.hint)); const submit = document.createElement('button'); submit.className = 'btn'; submit.textContent = 'Submit Answer'; const result = document.createElement('div'); result.className = 'feedback'; submit.addEventListener('click', () => { const txt = ta.value.trim(); if (!txt) { result.textContent = 'Please write something to submit.'; result.style.color = '#b02a37'; return; } const keywords = lesson.exercise.prompt.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0, 5); const hit = keywords.some(k => k.length > 3 && txt.toLowerCase().includes(k)); if (hit) { result.textContent = 'Good attempt — you addressed key points!'; result.style.color = '#28a745'; markCompleted(lesson.id); } else { result.textContent = 'Nice try — consider the hint and be more specific.'; result.style.color = '#b02a37'; } }); ex.appendChild(ta); ex.appendChild(document.createElement('div')); ex.appendChild(hintBtn); ex.appendChild(document.createTextNode(' ')); ex.appendChild(submit); ex.appendChild(result); lessonContent.appendChild(ex); }

            const markBtn = document.createElement('button'); markBtn.className = 'btn small'; markBtn.textContent = 'Mark complete'; markBtn.addEventListener('click', () => markCompleted(lesson.id)); lessonContent.appendChild(document.createElement('div')); lessonContent.appendChild(markBtn);

            localStorage.setItem('tutorials_last_opened', lesson.id);
        }

        // module tab switching
        moduleTabs.forEach(t => t.addEventListener('click', () => { moduleTabs.forEach(x => x.classList.remove('active')); t.classList.add('active'); currentModule = t.dataset.module; renderLessons(currentModule); lessonContent.innerHTML = '<p>Select a lesson from the left to begin.</p>'; updateProgressBar(currentModule); }));

        resumeBtn.addEventListener('click', () => { const bm = loadBookmark(); const last = localStorage.getItem('tutorials_last_opened'); const target = bm || last; if (target) openLesson(target); else showToast('No bookmark or recent lesson found.', 'warn', 2200); });
        // Reset all quizzes/completions for the current module (with Undo)
        const resetModuleBtn = document.getElementById('resetModuleBtn');
        function resetModuleQuizzes() {
            const mod = data[currentModule];
            if (!mod) return;
            // backup state
            const backup = { quizzes: {}, completed: {} };
            mod.lessons.forEach(l => {
                if (progress.quizzes && progress.quizzes[l.id]) backup.quizzes[l.id] = JSON.parse(JSON.stringify(progress.quizzes[l.id]));
                if (progress.completed && progress.completed[l.id]) backup.completed[l.id] = true;
            });
            // clear
            mod.lessons.forEach(l => { if (progress.quizzes) delete progress.quizzes[l.id]; if (progress.completed) delete progress.completed[l.id]; });
            saveProgress(progress);
            renderLessons(currentModule); renderBadges(); updateProgressBar(currentModule);
            showToast('Module quizzes reset.', 'warn', 7000, 'Undo', () => {
                // restore
                progress.quizzes = progress.quizzes || {};
                progress.completed = progress.completed || {};
                Object.keys(backup.quizzes).forEach(k => progress.quizzes[k] = backup.quizzes[k]);
                Object.keys(backup.completed).forEach(k => progress.completed[k] = true);
                saveProgress(progress);
                renderLessons(currentModule); renderBadges(); updateProgressBar(currentModule);
                showToast('Module reset undone.', 'success', 2000);
            });
        }
        // open modal instead of confirm
        const resetModal = document.getElementById('resetModal');
        const resetCancel = document.getElementById('resetCancel');
        const resetConfirm = document.getElementById('resetConfirm');
        const resetModalList = document.getElementById('resetModalList');
        function openResetModal() {
            // list lessons that will be affected
            resetModalList.innerHTML = '';
            const mod = data[currentModule]; if (!mod) return;
            mod.lessons.forEach(l => { const li = document.createElement('li'); li.textContent = l.title; resetModalList.appendChild(li); });
            // focus management: save previously focused element and trap focus inside modal
            resetModal._previouslyFocused = document.activeElement;
            resetModal.setAttribute('aria-hidden', 'false');
            // focus first focusable inside modal
            const focusable = resetModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable.length) focusable[0].focus();
            // trap focus
            resetModal.addEventListener('keydown', resetModal._trap = function (e) {
                if (e.key === 'Escape') { e.preventDefault(); closeResetModal(); }
                if (e.key === 'Tab') {
                    const nodes = Array.from(focusable).filter(n => !n.disabled && n.getAttribute('aria-hidden') !== 'true');
                    if (nodes.length === 0) return;
                    const idx = nodes.indexOf(document.activeElement);
                    if (e.shiftKey) { if (idx === 0) { e.preventDefault(); nodes[nodes.length - 1].focus(); } }
                    else { if (idx === nodes.length - 1) { e.preventDefault(); nodes[0].focus(); } }
                }
            });
        }
        function closeResetModal() { resetModal.setAttribute('aria-hidden', 'true'); }
        // restore focus on close
        const _origClose = closeResetModal;
        closeResetModal = function () { resetModal.setAttribute('aria-hidden', 'true'); if (resetModal._trap) resetModal.removeEventListener('keydown', resetModal._trap); if (resetModal._previouslyFocused) resetModal._previouslyFocused.focus(); };
        resetModuleBtn.addEventListener('click', () => openResetModal());
        resetCancel.addEventListener('click', () => closeResetModal());
        resetConfirm.addEventListener('click', () => { closeResetModal(); resetModuleQuizzes(); });
        const resetModalClose = document.getElementById('resetModalClose');
        if (resetModalClose) resetModalClose.addEventListener('click', () => closeResetModal());

        // initial
        renderLessons(currentModule); renderBadges(); updateProgressBar(currentModule);
    });
})();

/* === END ENHANCEMENT MODULE === */