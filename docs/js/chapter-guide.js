document.addEventListener("DOMContentLoaded", () => {
  // === INTERACTIVE CHECKLIST SYSTEM ===
  class InteractiveChecklist {
    constructor() {
      this.taskGuides = {
        // Chapter 1 Tasks
        'background-study': {
          title: 'Background of the Study',
          guide: {
            title: 'How to Write Background of the Study',
            steps: [
              'Start with a broad context of your research area',
              'Narrow down to your specific topic',
              'Identify the research gap or problem',
              'Explain why this study is needed',
              'Connect to your research objectives'
            ]
          },
          chapter: 1,
          minWords: 200,
          placeholder: 'Begin with a general overview of your research area and gradually narrow down to your specific topic...'
        },
        'problem-statement': {
          title: 'Statement of the Problem',
          guide: {
            title: 'How to Formulate Problem Statement',
            steps: [
              'Clearly define the main problem or issue',
              'Explain the significance of the problem',
              'Describe who is affected by this problem',
              'Present supporting evidence or statistics',
              'Formulate specific research questions'
            ]
          },
          chapter: 1,
          minWords: 150,
          placeholder: 'State the main problem your research addresses and formulate clear research questions...'
        },
        'significance-study': {
          title: 'Significance of the Study',
          guide: {
            title: 'How to Write Significance of the Study',
            steps: [
              'Explain the importance of your research',
              'Identify who will benefit from your study',
              'Describe practical applications',
              'Discuss theoretical contributions',
              'Highlight potential impact on society or field'
            ]
          },
          chapter: 1,
          minWords: 150,
          placeholder: 'Describe how your research will contribute to knowledge and who will benefit from it...'
        },
        'scope-delimitations': {
          title: 'Scope & Delimitations',
          guide: {
            title: 'How to Define Scope and Delimitations',
            steps: [
              'Define the boundaries of your study',
              'Specify what is included in your research',
              'Clearly state what is excluded and why',
              'Mention geographical, temporal, and conceptual limits',
              'Justify your choices for scope and delimitations'
            ]
          },
          chapter: 1,
          minWords: 100,
          placeholder: 'Clearly state what your study will cover and what it will not include...'
        },
        'definition-terms': {
          title: 'Definition of Terms',
          guide: {
            title: 'How to Define Key Terms',
            steps: [
              'List all technical or specialized terms used',
              'Provide clear, operational definitions',
              'Use credible sources for definitions',
              'Ensure definitions are relevant to your study',
              'Organize terms alphabetically or by importance'
            ]
          },
          chapter: 1,
          minWords: 100,
          placeholder: 'List and define important terms used in your research...'
        },

        // Chapter 2 Tasks
        'theoretical-framework': {
          title: 'Theoretical Framework',
          guide: {
            title: 'How to Develop Theoretical Framework',
            steps: [
              'Identify the main theories relevant to your study',
              'Explain how these theories relate to your research',
              'Show the connection between theory and your variables',
              'Cite key theorists and their contributions',
              'Demonstrate how theory guides your research'
            ]
          },
          chapter: 2,
          minWords: 300,
          placeholder: 'Explain the theories that underpin your research and how they relate to your study...'
        },
        'conceptual-framework': {
          title: 'Conceptual Framework',
          guide: {
            title: 'How to Create Conceptual Framework',
            steps: [
              'Define your key variables and concepts',
              'Show relationships between variables',
              'Create a visual diagram if possible',
              'Explain how concepts interact in your study',
              'Connect conceptual framework to your research questions'
            ]
          },
          chapter: 2,
          minWords: 250,
          placeholder: 'Describe the key concepts and their relationships in your study...'
        },
        'related-literature': {
          title: 'Related Literature',
          guide: {
            title: 'How to Review Related Literature',
            steps: [
              'Search for recent and relevant publications',
              'Organize literature by themes or chronologically',
              'Summarize key findings from each source',
              'Identify gaps in existing literature',
              'Connect literature to your research problem'
            ]
          },
          chapter: 2,
          minWords: 400,
          placeholder: 'Provide a comprehensive review of literature related to your research topic...'
        },
        'related-studies': {
          title: 'Related Studies',
          guide: {
            title: 'How to Review Related Studies',
            steps: [
              'Find empirical studies similar to yours',
              'Compare methodologies used in previous studies',
              'Analyze findings and conclusions',
              'Identify what your study will add to existing knowledge',
              'Discuss limitations of previous studies'
            ]
          },
          chapter: 2,
          minWords: 350,
          placeholder: 'Analyze empirical studies related to your research and explain how your study differs...'
        },

        // Chapter 3 Tasks
        'research-design': {
          title: 'Research Design',
          guide: {
            title: 'How to Write Research Design',
            steps: [
              'State the type of research (e.g., qualitative, quantitative, mixed-methods)',
              'Explain why this design is appropriate for your study',
              'Describe overall procedures and structure of the research',
              'Identify variables/constructs and their roles if applicable',
              'Mention validity/reliability or trustworthiness considerations'
            ]
          },
          chapter: 3,
          minWords: 150,
          placeholder: 'Describe your chosen design and why it fits your research questions...'
        },
        'sampling-method': {
          title: 'Sampling Method',
          guide: {
            title: 'How to Describe Sampling Method',
            steps: [
              'Define your population and sampling frame',
              'Specify the sampling technique (e.g., random, purposive, stratified)',
              'Explain sample size and justification',
              'Describe inclusion/exclusion criteria',
              'Discuss potential biases and how you address them'
            ]
          },
          chapter: 3,
          minWords: 150,
          placeholder: 'Explain who/what you will sample, how many, and why...'
        },
        'research-instrument': {
          title: 'Research Instrument',
          guide: {
            title: 'How to Describe Research Instrument',
            steps: [
              'Name and describe each instrument (questionnaire, interview guide, etc.)',
              'Explain how instruments were developed or sourced',
              'Discuss validity/reliability or pilot testing',
              'Explain scoring/measurement and interpretation',
              'Describe administration procedures'
            ]
          },
          chapter: 3,
          minWords: 150,
          placeholder: 'Describe the tools you will use to collect data and their properties...'
        },
        'data-gathering-procedure': {
          title: 'Data Gathering Procedure',
          guide: {
            title: 'How to Write Data Gathering Procedure',
            steps: [
              'Outline step-by-step how data will be collected',
              'Specify locations, timelines, and personnel',
              'Explain consent and ethical considerations',
              'Describe storage and security of collected data',
              'Mention contingencies for common issues'
            ]
          },
          chapter: 3,
          minWords: 150,
          placeholder: 'Explain exactly how you will collect your data, step by step...'
        },
        'data-analysis': {
          title: 'Data Analysis',
          guide: {
            title: 'How to Write Data Analysis',
            steps: [
              'Describe analytical techniques (e.g., statistical tests, thematic analysis)',
              'Explain software/tools used and why',
              'Detail how data will be cleaned and prepared',
              'Explain how results will be interpreted',
              'Discuss assumptions and limitations'
            ]
          },
          chapter: 3,
          minWords: 150,
          placeholder: 'Describe how you will analyze the collected data and derive results...'
        },

        // Chapter 4 Tasks
        'presentation-of-results': {
          title: 'Presentation of Results',
          guide: {
            title: 'How to Present Results',
            steps: [
              'Summarize key findings clearly (tables/figures where helpful)',
              'Report results aligned with research questions/objectives',
              'Avoid interpretation here (save that for discussion)',
              'Highlight trends, differences, and noteworthy observations',
              'Ensure clarity, accuracy, and proper labeling'
            ]
          },
          chapter: 4,
          minWords: 150,
          placeholder: 'Present your key results clearly with minimal interpretation...'
        },
        'interpretation-of-data': {
          title: 'Interpretation of Data',
          guide: {
            title: 'How to Interpret Data',
            steps: [
              'Explain what the results mean relative to your questions',
              'Discuss implications and significance',
              'Address unexpected findings',
              'Consider alternative explanations',
              'Relate to theory and context'
            ]
          },
          chapter: 4,
          minWords: 150,
          placeholder: 'Interpret the meaning of your results and their implications...'
        },
        'link-to-literature': {
          title: 'Link to Literature',
          guide: {
            title: 'How to Link Results to Literature',
            steps: [
              'Compare your results with prior studies',
              'Explain agreements or contradictions',
              'Show how your results extend existing knowledge',
              'Cite key sources appropriately',
              'Highlight contributions and remaining gaps'
            ]
          },
          chapter: 4,
          minWords: 150,
          placeholder: 'Connect your findings to prior research and theories...'
        },

        // Chapter 5 Tasks
        'summary-of-findings': {
          title: 'Summary of Findings',
          guide: {
            title: 'How to Write Summary of Findings',
            steps: [
              'Summarize the most important results without new data',
              'Link back to research objectives',
              'Be concise and clear',
              'Organize by themes or research questions',
              'Avoid interpretation beyond the results'
            ]
          },
          chapter: 5,
          minWords: 140,
          placeholder: 'Summarize the core findings of your study succinctly...'
        },
        'conclusion': {
          title: 'Conclusion',
          guide: {
            title: 'How to Write Conclusion',
            steps: [
              'State overall conclusions drawn from the findings',
              'Reflect on research objectives and how they were addressed',
              'Discuss broader implications',
              'Note limitations that affect conclusions',
              'Suggest directions for future research'
            ]
          },
          chapter: 5,
          minWords: 140,
          placeholder: 'State the overarching conclusions and their implications...'
        },
        'recommendations': {
          title: 'Recommendations',
          guide: {
            title: 'How to Write Recommendations',
            steps: [
              'Provide actionable recommendations based on findings',
              'Target stakeholders who can act on them',
              'Prioritize and justify recommendations',
              'Discuss feasibility and potential impact',
              'Note risks or considerations'
            ]
          },
          chapter: 5,
          minWords: 140,
          placeholder: 'Provide clear, actionable recommendations grounded in your findings...'
        }
      };

      this.completedTasks = new Set();
      this.activeTask = null;
      this.init();
    }

    init() {
      this.setupEventListeners();
      this.loadProgress();
    }

    setupEventListeners() {
      // Add click listeners to interactive tasks
      document.addEventListener('click', (e) => {
        if (e.target.closest('.interactive-task')) {
          const taskItem = e.target.closest('.interactive-task');
          const taskId = taskItem.dataset.task;
          const chapter = taskItem.dataset.chapter;
          this.openTask(taskId, chapter);
        }

        // Apply same behavior to chapters 3-5: clicking a checklist label opens a generic editor
        if (e.target.classList && e.target.classList.contains('checklist-label')) {
          const labelEl = e.target;
          const li = labelEl.closest('li');
          // Determine chapter from nearby input or parent list id
          let chapter = null;
          const input = li ? li.querySelector('input.task[data-chapter]') : null;
          if (input && input.dataset.chapter) chapter = input.dataset.chapter;
          if (!chapter) {
            const list = labelEl.closest('[id^="tasks-list-"]');
            if (list && list.id) {
              const m = list.id.match(/tasks-list-(\d+)/);
              if (m) chapter = m[1];
            }
          }
          if (!chapter) return;

          const title = labelEl.dataset.task || labelEl.textContent.trim();
          // Try resolve to a predefined task for this chapter by title
          let taskId = this.resolveTaskIdByTitle(title, parseInt(chapter, 10));
          if (!taskId) {
            const slug = this.slugify(title);
            taskId = `custom-ch${chapter}-${slug}`;
            this.ensureCustomTask(taskId, title, parseInt(chapter, 10));
          }
          // Attach mapping to the list item for later UI updates
          if (li) li.dataset.task = taskId;
          this.openTask(taskId, chapter);
        }

        // Close task button
        if (e.target.classList.contains('task-close-btn')) {
          this.closeTask();
        }

        // Handle save draft buttons from task workspace
        if (e.target.classList.contains('save-draft') && e.target.dataset.task) {
          this.saveTaskDraft(e.target);
        }

        // Handle copy buttons from task workspace
        if (e.target.classList.contains('copy-snippet') && e.target.dataset.task) {
          this.copyTaskContent(e.target);
        }

        // Handle export buttons from task workspace
        if (e.target.classList.contains('export-btn') && e.target.dataset.task) {
          this.exportTaskContent(e.target);
        }

        // Handle download buttons from task workspace
        if (e.target.classList.contains('download-txt') && e.target.dataset.task) {
          this.downloadTaskContent(e.target);
        }

        // Handle reset task buttons from task workspace
        if (e.target.classList.contains('reset-task') && e.target.dataset.task) {
          this.resetTask(e.target);
        }
      });

      // Monitor text input for auto-completion
      document.addEventListener('input', (e) => {
        if (e.target.classList.contains('task-input')) {
          this.validateTaskInput(e.target);
        }
      });
    }

    resolveTaskIdByTitle(title, chapter) {
      const norm = (s) => String(s).trim().toLowerCase();
      const nTitle = norm(title);
      for (const [id, def] of Object.entries(this.taskGuides)) {
        if (def.chapter === chapter && norm(def.title) === nTitle) return id;
      }
      // Also try common slug forms
      const slug = this.slugify(title);
      const candidates = [
        slug,
        `ch${chapter}-${slug}`,
        `${slug}-ch${chapter}`,
      ];
      for (const c of candidates) {
        if (this.taskGuides[c] && this.taskGuides[c].chapter === chapter) return c;
      }
      return null;
    }

    // Ensure a generic custom task entry exists for dynamic chapter checklists
    ensureCustomTask(taskId, title, chapter) {
      if (this.taskGuides[taskId]) return;
      this.taskGuides[taskId] = {
        title: title,
        guide: {
          title: `Write: ${title}`,
          steps: [
            'Describe the purpose for this section',
            'Provide key details and methodology/logic as needed',
            'Support with data or citations when relevant',
            'Conclude with a clear takeaway'
          ]
        },
        chapter: chapter,
        minWords: 100,
        placeholder: `Start writing your content for ${title}...`
      };
    }

    // Slugify a label to create a stable id
    slugify(text) {
      return (
        String(text)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 60) || 'item'
      );
    }

    openTask(taskId, chapter) {
      const workspace = document.getElementById(`task-workspace-${chapter}`);
      const taskData = this.taskGuides[taskId];

      if (!workspace || !taskData) return;

      this.activeTask = taskId;
      // Don't mark as In Progress immediately on open; keep 'Click to start' until user types
      this.updateTaskStatus(taskId, this.completedTasks.has(taskId) ? '✓ Completed' : 'Click to start');

      // Create task section
      const taskSection = this.createTaskSection(taskId, taskData);
      workspace.innerHTML = taskSection;
      workspace.style.display = 'block';

      // Simplified single smooth scroll later (avoid multiple competing scrolls that cause stutter)

      // Load saved content if any
      const savedContent = this.loadTaskProgress(taskId);
      const taskInput = workspace.querySelector('.task-input');
      if (savedContent && taskInput) {
        taskInput.value = savedContent;
        this.validateTaskInput(taskInput);
      }

      // Do not show any prompt on click; simply render the editor and wait for user input.

      // Scroll to the specific task section using a single smooth scroll with header offset
      const sectionEl = workspace.querySelector(`.task-section[data-task="${taskId}"]`) || workspace;
      requestAnimationFrame(() => {
        this.scrollIntoViewSmart(sectionEl, 'start');
      });

      // Focus the textarea and center it after a short delay to allow scrolling
      const focusInput = workspace.querySelector('.task-input');
      if (focusInput) {
        setTimeout(() => {
          try {
            focusInput.focus({ preventScroll: true });
            const len = focusInput.value.length;
            focusInput.setSelectionRange(len, len);
          } catch (_) { }
        }, 200);
      }

      // Set active state
      this.setActiveTask(taskId);
    }

    // Smoothly scroll an element into view within its nearest scrollable container
    scrollIntoViewSmart(targetEl, block = 'start') {
      if (!targetEl) return;
      const container = this.getScrollParent(targetEl);
      const isWindow = container === document.scrollingElement || container === document.documentElement || container === document.body;
      const headerOffset = this.getHeaderOffset(container);
      // Help browsers that support scroll-margin-top
      try { targetEl.style.scrollMarginTop = headerOffset ? headerOffset + 'px' : ''; } catch (_) { }

      if (isWindow) {
        const rect = targetEl.getBoundingClientRect();
        const top = rect.top + (window.pageYOffset || document.documentElement.scrollTop) - headerOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      } else {
        // Compute the element's offset relative to the container
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        let top = (targetRect.top - containerRect.top) + container.scrollTop - headerOffset;
        if (block === 'center') {
          top = top - (container.clientHeight / 2) + (targetEl.clientHeight / 2);
        }
        container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }

    // Try to make an element visible with a few retries, useful when layout/animations delay positioning
    ensureVisibleWithRetries(targetEl, block = 'start', retries = 4, delay = 120) {
      if (!targetEl) return;
      const attempt = (left) => {
        // Primary: smart scroll within container or window
        this.scrollIntoViewSmart(targetEl, block);
        // Fallback 1: native scrollIntoView on the element
        try { targetEl.scrollIntoView({ behavior: 'smooth', block: block === 'center' ? 'center' : 'start' }); } catch (_) { }
        // Fallback 2: direct window scroll calculation if still not visible
        try {
          if (!this.isElementVisibleInContainer(targetEl)) {
            const headerOffset = this.getHeaderOffset(document.scrollingElement || document.documentElement);
            const rect = targetEl.getBoundingClientRect();
            const top = rect.top + (window.pageYOffset || document.documentElement.scrollTop) - headerOffset;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          }
        } catch (_) { }
        // Check visibility shortly after scroll
        setTimeout(() => {
          if (left <= 0) return;
          if (!this.isElementVisibleInContainer(targetEl)) {
            attempt(left - 1);
          }
        }, delay);
      };
      attempt(retries);
    }

    // Check if element is visible within its scroll container (or viewport)
    isElementVisibleInContainer(el) {
      const container = this.getScrollParent(el);
      const isWindow = container === document.scrollingElement || container === document.documentElement || container === document.body;
      const rect = el.getBoundingClientRect();
      if (isWindow) {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        return rect.top >= 0 && rect.bottom <= vh;
      } else {
        const crect = container.getBoundingClientRect();
        return rect.top >= crect.top && rect.bottom <= crect.bottom;
      }
    }

    // Find nearest scrollable parent
    getScrollParent(el) {
      let node = el.parentElement;
      while (node && node !== document.body) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        const canScroll = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
        if (canScroll) return node;
        node = node.parentElement;
      }
      return document.scrollingElement || document.documentElement;
    }

    // Determine header offset either globally or within container
    getHeaderOffset(container) {
      // Try container-local header first
      let header = null;
      if (container && container.querySelector) {
        header = container.querySelector('.sticky, .header, .app-header, .topbar');
      }
      if (!header) {
        header = document.querySelector('.app-header, header.sticky, header, .topbar');
      }
      const h = header && header.offsetHeight ? header.offsetHeight : 0;
      return h ? h + 12 : 0; // add a small spacing
    }

    createTaskSection(taskId, taskData) {
      return `
        <div class="task-section active" data-task="${taskId}">
          <h4>${taskData.title}</h4>
          
          <div class="task-guide">
            <h5>${taskData.guide.title}</h5>
            <ul>
              ${taskData.guide.steps.map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>

          <div class="task-input-container">
            <label class="task-input-label">Write your ${taskData.title} (minimum ${taskData.minWords} words):</label>
            <textarea 
              class="task-input" 
              data-task="${taskId}"
              data-chapter="${taskData.chapter}"
              data-min-words="${taskData.minWords}"
              placeholder="${taskData.placeholder}"
              rows="12"
            ></textarea>
            
            <div class="task-validation" id="validation-${taskId}"></div>
            
            <div class="task-progress">
              <span id="progress-text-${taskId}">Word count: 0 / ${taskData.minWords} minimum</span>
              <div class="task-progress-bar">
                <div class="task-progress-fill" id="progress-fill-${taskId}"></div>
              </div>
            </div>
          </div>

          <div class="task-actions">
            <button class="btn-secondary save-draft" data-chapter="${taskData.chapter}" data-task="${taskId}">
              Save Draft
            </button>
            <button class="btn-secondary copy-snippet" data-chapter="${taskData.chapter}" data-task="${taskId}">
              Copy
            </button>
            <button class="btn-secondary export-btn" data-chapter="${taskData.chapter}" data-task="${taskId}">
              Export .doc
            </button>
            <button class="btn-secondary download-txt" data-chapter="${taskData.chapter}" data-task="${taskId}">
              Download .txt
            </button>
            <button class="btn-secondary reset-task" data-chapter="${taskData.chapter}" data-task="${taskId}">
              Reset Task
            </button>
            <button class="task-close-btn">Close Task</button>
          </div>
        </div>
      `;
    }

    validateTaskInput(inputElement) {
      const taskId = inputElement.dataset.task;
      const minWords = parseInt(inputElement.dataset.minWords);
      const text = inputElement.value.trim();
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

      // Update progress
      const progressText = document.getElementById(`progress-text-${taskId}`);
      const progressFill = document.getElementById(`progress-fill-${taskId}`);
      const validation = document.getElementById(`validation-${taskId}`);

      if (progressText) {
        progressText.textContent = `Word count: ${wordCount} / ${minWords} minimum`;
      }

      if (progressFill) {
        const progress = Math.min((wordCount / minWords) * 100, 100);
        progressFill.style.width = `${progress}%`;
      }

      // Validation feedback
      if (validation) {
        validation.className = 'task-validation';

        if (wordCount >= minWords) {
          validation.className += ' success';
          validation.textContent = '✓ Task completed! Well done!';
          this.completeTask(taskId);
        } else if (wordCount > 0) {
          validation.className += ' warning';
          validation.textContent = `${minWords - wordCount} more words needed to complete this task.`;
        } else {
          validation.style.display = 'none';
        }
      }

      // Save progress automatically
      this.saveTaskProgress(taskId, text);

      // Update task status label text: only set In Progress if the user typed something
      const taskElement = document.querySelector(`[data-task="${taskId}"]`) || this.findListItemForTask(taskId);
      if (taskElement) {
        const statusEl = taskElement.querySelector('.task-status');
        if (statusEl) {
          if (wordCount >= minWords) statusEl.textContent = '✓ Completed';
          else if (wordCount > 0) statusEl.textContent = 'In Progress';
          else statusEl.textContent = 'Click to start';
        }
      }
    }

    completeTask(taskId) {
      if (this.completedTasks.has(taskId)) return;

      this.completedTasks.add(taskId);
      this.updateTaskStatus(taskId, '✓ Completed');

      // Update UI - handle both interactive-task style and chapters 3–5 list style
      const taskElement = document.querySelector(`[data-task="${taskId}"]`) || this.findListItemForTask(taskId);
      if (taskElement) {
        taskElement.classList.add('completed');
        const checkboxIcon = taskElement.querySelector('.task-checkbox');
        if (checkboxIcon) checkboxIcon.textContent = '✓';
        const nativeCheckbox = taskElement.querySelector('input.task');
        if (nativeCheckbox) nativeCheckbox.checked = true;
      }

      this.saveProgress();
      this.updateOverallProgress();
      this.updateChapterProgress(this.taskGuides[taskId].chapter);
    }

    updateTaskStatus(taskId, status) {
      const taskElement = document.querySelector(`[data-task="${taskId}"]`);
      if (taskElement) {
        const statusElement = taskElement.querySelector('.task-status');
        if (statusElement) {
          statusElement.textContent = status;
        }
      }
    }

    setActiveTask(taskId) {
      // Remove active class from all tasks
      document.querySelectorAll('.interactive-task').forEach(task => {
        task.classList.remove('active');
      });

      // Add active class to current task
      const currentTask = document.querySelector(`[data-task="${taskId}"]`);
      if (currentTask && !this.completedTasks.has(taskId)) {
        currentTask.classList.add('active');
      }
    }

    closeTask() {
      // Hide all workspaces
      document.querySelectorAll('.task-workspace').forEach(workspace => {
        workspace.style.display = 'none';
      });

      // Remove active class from all tasks
      document.querySelectorAll('.interactive-task').forEach(task => {
        task.classList.remove('active');
      });

      this.activeTask = null;
    }

    updateOverallProgress() {
      const totalTasks = Object.keys(this.taskGuides).length;
      const completedCount = this.completedTasks.size;
      const percentage = Math.round((completedCount / totalTasks) * 100);

      // Update the existing overall progress bar
      const progressFill = document.getElementById('overall-progress-fill');
      const progressText = document.getElementById('overall-progress-text');

      if (progressFill) {
        progressFill.style.width = `${percentage}%`;
      }

      if (progressText) {
        progressText.textContent = `${percentage}%`;
      }
    }

    updateChapterProgress(chapter) {
      // Count completed tasks for this chapter
      const chapterTasks = Object.keys(this.taskGuides).filter(taskId =>
        this.taskGuides[taskId].chapter === chapter
      );
      const completedChapterTasks = chapterTasks.filter(taskId =>
        this.completedTasks.has(taskId)
      );

      const percentage = chapterTasks.length ?
        Math.round((completedChapterTasks.length / chapterTasks.length) * 100) : 0;

      // Update chapter-specific progress bar
      const progressFill = document.getElementById(`progress${chapter}-fill`);
      const progressText = document.getElementById(`progress${chapter}-text`);

      if (progressFill) {
        progressFill.style.width = `${percentage}%`;
      }

      if (progressText) {
        progressText.textContent = `${percentage}% Completed`;
      }
    }

    saveProgress() {
      const progressData = {
        completedTasks: Array.from(this.completedTasks),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('interactive-checklist-progress', JSON.stringify(progressData));
    }

    loadProgress() {
      const saved = localStorage.getItem('interactive-checklist-progress');
      // Reset all checkboxes and completed classes to default (chapters 1–2)
      document.querySelectorAll('.interactive-task, .task-item').forEach(taskElement => {
        taskElement.classList.remove('completed');
        const checkbox = taskElement.querySelector('.task-checkbox');
        if (checkbox) checkbox.textContent = '☐';
        if (taskElement.dataset.task) this.updateTaskStatus(taskElement.dataset.task, 'Click to start');
      });
      // Reset chapters 3–5 list style
      [3, 4, 5].forEach(ch => {
        const list = document.getElementById(`tasks-list-${ch}`);
        if (!list) return;
        list.querySelectorAll('li').forEach(li => {
          li.classList.remove('completed');
          const nativeCheckbox = li.querySelector('input.task');
          if (nativeCheckbox) nativeCheckbox.checked = false;
        });
      });
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.completedTasks = new Set(data.completedTasks || []);
          // Restore checkmarks and completed class for completed tasks (all chapters)
          this.completedTasks.forEach(taskId => {
            const el = document.querySelector(`[data-task="${taskId}"]`) || this.findListItemForTask(taskId);
            if (el) {
              el.classList.add('completed');
              const checkbox = el.querySelector('.task-checkbox');
              if (checkbox) checkbox.textContent = '✓';
              const nativeCheckbox = el.querySelector('input.task');
              if (nativeCheckbox) nativeCheckbox.checked = true;
              this.updateTaskStatus(taskId, '✓ Completed');
            }
          });
        } catch (e) {
          console.error('Failed to load progress:', e);
        }
      }
    }

    findListItemForTask(taskId) {
      const def = this.taskGuides[taskId];
      if (!def) return null;
      const list = document.getElementById(`tasks-list-${def.chapter}`);
      if (!list) return null;
      // Prefer li already bound with dataset.task
      let found = list.querySelector(`li[data-task="${taskId}"]`);
      if (found) return found;
      // Fallback: match by checklist-label title
      const labels = list.querySelectorAll('.checklist-label');
      for (const lbl of labels) {
        const text = (lbl.dataset.task || lbl.textContent || '').trim();
        if (text.toLowerCase() === def.title.toLowerCase()) {
          return lbl.closest('li');
        }
      }
      return null;
    }

    // === Storage helpers for task content ===
    saveTaskProgress(taskId, text) {
      try {
        localStorage.setItem(`task-progress-${taskId}`, text || '');
        localStorage.setItem(`task-progress-updated-${taskId}`, String(Date.now()));
      } catch (_) { }
    }

    loadTaskProgress(taskId) {
      try {
        return localStorage.getItem(`task-progress-${taskId}`) || '';
      } catch (_) {
        return '';
      }
    }

    // === Workspace button handlers ===
    getTaskTextareaByButton(btn) {
      const taskId = btn.dataset.task;
      const chapter = btn.dataset.chapter;
      const workspace = document.getElementById(`task-workspace-${chapter}`);
      if (!workspace) return null;
      return workspace.querySelector(`.task-section[data-task="${taskId}"] textarea.task-input`);
    }

    saveTaskDraft(btn) {
      const ta = this.getTaskTextareaByButton(btn);
      if (!ta) return alert('Editor not found for this task.');
      this.saveTaskProgress(btn.dataset.task, ta.value);
      try {
        btn.disabled = true;
        const old = btn.textContent;
        btn.textContent = 'Saved!';
        setTimeout(() => { btn.disabled = false; btn.textContent = old; }, 900);
      } catch (_) { alert('✅ Draft saved'); }
    }

    copyTaskContent(btn) {
      const ta = this.getTaskTextareaByButton(btn);
      if (!ta) return alert('Editor not found for this task.');
      const text = ta.value || '';
      const doFallback = () => {
        try {
          ta.select();
          document.execCommand('copy');
          alert('📋 Copied to clipboard');
        } catch (_) { alert('Copy failed'); }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          try {
            btn.disabled = true;
            const old = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.disabled = false; btn.textContent = old; }, 900);
          } catch (_) { alert('📋 Copied to clipboard'); }
        }).catch(doFallback);
      } else {
        doFallback();
      }
    }

    exportTaskContent(btn) {
      const ta = this.getTaskTextareaByButton(btn);
      if (!ta) return alert('Editor not found for this task.');
      const taskId = btn.dataset.task;
      const def = this.taskGuides[taskId] || { title: 'Task' };
      const title = def.title || 'Task';
      const content = (ta.value || '').replace(/</g, '&lt;');
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body><h2>${title}</h2><pre style="white-space:pre-wrap;word-break:break-word;">${content}</pre></body></html>`;
      const blob = new Blob([html], { type: 'application/msword' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const safe = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'task';
      a.download = `${safe}.doc`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    downloadTaskContent(btn) {
      const ta = this.getTaskTextareaByButton(btn);
      if (!ta) return alert('Editor not found for this task.');
      const taskId = btn.dataset.task;
      const def = this.taskGuides[taskId] || { title: 'Task' };
      const title = def.title || 'Task';
      const text = ta.value || '';
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const safe = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'task';
      a.download = `${safe}.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    resetTask(btn) {
      const taskId = btn.dataset.task;
      // Confirm before resetting
      const title = this.taskGuides[taskId]?.title || 'this task';
      const ok = confirm(`Are you sure you want to reset your progress for ${title}?`);
      if (!ok) return;
      // Remove from completed set
      this.completedTasks.delete(taskId);
      // Reset UI
      const taskElement = document.querySelector(`[data-task="${taskId}"]`) || this.findListItemForTask(taskId);
      if (taskElement) {
        taskElement.classList.remove('completed');
        const checkbox = taskElement.querySelector('.task-checkbox');
        if (checkbox) checkbox.textContent = '☐';
        const nativeCheckbox = taskElement.querySelector('input.task');
        if (nativeCheckbox) nativeCheckbox.checked = false;
        this.updateTaskStatus(taskId, 'Click to start');
      }
      // Clear input and validation
      const workspace = document.getElementById(`task-workspace-${btn.dataset.chapter}`);
      if (workspace) {
        const input = workspace.querySelector('.task-input');
        if (input) input.value = '';
        const validation = workspace.querySelector('.task-validation');
        if (validation) {
          validation.className = 'task-validation';
          validation.textContent = '';
        }
        const progressText = workspace.querySelector(`#progress-text-${taskId}`);
        if (progressText) progressText.textContent = `Word count: 0 / ${this.taskGuides[taskId].minWords} minimum`;
        const progressFill = workspace.querySelector(`#progress-fill-${taskId}`);
        if (progressFill) progressFill.style.width = '0%';
      }
      // Remove saved draft
      localStorage.removeItem(`task-progress-${taskId}`);
      this.saveProgress();
      this.updateOverallProgress();
      this.updateChapterProgress(this.taskGuides[taskId].chapter);
    }
  }

  // Initialize Interactive Checklist
  const interactiveChecklist = new InteractiveChecklist();
  // Expose globally so other handlers can always access it
  try { window.interactiveChecklist = interactiveChecklist; } catch (_) { }

  // === TAB SWITCHING ===
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.add("hidden"));
      btn.classList.add("active");
      document.getElementById(target).classList.remove("hidden");
    });
  });

  // === NOTES ===
  document.querySelectorAll(".notes-input").forEach((area) => {
    const ch = area.id.split("-")[1];
    area.value = localStorage.getItem(`notes-${ch}`) || "";
  });

  document.querySelectorAll(".save-notes").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const ch = e.target.dataset.chapter;
      const val = document.getElementById(`notes-${ch}`).value;
      localStorage.setItem(`notes-${ch}`, val);
      alert(`📝 Notes saved for Chapter ${ch}`);
    });
  });

  document.querySelectorAll(".clear-notes").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const ch = e.target.dataset.chapter;
      document.getElementById(`notes-${ch}`).value = "";
      localStorage.removeItem(`notes-${ch}`);
    });
  });

  // === TIMER ===
  (function setupGlobalTimer() {
    if (window.__globalTimerInitialized) return; // guard against double init
    window.__globalTimerInitialized = true;
    const display = document.getElementById("global-timer-display");
    const startBtn = document.getElementById("global-start");
    const pauseBtn = document.getElementById("global-pause");
    const resetBtn = document.getElementById("global-reset");
    const modeElapsed = document.getElementById("modeElapsed");
    const modeCountdown = document.getElementById("modeCountdown");
    const label = document.getElementById("global-timer-label");
    const timerBox = document.getElementById("global-timer");
    const minimizeBtn = document.getElementById("timerMinimizeToggle");
    const headerEl = timerBox ? timerBox.querySelector('.timer-header') : null;
    // Create a mini display inside header (visible only when minimized)
    let miniDisplay = null;
    if (headerEl) {
      miniDisplay = headerEl.querySelector('#global-timer-mini');
      if (!miniDisplay) {
        miniDisplay = document.createElement('span');
        miniDisplay.id = 'global-timer-mini';
        miniDisplay.className = 'timer-mini';
        miniDisplay.style.marginLeft = '8px';
        miniDisplay.style.fontVariantNumeric = 'tabular-nums';
        miniDisplay.style.display = 'none';
        headerEl.appendChild(miniDisplay);
      }
    }

    let interval = null;
    let totalSeconds = 0;
    let initialCountdownSeconds = 0; // stores the originally set countdown seconds to restore on reset
    let mode = "elapsed";
    let isRunning = false;

    // Countdown modal elements
    const countdownModal = document.getElementById('countdownModal');
    const confirmCountdown = document.getElementById('confirmCountdown');
    const cancelCountdown = document.getElementById('cancelCountdown');
    const closeCountdownModal = document.getElementById('closeCountdownModal');
    const countdownMinutesInput = document.getElementById('countdownMinutes');
    const countdownDialog = countdownModal ? countdownModal.querySelector('.modal-content') : null;

    // Time Up modal elements
    const timeUpModal = document.getElementById('timeUpModal');
    const closeTimeUpModal = document.getElementById('closeTimeUpModal');
    const dismissTimeUp = document.getElementById('dismissTimeUp');
    const restartCountdownBtn = document.getElementById('restartCountdown');

    function showTimeUpModal(show) {
      if (!timeUpModal) return;
      timeUpModal.style.display = show ? 'flex' : 'none';
      try { document.body.classList.toggle('modal-open', !!show); } catch (_) { }
      if (show) {
        // focus the close button for accessibility
        setTimeout(() => {
          try {
            const focusEl = document.getElementById('dismissTimeUp') || closeTimeUpModal;
            focusEl && focusEl.focus();
          } catch (_) { }
        }, 0);
      }
    }

    function showCountdownModal(show) {
      if (!countdownModal) return;
      countdownModal.style.display = show ? 'flex' : 'none';
      try { document.body.classList.toggle('modal-open', !!show); } catch (_) { }
      if (show) {
        // Prefill with last value or 25
        try {
          const last = localStorage.getItem('lastCountdownMinutes');
          if (countdownMinutesInput) countdownMinutesInput.value = last && !isNaN(parseInt(last, 10)) ? last : '25';
        } catch (_) {
          if (countdownMinutesInput) countdownMinutesInput.value = '25';
        }
        // Center the dialog on open
        if (countdownDialog) {
          countdownDialog.style.left = '';
          countdownDialog.style.top = '';
          countdownDialog.style.transform = '';
          countdownDialog.dataset.dragX = '0';
          countdownDialog.dataset.dragY = '0';
        }
        setTimeout(() => { try { countdownMinutesInput && countdownMinutesInput.focus(); countdownMinutesInput.select(); } catch (_) { } }, 0);
      }
    }

    function render() {
      const sign = totalSeconds < 0 ? "-" : "";
      const t = Math.max(0, Math.abs(totalSeconds));
      const h = Math.floor(t / 3600);
      const m = Math.floor((t % 3600) / 60);
      const s = t % 60;
      const text = `${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      if (display) display.textContent = text;
      if (miniDisplay) miniDisplay.textContent = text;
    }

    function tick() {
      if (mode === "elapsed") totalSeconds++;
      else totalSeconds = Math.max(0, totalSeconds - 1);
      render();
      if (mode === "countdown" && totalSeconds === 0) {
        stop();
        // Small delay to ensure UI updates before showing modal
        setTimeout(() => showTimeUpModal(true), 100);
      }
    }

    function start() {
      if (interval) return;
      interval = setInterval(tick, 1000);
      isRunning = true;
      updateButtonStates();
    }

    function stop() {
      if (interval) clearInterval(interval);
      interval = null;
      isRunning = false;
      updateButtonStates();
    }

    function reset() {
      // Always stop the timer first
      stop();
      if (mode === "elapsed") {
        // Reset elapsed timer to 0
        totalSeconds = 0;
      } else if (mode === "countdown") {
        // Reset countdown back to the initially set value
        totalSeconds = Math.max(0, initialCountdownSeconds || totalSeconds);
      }
      render();
    }

    function updateButtonStates() {
      if (!startBtn || !pauseBtn) return;
      startBtn.disabled = isRunning;
      pauseBtn.disabled = !isRunning;
    }

    if (startBtn) startBtn.addEventListener("click", start);
    if (pauseBtn) pauseBtn.addEventListener("click", stop);
    if (resetBtn) resetBtn.addEventListener("click", reset);

    if (modeElapsed) modeElapsed.addEventListener("click", () => {
      mode = "elapsed";
      modeElapsed.classList.add("active");
      if (modeCountdown) modeCountdown.classList.remove("active");
      if (label) label.textContent = "Elapsed";
      stop();
      totalSeconds = 0;
      render();
    });

    if (modeCountdown) modeCountdown.addEventListener("click", () => {
      showCountdownModal(true);
    });

    function applyCountdownMinutes(m) {
      mode = 'countdown';
      if (modeElapsed) modeElapsed.classList.remove('active');
      if (modeCountdown) modeCountdown.classList.add('active');
      if (label) label.textContent = 'Countdown';
      stop();
      initialCountdownSeconds = Math.max(0, Math.floor(m * 60));
      totalSeconds = initialCountdownSeconds;
      render();
      // auto-start countdown
      start();
    }

    if (confirmCountdown) confirmCountdown.addEventListener('click', () => {
      if (!countdownMinutesInput) return showCountdownModal(false);
      const m = parseInt(countdownMinutesInput.value, 10);
      if (isNaN(m) || m <= 0) {
        try { countdownMinutesInput.focus(); countdownMinutesInput.select(); } catch (_) { }
        return;
      }
      try { localStorage.setItem('lastCountdownMinutes', String(m)); } catch (_) { }
      showCountdownModal(false);
      applyCountdownMinutes(m);
    });
    if (cancelCountdown) cancelCountdown.addEventListener('click', () => showCountdownModal(false));
    if (closeCountdownModal) closeCountdownModal.addEventListener('click', () => showCountdownModal(false));
    if (countdownModal) countdownModal.addEventListener('click', (e) => {
      if (e.target === countdownModal) showCountdownModal(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && countdownModal && countdownModal.style.display !== 'none') {
        showCountdownModal(false);
      }
    });

    // Time Up modal wiring
    if (closeTimeUpModal) closeTimeUpModal.addEventListener('click', () => showTimeUpModal(false));
    if (dismissTimeUp) dismissTimeUp.addEventListener('click', () => showTimeUpModal(false));
    if (timeUpModal) timeUpModal.addEventListener('click', (e) => {
      if (e.target === timeUpModal) showTimeUpModal(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && timeUpModal && timeUpModal.style.display !== 'none') {
        showTimeUpModal(false);
      }
    });
    if (restartCountdownBtn) restartCountdownBtn.addEventListener('click', () => {
      showTimeUpModal(false);
      // If we had an initial countdown set, restart from that
      if (initialCountdownSeconds > 0) {
        totalSeconds = initialCountdownSeconds;
        render();
        start();
      } else {
        // If no initial value (should not happen in normal flow), open setup
        showCountdownModal(true);
      }
    });

    // Draggable countdown modal
    (function setupDraggableCountdown() {
      if (!countdownModal || !countdownDialog) return;
      let dragging = false;
      let startX = 0, startY = 0;
      let origX = 0, origY = 0;

      function onMouseDown(e) {
        // Only start drag if click is on the header area (title or close region)
        const inHeader = e.target.closest('#countdownTitle, .close-modal');
        if (!inHeader) return;
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = parseFloat(countdownDialog.dataset.dragX || '0');
        origY = parseFloat(countdownDialog.dataset.dragY || '0');
        countdownDialog.style.transition = 'none';
        e.preventDefault();
      }

      function onMouseMove(e) {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const nx = origX + dx;
        const ny = origY + dy;
        countdownDialog.style.transform = `translate(${nx}px, ${ny}px)`;
      }

      function onMouseUp() {
        if (!dragging) return;
        // Persist last offsets
        const m = countdownDialog.style.transform.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
        if (m) {
          countdownDialog.dataset.dragX = m[1];
          countdownDialog.dataset.dragY = m[2];
        }
        dragging = false;
        countdownDialog.style.transition = '';
      }

      countdownDialog.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    })();

    // Draggable functionality (mouse + touch)
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
    function dragStart(clientX, clientY, evt) {
      if (!timerBox) return;
      isDragging = true;
      dragOffsetX = clientX - timerBox.getBoundingClientRect().left;
      dragOffsetY = clientY - timerBox.getBoundingClientRect().top;
      timerBox.style.transition = "none";
      document.body.style.userSelect = "none";
      // On small screens, mark as custom positioned so CSS doesn't force centering
      try { if (window.matchMedia('(max-width: 600px)').matches) timerBox.classList.add('custom-pos'); } catch (_) { }
      if (evt) evt.preventDefault();
    }
    function dragMove(clientX, clientY) {
      if (!isDragging || !timerBox) return;
      let x = clientX - dragOffsetX;
      let y = clientY - dragOffsetY;
      x = Math.max(0, Math.min(window.innerWidth - timerBox.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - timerBox.offsetHeight, y));
      timerBox.style.left = x + "px";
      timerBox.style.top = y + "px";
      timerBox.style.right = "auto";
      // Remove mobile centering transform if present
      try { timerBox.style.transform = ""; } catch (_) { }
    }
    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      if (timerBox) timerBox.style.transition = "box-shadow 0.2s";
      document.body.style.userSelect = "";
    }
    if (timerBox) timerBox.addEventListener("mousedown", function (e) {
      if (e.target.closest("button")) return;
      dragStart(e.clientX, e.clientY, e);
    });

    document.addEventListener("mousemove", function (e) { dragMove(e.clientX, e.clientY); });

    document.addEventListener("mouseup", function () { dragEnd(); });

    // Touch support
    if (timerBox) timerBox.addEventListener("touchstart", function (e) {
      if (e.target.closest("button")) return;
      const t = e.touches[0];
      dragStart(t.clientX, t.clientY, e);
    }, { passive: false });
    document.addEventListener("touchmove", function (e) {
      const t = e.touches[0];
      dragMove(t.clientX, t.clientY);
    }, { passive: false });
    document.addEventListener("touchend", function () { dragEnd(); }, { passive: false });

    // Minimize/Expand behavior
    (function fixTimerMinimize() {
      const timerBox = document.getElementById("global-timer");
      const minimizeBtn = document.getElementById("timerMinimizeToggle");
      if (!timerBox || !minimizeBtn) return;
      if (minimizeBtn.dataset.bound === '1') return; // prevent duplicate binding

      function showMinimized(min) {
        timerBox.classList.toggle('minimized', !!min);
        minimizeBtn.setAttribute('aria-label', min ? 'Expand timer' : 'Minimize timer');
        minimizeBtn.textContent = min ? '+' : '–';
        const header = timerBox.querySelector('.timer-header');
        const body = timerBox.querySelector('.timer-body');
        if (header) header.style.display = '';
        if (body) body.style.display = min ? 'none' : '';
        if (miniDisplay) miniDisplay.style.display = min ? '' : 'none';
      }

      function applyMinimizedState(min) {
        showMinimized(min);
        try { localStorage.setItem('globalTimerMinimized', min ? '1' : '0'); } catch (e) { }
      }

      minimizeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const min = !timerBox.classList.contains('minimized');
        applyMinimizedState(min);
        // Recenter when expanding on mobile so it doesn't remain off-screen
        try {
          if (!min && window.matchMedia('(max-width: 600px)').matches) {
            timerBox.style.left = '';
            timerBox.style.right = '';
            timerBox.style.transform = '';
            timerBox.classList.remove('custom-pos');
          }
        } catch (_) { }
      });
      minimizeBtn.dataset.bound = '1';

      // Restore state on load (default expanded)
      let min = false;
      try { min = localStorage.getItem('globalTimerMinimized') === '1'; } catch (e) { min = false; }
      showMinimized(min);
    })();

    render();
    updateButtonStates();
  })();

  // === CITATIONS ===
  document.querySelectorAll('.add-citation').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ch = e.target.dataset.chapter;
      const input = document.getElementById(`citation-input-${ch}`);
      const val = input.value.trim();
      if (!val) return;
      const list = document.getElementById(`citation-list-${ch}`);
      const li = document.createElement('li');
      li.innerHTML = `${val} <button class=\"btn-small remove-citation\">Remove</button>`;
      list.appendChild(li);
      li.querySelector('.remove-citation').addEventListener('click', () => li.remove());
      input.value = '';
    });
  });

  // Mobile nav toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".responsive-nav");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }

  // === PLUS/MINIMIZE BUTTON (already handled in timer code above) ===
  // No change needed unless you want a different icon or behavior.

  // Unified button event delegation for reliability
  function getChecklist() {
    try { return window.interactiveChecklist || interactiveChecklist; } catch (_) { return window.interactiveChecklist; }
  }

  function exportAll() {
    const checklist = getChecklist();
    if (!checklist) return alert('Checklist system not found. Please reload the page.');
    let content = "# All Chapters Export\n\n";
    for (let i = 1; i <= 5; i++) {
      content += `Chapter ${i}\n\n`;
      const chapterTasks = Object.keys(checklist.taskGuides).filter(taskId => String(checklist.taskGuides[taskId].chapter) === String(i));
      if (!chapterTasks.length) content += `[No tasks found]\n\n`;
      let wroteAny = false;
      chapterTasks.forEach(taskId => {
        const taskContent = checklist.loadTaskProgress(taskId);
        if (taskContent && taskContent.trim()) {
          wroteAny = true;
          content += `${checklist.taskGuides[taskId].title}\n\n${taskContent}\n\n`;
        }
      });
      if (!wroteAny) content += `[No content written yet]\n\n`;
      content += `-------------------------\n\n`;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'AllChapters.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function exportCitationsAll() {
    let content = 'Citations by Chapter\n\n';
    for (let i = 1; i <= 5; i++) {
      content += `Chapter ${i}\n`;
      const list = document.getElementById(`citation-list-${i}`);
      if (list) {
        const items = Array.from(list.querySelectorAll('li')).map(li => li.textContent.replace(/Remove$/, '').trim());
        if (items.length) content += items.join('\n') + '\n';
      }
      content += '-------------------------\n';
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Citations.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function exportChapter(ch) {
    const checklist = getChecklist();
    if (!checklist) return alert('Checklist system not found. Please reload the page.');
    let content = `Chapter ${ch}\n\n`;
    const chapterTasks = Object.keys(checklist.taskGuides).filter(taskId => String(checklist.taskGuides[taskId].chapter) === String(ch));
    chapterTasks.forEach(taskId => {
      const taskContent = checklist.loadTaskProgress(taskId);
      if (taskContent && taskContent.trim()) {
        content += `${checklist.taskGuides[taskId].title}\n\n${taskContent}\n\n`;
      }
    });
    content += '-------------------------\n';
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Chapter${ch}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function exportChapterCitations(ch, btn) {
    // Try to infer chapter if not provided
    if (!ch) {
      const container = btn.closest('.citations');
      const listEl = container ? container.querySelector('[id^="citation-list-"]') : null;
      if (listEl) ch = (listEl.id.match(/citation-list-(\d+)/) || [])[1];
    }
    if (!ch) return alert('Could not determine chapter for citations.');
    let content = `Citations for Chapter ${ch}\n\n`;
    const list = document.getElementById(`citation-list-${ch}`);
    if (list) {
      const items = Array.from(list.querySelectorAll('li')).map(li => li.textContent.replace(/Remove$/, '').trim());
      if (items.length) content += items.join('\n') + '\n';
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Citations-Chapter${ch}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function printChapter(ch) {
    const checklist = getChecklist();
    if (!checklist) return alert('Checklist system not found. Please reload the page.');
    let content = `<h2>Chapter ${ch}</h2>`;
    const chapterTasks = Object.keys(checklist.taskGuides).filter(taskId => String(checklist.taskGuides[taskId].chapter) === String(ch));
    if (!chapterTasks.length) content += `<p><em>No tasks found for this chapter.</em></p>`;
    let wroteAny = false;
    chapterTasks.forEach(taskId => {
      const taskContent = checklist.loadTaskProgress(taskId);
      if (taskContent && taskContent.trim()) {
        wroteAny = true;
        content += `<h3>${checklist.taskGuides[taskId].title}</h3><pre>${taskContent.replace(/</g, '&lt;')}</pre>`;
      }
    });
    if (!wroteAny) content += `<p><em>No content written yet.</em></p>`;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Print Chapter ${ch}</title><style>body{font-family:sans-serif;}pre{white-space:pre-wrap;word-break:break-word;}</style></head><body>${content}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }


  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#exportAllBtn, #exportCitationsBtn, .export-chapter, .export-chapter-citations, .print-chapter');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if (btn.id === 'exportAllBtn') return exportAll();
    if (btn.id === 'exportCitationsBtn') return exportCitationsAll();
    if (btn.classList.contains('export-chapter')) return exportChapter(btn.dataset.chapter);
    if (btn.classList.contains('export-chapter-citations')) return exportChapterCitations(btn.dataset.chapter, btn);
    if (btn.classList.contains('print-chapter')) return printChapter(btn.dataset.chapter);
  });

  // === RESET ALL PROGRESS BUTTON ===
  const resetAllBtn = document.getElementById("resetAllBtn");
  const resetAllModal = document.getElementById("resetAllModal");
  const confirmResetAll = document.getElementById("confirmResetAll");
  const cancelResetAll = document.getElementById("cancelResetAll");
  const closeResetAllModal = document.getElementById("closeResetAllModal");

  function showResetModal(show) {
    if (!resetAllModal) return;
    resetAllModal.style.display = show ? "flex" : "none";
    try {
      document.body.classList.toggle('modal-open', !!show);
    } catch (_) { }
    if (show) {
      // Focus the confirm for quick keyboard access
      setTimeout(() => { try { confirmResetAll && confirmResetAll.focus(); } catch (_) { } }, 0);
    }
  }

  if (resetAllBtn) resetAllBtn.addEventListener("click", () => {
    // Open the custom modal instead of native confirm
    showResetModal(true);
  });

  if (cancelResetAll) cancelResetAll.addEventListener("click", () => showResetModal(false));
  if (closeResetAllModal) closeResetAllModal.addEventListener("click", () => showResetModal(false));
  // Close if clicking outside the dialog content
  if (resetAllModal) resetAllModal.addEventListener("click", (e) => {
    if (e.target === resetAllModal) showResetModal(false);
  });
  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resetAllModal && resetAllModal.style.display !== 'none') {
      showResetModal(false);
    }
  });
  if (confirmResetAll) confirmResetAll.addEventListener("click", () => {
    try { localStorage.clear(); } catch (e) { }
    showResetModal(false);
    location.reload();
  });
});
