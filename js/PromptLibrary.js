import { STORAGE_KEYS, THEMES, ICONS, TRANSLATION_KEYS } from "./constants.js";
import { translations } from "./translations.js";

export class PromptLibrary {
  constructor() {
    this.prompts = [];
    this.currentLang = "en";
    this.searchQuery = "";
    this.autoSaveTimers = {};
    this.editingPromptId = null;
    this.init();
  }

  init() {
    this.loadPrompts();
    this.loadTheme();
    this.loadLanguage();
    this.setupEventListeners();
    this.renderPrompts();
  }

  setupEventListeners() {
    const form = document.getElementById("promptForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addPrompt();
    });

    const themeToggle = document.getElementById("themeToggle");
    themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });

    const languageSelector = document.getElementById("languageSelector");
    languageSelector.addEventListener("change", (e) => {
      this.changeLanguage(e.target.value);
    });

    const exportButton = document.getElementById("exportButton");
    exportButton.addEventListener("click", () => {
      this.exportPrompts();
    });

    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderPrompts();
    });
  }

  // Language methods
  loadLanguage() {
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "en";
    this.currentLang = savedLang;
    const langSelector = document.getElementById("languageSelector");
    langSelector.value = savedLang;
    document.documentElement.setAttribute("lang", savedLang);
    this.updateLanguage();
  }

  changeLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    document.documentElement.setAttribute("lang", lang);
    this.updateLanguage();
    this.renderPrompts();
  }

  updateLanguage() {
    const t = translations[this.currentLang];

    // Update page title
    if (t[TRANSLATION_KEYS.PAGE_TITLE]) {
      document.getElementById("pageTitle").textContent =
        t[TRANSLATION_KEYS.PAGE_TITLE];
    }

    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (t[key]) {
        element.textContent = t[key];
      }
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      if (t[key]) {
        element.placeholder = t[key];
      }
    });

    // Update aria-label attributes
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const key = element.getAttribute("data-i18n-aria");
      if (t[key]) {
        element.setAttribute("aria-label", t[key]);
      }
    });
  }

  t(key) {
    return translations[this.currentLang][key] || key;
  }

  // Theme methods
  loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT;
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    this.updateThemeIcon(newTheme);

    // Update aria-pressed for accessibility
    const themeToggle = document.getElementById("themeToggle");
    themeToggle.setAttribute("aria-pressed", newTheme === THEMES.DARK);
  }

  updateThemeIcon(theme) {
    const themeIcon = document.querySelector(".theme-icon");
    const themeToggle = document.getElementById("themeToggle");
    themeIcon.textContent = theme === THEMES.LIGHT ? ICONS.MOON : ICONS.SUN;
    themeToggle.setAttribute("aria-pressed", theme === THEMES.DARK);
  }

  // Storage methods
  loadPrompts() {
    const stored = localStorage.getItem(STORAGE_KEYS.PROMPTS);
    if (stored) {
      try {
        this.prompts = JSON.parse(stored);
      } catch (error) {
        console.error("Error loading prompts:", error);
        this.prompts = this.getDefaultPrompts();
      }
    } else {
      // Load default prompts if nothing is stored
      this.prompts = this.getDefaultPrompts();
      this.savePrompts();
    }
  }

  getDefaultPrompts() {
    const prompt1Content = `Review the following code for:
- Bugs and errors
- Performance issues  
- Security vulnerabilities
- Code style and best practices

Provide specific, actionable feedback with examples.`;

    const prompt2Content = `Write a professional email with:
- Purpose: [your purpose]
- Tone: [formal/friendly]
- Key points: [main points]
- Call to action: [desired action]

Keep it concise, clear, and professional.`;

    const prompt3Content = `Create a bug report with:

Summary:
[Brief description]

Steps to Reproduce:
1. [First step]
2. [Second step]

Expected: [What should happen]
Actual: [What happens]

Environment: [Browser/OS/Device]
Priority: [Critical/High/Medium/Low]`;

    const prompt4Content = `Create an engaging post for *[platform]* about:
- Topic: [your topic]
- Audience: [target audience]
- Tone: [professional/casual/humorous]
- Include: [hashtags/emojis/CTA]

Start with a hook and encourage engagement.`;

    const prompt5Content = `Summarize meeting notes with:

Overview:
- Date & Attendees: [list]
- Main topics: [summary]

Key Decisions:
- [Decision 1]
- [Decision 2]

Action Items:
- [Task] - Assigned: [Person] - Due: [Date]

Focus on *decisions* and *next steps*.`;

    const createdAt1 = new Date(
      Date.now() - 4 * 24 * 60 * 60 * 1000
    ).toISOString();
    const createdAt2 = new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString();
    const createdAt3 = new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ).toISOString();
    const createdAt4 = new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000
    ).toISOString();
    const createdAt5 = new Date().toISOString();

    return [
      {
        id: Date.now() + 1,
        title: "Code Review Assistant",
        content: prompt1Content,
        createdAt: createdAt1,
        rating: 5,
        note: "Works best with small to medium code snippets.",
        metadata: {
          model: "GPT-4",
          createdAt: createdAt1,
          updatedAt: createdAt1,
          tokenEstimate: this.estimateTokens(prompt1Content, true),
        },
      },
      {
        id: Date.now() + 2,
        title: "Professional Email Writer",
        content: prompt2Content,
        createdAt: createdAt2,
        rating: 4,
        metadata: {
          model: "Claude 3.5 Sonnet",
          createdAt: createdAt2,
          updatedAt: createdAt2,
          tokenEstimate: this.estimateTokens(prompt2Content, false),
        },
      },
      {
        id: Date.now() + 3,
        title: "Bug Report Generator",
        content: prompt3Content,
        createdAt: createdAt3,
        rating: 5,
        note: "Include console errors and screenshots.",
        metadata: {
          model: "GPT-4 Turbo",
          createdAt: createdAt3,
          updatedAt: createdAt3,
          tokenEstimate: this.estimateTokens(prompt3Content, false),
        },
      },
      {
        id: Date.now() + 4,
        title: "Social Media Post Generator",
        content: prompt4Content,
        createdAt: createdAt4,
        rating: 4,
        note: "Adapt tone by platform.",
        metadata: {
          model: "Claude 3 Opus",
          createdAt: createdAt4,
          updatedAt: createdAt4,
          tokenEstimate: this.estimateTokens(prompt4Content, false),
        },
      },
      {
        id: Date.now() + 5,
        title: "Meeting Notes Summarizer",
        content: prompt5Content,
        createdAt: createdAt5,
        rating: 5,
        note: "Great for standups and team meetings.",
        metadata: {
          model: "GPT-4o",
          createdAt: createdAt5,
          updatedAt: createdAt5,
          tokenEstimate: this.estimateTokens(prompt5Content, false),
        },
      },
    ];
  }

  savePrompts() {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(this.prompts));
  }

  // Prompt CRUD methods
  addPrompt() {
    const titleInput = document.getElementById("promptTitle");
    const contentInput = document.getElementById("promptContent");
    const modelInput = document.getElementById("promptModel");

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const model = modelInput.value.trim();

    if (!title || !content) {
      this.showToast(this.t(TRANSLATION_KEYS.FILL_ALL_FIELDS), "error");
      return;
    }

    try {
      // Check if we're editing an existing prompt
      if (this.editingPromptId !== null) {
        this.updatePrompt(this.editingPromptId, title, content, model);
        return;
      }

      // Create new prompt
      const metadata = model ? this.trackModel(model, content) : null;

      const prompt = {
        id: Date.now(),
        title: title,
        content: content,
        createdAt: new Date().toISOString(),
        rating: 0,
        metadata: metadata,
      };

      this.prompts.unshift(prompt);
      this.savePrompts();
      this.renderPrompts();

      // Clear form
      titleInput.value = "";
      contentInput.value = "";
      modelInput.value = "";
      titleInput.focus();

      this.showToast(this.t(TRANSLATION_KEYS.PROMPT_SAVED), "success");
    } catch (error) {
      this.showToast(error.message, "error");
    }
  }

  editPrompt(id) {
    const prompt = this.prompts.find((p) => p.id === id);
    if (!prompt) return;

    // Set editing mode
    this.editingPromptId = id;

    // Populate form
    const titleInput = document.getElementById("promptTitle");
    const contentInput = document.getElementById("promptContent");
    const modelInput = document.getElementById("promptModel");
    const submitButton = document.querySelector(".btn-primary");
    const formHeading = document.getElementById("addPromptHeading");

    titleInput.value = prompt.title;
    contentInput.value = prompt.content;
    modelInput.value = prompt.metadata ? prompt.metadata.model : "";

    // Update UI to show edit mode
    submitButton.textContent = this.t(TRANSLATION_KEYS.UPDATE_PROMPT);
    formHeading.textContent = this.t(TRANSLATION_KEYS.EDIT_PROMPT);

    // Add cancel button if it doesn't exist
    if (!document.getElementById("cancelEditButton")) {
      const cancelButton = document.createElement("button");
      cancelButton.id = "cancelEditButton";
      cancelButton.type = "button";
      cancelButton.className = "btn-cancel";
      cancelButton.textContent = this.t(TRANSLATION_KEYS.CANCEL);
      cancelButton.onclick = () => this.cancelEdit();
      submitButton.parentElement.appendChild(cancelButton);
    }

    // Scroll to form
    titleInput.scrollIntoView({ behavior: "smooth", block: "center" });
    titleInput.focus();
  }

  updatePrompt(id, title, content, model) {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return;

    const prompt = this.prompts[index];

    try {
      // Update basic fields
      prompt.title = title;
      prompt.content = content;

      // Update or create metadata
      if (model) {
        const isCode = content.includes("```") || content.includes("function");
        const tokenEstimate = this.estimateTokens(content, isCode);

        if (prompt.metadata) {
          // Update existing metadata
          prompt.metadata = this.updateTimestamps({
            ...prompt.metadata,
            model: model,
            tokenEstimate: tokenEstimate,
          });
        } else {
          // Create new metadata
          prompt.metadata = this.trackModel(model, content);
        }
      } else if (prompt.metadata) {
        // If model is removed, update timestamps only
        const isCode = content.includes("```") || content.includes("function");
        const tokenEstimate = this.estimateTokens(content, isCode);
        prompt.metadata = this.updateTimestamps({
          ...prompt.metadata,
          tokenEstimate: tokenEstimate,
        });
      }

      this.savePrompts();
      this.renderPrompts();
      this.cancelEdit();

      this.showToast(this.t(TRANSLATION_KEYS.PROMPT_UPDATED), "success");
    } catch (error) {
      this.showToast(error.message, "error");
    }
  }

  cancelEdit() {
    this.editingPromptId = null;

    // Clear form
    const titleInput = document.getElementById("promptTitle");
    const contentInput = document.getElementById("promptContent");
    const modelInput = document.getElementById("promptModel");
    const submitButton = document.querySelector(".btn-primary");
    const formHeading = document.getElementById("addPromptHeading");

    titleInput.value = "";
    contentInput.value = "";
    modelInput.value = "";

    // Reset UI
    submitButton.textContent = this.t(TRANSLATION_KEYS.SAVE_BUTTON);
    formHeading.textContent = this.t(TRANSLATION_KEYS.ADD_NEW_PROMPT);

    // Remove cancel button
    const cancelButton = document.getElementById("cancelEditButton");
    if (cancelButton) {
      cancelButton.remove();
    }

    titleInput.focus();
  }

  deletePrompt(id) {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index !== -1) {
      if (confirm(this.t(TRANSLATION_KEYS.DELETE_CONFIRM))) {
        this.prompts.splice(index, 1);
        this.savePrompts();
        this.renderPrompts();
        this.showToast(this.t(TRANSLATION_KEYS.PROMPT_DELETED), "success");
      }
    }
  }

  copyPrompt(content) {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        this.showToast(this.t(TRANSLATION_KEYS.PROMPT_COPIED), "success");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        this.showToast(this.t(TRANSLATION_KEYS.COPY_FAILED), "error");
      });
  }

  setRating(promptId, rating) {
    const prompt = this.prompts.find((p) => p.id === promptId);
    if (prompt) {
      prompt.rating = rating;
      this.savePrompts();

      // Update only the specific rating UI without re-rendering everything
      const card = document.querySelector(
        `.prompt-card[data-id="${promptId}"]`
      );
      if (card) {
        const ratingContainer = card.querySelector(".rating-container");
        if (ratingContainer) {
          ratingContainer.innerHTML = `
            <div class="rating-stars">
              ${Array.from({ length: 5 }, (_, i) => {
                const starNum = i + 1;
                const filled = starNum <= rating;
                const starClass = filled ? "star-filled" : "star-empty";
                const ariaLabel = this.t(TRANSLATION_KEYS.RATE_STARS).replace(
                  "{0}",
                  starNum.toString()
                );
                return `
                  <button
                    class="star ${starClass}"
                    data-rating="${starNum}"
                    onclick="promptLibrary.setRating(${promptId}, ${starNum})"
                    aria-label="${ariaLabel}"
                    type="button"
                  >${filled ? "★" : "☆"}</button>
                `;
              }).join("")}
            </div>
          `;
        }
      }

      this.showToast(this.t(TRANSLATION_KEYS.RATING_UPDATED), "success");
    }
  }

  toggleNoteEditor(promptId) {
    const card = document.querySelector(`.prompt-card[data-id="${promptId}"]`);
    if (!card) return;

    const noteSection = card.querySelector(".note-section");
    const isVisible = noteSection.classList.contains("visible");

    if (isVisible) {
      noteSection.classList.remove("visible");
      // Clear auto-save timer when closing
      if (this.autoSaveTimers[promptId]) {
        clearTimeout(this.autoSaveTimers[promptId]);
        delete this.autoSaveTimers[promptId];
      }
    } else {
      noteSection.classList.add("visible");
      const textarea = noteSection.querySelector(".note-textarea");
      if (textarea) {
        textarea.focus();
        // Initialize character count without auto-save
        this.updateCharacterCount(promptId, false);
      }
    }
  }

  saveNote(promptId) {
    const card = document.querySelector(`.prompt-card[data-id="${promptId}"]`);
    if (!card) return;

    const textarea = card.querySelector(".note-textarea");
    const noteText = textarea.value.trim();

    const prompt = this.prompts.find((p) => p.id === promptId);
    if (prompt) {
      if (noteText) {
        prompt.note = noteText;
        prompt.noteUpdatedAt = Date.now();
      } else {
        delete prompt.note;
        delete prompt.noteUpdatedAt;
      }

      this.savePrompts();

      // Check if note display container exists
      let noteDisplayContainer = card.querySelector(".note-display-container");
      const noteIndicator = card.querySelector(".note-indicator");

      if (noteText) {
        // If note display doesn't exist, create it
        if (!noteDisplayContainer) {
          const promptContent = card.querySelector(".prompt-content");
          noteDisplayContainer = document.createElement("div");
          noteDisplayContainer.className = "note-display-container";
          noteDisplayContainer.innerHTML = `<div class="note-display">${this.escapeHtml(noteText)}</div>`;
          promptContent.after(noteDisplayContainer);
        } else {
          // Update existing note display
          const noteDisplay =
            noteDisplayContainer.querySelector(".note-display");
          if (noteDisplay) {
            noteDisplay.textContent = noteText;
          }
        }

        // Show note indicator
        if (noteIndicator) noteIndicator.style.display = "inline";

        // Update the "Add Note" button to "Edit Note"
        const noteButton = card.querySelector(".btn-note");
        if (noteButton) {
          noteButton.textContent = this.t(TRANSLATION_KEYS.EDIT_NOTE);
        }
      } else {
        // Remove note display if it exists
        if (noteDisplayContainer) {
          noteDisplayContainer.remove();
        }
        if (noteIndicator) noteIndicator.style.display = "none";

        // Update button back to "Add Note"
        const noteButton = card.querySelector(".btn-note");
        if (noteButton) {
          noteButton.textContent = this.t(TRANSLATION_KEYS.ADD_NOTE);
        }
      }

      // Update delete button visibility in the note editor
      const noteSection = card.querySelector(".note-section");
      if (noteSection) {
        const noteButtons = noteSection.querySelector(".note-buttons");
        if (noteButtons && noteText) {
          // Add delete button if it doesn't exist
          if (!noteButtons.querySelector(".btn-note-delete")) {
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-note-delete";
            deleteBtn.onclick = () => this.deleteNote(promptId);
            deleteBtn.type = "button";
            deleteBtn.textContent = this.t(TRANSLATION_KEYS.DELETE_NOTE);
            noteButtons.insertBefore(deleteBtn, noteButtons.firstChild);
          }
        }
      }

      // Close the editor
      this.toggleNoteEditor(promptId);
      this.showToast(this.t(TRANSLATION_KEYS.NOTE_SAVED), "success");
    }
  }

  deleteNote(promptId) {
    if (!confirm(this.t(TRANSLATION_KEYS.DELETE_NOTE_CONFIRM))) {
      return;
    }

    const prompt = this.prompts.find((p) => p.id === promptId);
    if (prompt) {
      delete prompt.note;
      delete prompt.noteUpdatedAt;
      this.savePrompts();

      const card = document.querySelector(
        `.prompt-card[data-id="${promptId}"]`
      );
      if (card) {
        // Remove the note display container
        const noteDisplayContainer = card.querySelector(
          ".note-display-container"
        );
        if (noteDisplayContainer) {
          noteDisplayContainer.remove();
        }

        const noteIndicator = card.querySelector(".note-indicator");
        const textarea = card.querySelector(".note-textarea");

        if (noteIndicator) noteIndicator.style.display = "none";
        if (textarea) textarea.value = "";

        // Update button back to "Add Note"
        const noteButton = card.querySelector(".btn-note");
        if (noteButton) {
          noteButton.textContent = this.t(TRANSLATION_KEYS.ADD_NOTE);
        }

        // Remove delete button from note editor
        const deleteBtn = card.querySelector(".btn-note-delete");
        if (deleteBtn) {
          deleteBtn.remove();
        }

        this.toggleNoteEditor(promptId);
      }

      this.showToast(this.t(TRANSLATION_KEYS.NOTE_DELETED), "success");
    }
  }

  updateCharacterCount(promptId, enableAutoSave = true) {
    const card = document.querySelector(`.prompt-card[data-id="${promptId}"]`);
    if (!card) return;

    const textarea = card.querySelector(".note-textarea");
    const charCount = card.querySelector(".char-count");

    if (textarea && charCount) {
      const length = textarea.value.length;
      charCount.textContent = `${length}/500 ${this.t(TRANSLATION_KEYS.CHARACTERS)}`;

      if (length > 500) {
        charCount.style.color = "var(--danger-color)";
        textarea.value = textarea.value.substring(0, 500);
      } else {
        charCount.style.color = "var(--text-secondary)";
      }
    }

    // Auto-save after 1 second of inactivity (only if enableAutoSave is true)
    if (enableAutoSave) {
      if (this.autoSaveTimers[promptId]) {
        clearTimeout(this.autoSaveTimers[promptId]);
      }

      this.autoSaveTimers[promptId] = setTimeout(() => {
        const prompt = this.prompts.find((p) => p.id === promptId);
        const currentNote = textarea ? textarea.value.trim() : "";

        // Only auto-save if the note has actually changed
        if (prompt && currentNote !== (prompt.note || "")) {
          this.saveNote(promptId);
        }
      }, 1000);
    }
  }

  exportPrompts() {
    if (this.prompts.length === 0) {
      this.showToast(this.t(TRANSLATION_KEYS.NO_PROMPTS_TO_EXPORT), "error");
      return;
    }

    const dataStr = JSON.stringify(this.prompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;

    // Create filename with current date
    const date = new Date().toISOString().split("T")[0];
    link.download = `prompts-export-${date}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);

    this.showToast(this.t(TRANSLATION_KEYS.PROMPTS_EXPORTED), "success");
  }

  // Utility methods
  formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes === 0
          ? this.t(TRANSLATION_KEYS.JUST_NOW)
          : `${diffMinutes}${this.t(TRANSLATION_KEYS.MINUTES_AGO)}`;
      }
      return `${diffHours}${this.t(TRANSLATION_KEYS.HOURS_AGO)}`;
    } else if (diffDays === 1) {
      return this.t(TRANSLATION_KEYS.YESTERDAY);
    } else if (diffDays < 7) {
      return `${diffDays}${this.t(TRANSLATION_KEYS.DAYS_AGO)}`;
    } else {
      const locale =
        this.currentLang === "ka"
          ? "ka-GE"
          : this.currentLang === "ru"
            ? "ru-RU"
            : "en-US";
      return date.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  }

  renderStars(promptId, currentRating) {
    let starsHtml = '<div class="rating-stars">';
    for (let i = 1; i <= 5; i++) {
      const filled = i <= currentRating;
      const starClass = filled ? "star-filled" : "star-empty";
      const ariaLabel = this.t(TRANSLATION_KEYS.RATE_STARS).replace(
        "{0}",
        i.toString()
      );
      starsHtml += `
        <button
          class="star ${starClass}"
          data-rating="${i}"
          onclick="promptLibrary.setRating(${promptId}, ${i})"
          aria-label="${ariaLabel}"
          type="button"
        >${filled ? "★" : "☆"}</button>
      `;
    }
    starsHtml += "</div>";
    return starsHtml;
  }

  renderPrompts() {
    const promptsList = document.getElementById("promptsList");
    const emptyState = document.getElementById("emptyState");
    const countBadge = document.getElementById("promptCount");
    const exportButton = document.getElementById("exportButton");

    // Filter prompts based on search query
    const filteredPrompts = this.prompts.filter((prompt) => {
      if (!this.searchQuery) {
        return true;
      }

      const titleMatch = prompt.title.toLowerCase().includes(this.searchQuery);
      const contentMatch = prompt.content
        .toLowerCase()
        .includes(this.searchQuery);

      return titleMatch || contentMatch;
    });

    // Update count to show filtered results
    countBadge.textContent = filteredPrompts.length;

    // Enable/disable export button based on total prompts count
    exportButton.disabled = this.prompts.length === 0;

    if (this.prompts.length === 0) {
      promptsList.innerHTML = "";
      emptyState.classList.add("show");
      return;
    }

    if (filteredPrompts.length === 0) {
      promptsList.innerHTML = `
        <div class="no-results">
          <p>${this.t(TRANSLATION_KEYS.NO_RESULTS)}</p>
        </div>
      `;
      emptyState.classList.remove("show");
      return;
    }

    emptyState.classList.remove("show");

    promptsList.innerHTML = filteredPrompts
      .map(
        (prompt) => `
            <article class="prompt-card" data-id="${prompt.id}" role="listitem">
                <div class="prompt-card-header">
                    <div>
                        <h3>
                            ${this.escapeHtml(prompt.title)}
                            ${prompt.note ? '<span class="note-indicator" style="display: inline;">📝</span>' : '<span class="note-indicator" style="display: none;">📝</span>'}
                        </h3>
                        <div class="prompt-date">${this.formatDate(
                          prompt.createdAt
                        )}</div>
                    </div>
                    <div class="rating-container" aria-label="${this.t(
                      TRANSLATION_KEYS.RATE_PROMPT
                    )}">
                        ${this.renderStars(prompt.id, prompt.rating || 0)}
                    </div>
                </div>
                
                ${
                  prompt.metadata
                    ? `
                <div class="metadata-container">
                    <div class="metadata-row">
                        <span class="metadata-label">🤖 ${this.escapeHtml(
                          prompt.metadata.model
                        )}</span>
                        <span class="metadata-timestamps">
                            <span class="metadata-item" title="${prompt.metadata.createdAt}">
                                ${this.t(TRANSLATION_KEYS.CREATED)}: ${this.formatTimestamp(prompt.metadata.createdAt)}
                            </span>
                            ${
                              prompt.metadata.updatedAt !==
                              prompt.metadata.createdAt
                                ? `
                            <span class="metadata-separator">•</span>
                            <span class="metadata-item" title="${prompt.metadata.updatedAt}">
                                ${this.t(TRANSLATION_KEYS.UPDATED)}: ${this.formatTimestamp(prompt.metadata.updatedAt)}
                            </span>
                            `
                                : ""
                            }
                        </span>
                    </div>
                    <div class="metadata-row">
                        <span class="token-estimate">
                            📊 ${this.t(TRANSLATION_KEYS.TOKEN_ESTIMATE)}: 
                            <span class="token-range">${prompt.metadata.tokenEstimate.min}-${prompt.metadata.tokenEstimate.max}</span>
                            <span class="confidence-badge" style="background-color: ${this.getConfidenceColor(prompt.metadata.tokenEstimate.confidence)}20; color: ${this.getConfidenceColor(prompt.metadata.tokenEstimate.confidence)};">
                                ${prompt.metadata.tokenEstimate.confidence}
                            </span>
                        </span>
                    </div>
                </div>
                `
                    : ""
                }
                
                <div class="prompt-actions">
                    <button class="btn-note" onclick="promptLibrary.toggleNoteEditor(${prompt.id})" aria-label="Add or edit note">
                        <span class="btn-icon">${prompt.note ? "📝" : "📝"}</span>
                        <span class="btn-text">${prompt.note ? this.t(TRANSLATION_KEYS.EDIT_NOTE).replace("📝 ", "") : this.t(TRANSLATION_KEYS.ADD_NOTE).replace("📝 ", "")}</span>
                    </button>
                    <button class="btn-edit" onclick="promptLibrary.editPrompt(${prompt.id})" aria-label="Edit this prompt">
                        <span class="btn-icon">✏️</span>
                        <span class="btn-text">${this.t(TRANSLATION_KEYS.EDIT_BUTTON).replace("✏️ ", "")}</span>
                    </button>
                    <button class="btn-copy" onclick="promptLibrary.copyPrompt(\`${this.escapeForAttribute(
                      prompt.content
                    )}\`)" aria-label="Copy prompt to clipboard">
                        <span class="btn-icon">📋</span>
                        <span class="btn-text">${this.t(TRANSLATION_KEYS.COPY_BUTTON).replace("📋 ", "")}</span>
                    </button>
                    <button class="btn-delete" onclick="promptLibrary.deletePrompt(${
                      prompt.id
                    })" aria-label="Delete this prompt">
                        <span class="btn-icon">🗑️</span>
                        <span class="btn-text">${this.t(TRANSLATION_KEYS.DELETE_BUTTON).replace("🗑️ ", "")}</span>
                    </button>
                </div>
                
                ${
                  prompt.note
                    ? `
                <div class="note-display-container">
                    <div class="note-display">${this.escapeHtml(prompt.note)}</div>
                </div>
                `
                    : ""
                }
                
                <div class="note-section">
                    <textarea 
                        class="note-textarea" 
                        placeholder="${this.t(TRANSLATION_KEYS.NOTE_PLACEHOLDER)}"
                        maxlength="500"
                        oninput="promptLibrary.updateCharacterCount(${prompt.id})"
                    >${prompt.note ? this.escapeHtml(prompt.note) : ""}</textarea>
                    <div class="note-actions">
                        <span class="char-count">0/500 ${this.t(TRANSLATION_KEYS.CHARACTERS)}</span>
                        <div class="note-buttons">
                            ${
                              prompt.note
                                ? `
                            <button class="btn-note-delete" onclick="promptLibrary.deleteNote(${prompt.id})" type="button">
                                ${this.t(TRANSLATION_KEYS.DELETE_NOTE)}
                            </button>
                            `
                                : ""
                            }
                            <button class="btn-note-cancel" onclick="promptLibrary.toggleNoteEditor(${prompt.id})" type="button">
                                ${this.t(TRANSLATION_KEYS.CANCEL)}
                            </button>
                            <button class="btn-note-save" onclick="promptLibrary.saveNote(${prompt.id})" type="button">
                                ${this.t(TRANSLATION_KEYS.SAVE_NOTE)}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="prompt-content">${this.formatPromptContent(
                  prompt.content
                )}</div>
            </article>
        `
      )
      .join("");
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  formatPromptContent(text) {
    if (!text) return "";

    // Split into lines for processing (don't escape yet)
    let lines = text.split("\n");
    let result = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Code blocks (```)
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          result.push('<div class="code-block">');
        } else {
          result.push("</div>");
        }
        continue;
      }

      if (inCodeBlock) {
        result.push(`<div class="code-line">${this.escapeHtml(line)}</div>`);
        continue;
      }

      // Headings (lines ending with :)
      if (
        line.trim().endsWith(":") &&
        line.trim().length > 1 &&
        line.trim().length < 100
      ) {
        const formatted = this.formatInlineStyles(line);
        result.push(`<div class="prompt-heading">${formatted}</div>`);
        continue;
      }

      // Bullet lists (-, *, •)
      const bulletMatch = line.trim().match(/^[-*•]\s+(.+)/);
      if (bulletMatch) {
        const content = bulletMatch[1]; // Use the captured group
        const formatted = this.formatInlineStyles(content);
        result.push(
          `<div class="prompt-list-item"><span class="bullet">•</span> ${formatted}</div>`
        );
        continue;
      }

      // Numbered lists (1., 2., etc.)
      const numberMatch = line.trim().match(/^(\d+)\.\s+(.+)/);
      if (numberMatch) {
        const formatted = this.formatInlineStyles(numberMatch[2]);
        result.push(
          `<div class="prompt-list-item"><span class="number">${numberMatch[1]}.</span> ${formatted}</div>`
        );
        continue;
      }

      // Empty lines for spacing
      if (line.trim() === "") {
        result.push('<div class="line-break"></div>');
      } else {
        const formatted = this.formatInlineStyles(line);
        result.push(`<div class="prompt-line">${formatted}</div>`);
      }
    }

    return result.join("");
  }

  formatInlineStyles(text) {
    // Escape HTML first
    let formatted = this.escapeHtml(text);

    // Bold text (**text**)
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Inline code (`code`) - do this before italic to avoid conflicts
    formatted = formatted.replace(
      /`([^`]+)`/g,
      '<code class="inline-code">$1</code>'
    );

    // Italic text (*text* or _text_) - but not if it's part of **
    formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
    formatted = formatted.replace(/(?<!_)_([^_]+?)_(?!_)/g, "<em>$1</em>");

    return formatted;
  }

  escapeForAttribute(text) {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
  }

  // Metadata Tracking System
  estimateTokens(text, isCode = false) {
    if (!text || typeof text !== "string") {
      throw new Error("Text must be a non-empty string");
    }

    const wordCount = text.trim().split(/\s+/).length;
    const charCount = text.length;

    let minTokens = Math.ceil(0.75 * wordCount);
    let maxTokens = Math.ceil(0.25 * charCount);

    if (isCode) {
      minTokens = Math.ceil(minTokens * 1.3);
      maxTokens = Math.ceil(maxTokens * 1.3);
    }

    const avgTokens = (minTokens + maxTokens) / 2;
    let confidence;

    if (avgTokens < 1000) {
      confidence = "high";
    } else if (avgTokens <= 5000) {
      confidence = "medium";
    } else {
      confidence = "low";
    }

    return {
      min: minTokens,
      max: maxTokens,
      confidence: confidence,
    };
  }

  trackModel(modelName, content) {
    if (!modelName || typeof modelName !== "string") {
      throw new Error("Model name must be a non-empty string");
    }

    if (modelName.length > 100) {
      throw new Error("Model name must not exceed 100 characters");
    }

    if (!content || typeof content !== "string") {
      throw new Error("Content must be a non-empty string");
    }

    const now = new Date().toISOString();
    const isCode = content.includes("```") || content.includes("function");

    try {
      const tokenEstimate = this.estimateTokens(content, isCode);

      return {
        model: modelName.trim(),
        createdAt: now,
        updatedAt: now,
        tokenEstimate: tokenEstimate,
      };
    } catch (error) {
      throw new Error(`Failed to track model: ${error.message}`);
    }
  }

  updateTimestamps(metadata) {
    if (!metadata || typeof metadata !== "object") {
      throw new Error("Metadata must be an object");
    }

    if (!metadata.createdAt) {
      throw new Error("Metadata must have a createdAt field");
    }

    const now = new Date().toISOString();
    const createdDate = new Date(metadata.createdAt);
    const updatedDate = new Date(now);

    if (isNaN(createdDate.getTime())) {
      throw new Error("Invalid createdAt date format");
    }

    if (updatedDate < createdDate) {
      throw new Error("updatedAt cannot be earlier than createdAt");
    }

    return {
      ...metadata,
      updatedAt: now,
    };
  }

  formatTimestamp(isoString) {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch (error) {
      return "Invalid date";
    }
  }

  getConfidenceColor(confidence) {
    const colors = {
      high: "#10b981",
      medium: "#f59e0b",
      low: "#ef4444",
    };
    return colors[confidence] || colors.medium;
  }

  showToast(message, _type = "success") {
    // Remove any existing toast with fade out
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.style.opacity = "0";
      existingToast.style.transform = "translateY(10px)";
      setTimeout(() => existingToast.remove(), 150);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 200);
    }, 2000);
  }
}
