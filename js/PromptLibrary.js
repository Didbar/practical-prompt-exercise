import { STORAGE_KEYS, THEMES, ICONS, TRANSLATION_KEYS } from "./constants.js";
import { translations } from "./translations.js";

export class PromptLibrary {
  constructor() {
    this.prompts = [];
    this.currentLang = "en";
    this.searchQuery = "";
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
        this.prompts = [];
      }
    }
  }

  savePrompts() {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(this.prompts));
  }

  // Prompt CRUD methods
  addPrompt() {
    const titleInput = document.getElementById("promptTitle");
    const contentInput = document.getElementById("promptContent");

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      this.showToast(this.t(TRANSLATION_KEYS.FILL_ALL_FIELDS), "error");
      return;
    }

    const prompt = {
      id: Date.now(),
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
    };

    this.prompts.unshift(prompt);
    this.savePrompts();
    this.renderPrompts();

    // Clear form
    titleInput.value = "";
    contentInput.value = "";
    titleInput.focus();

    this.showToast(this.t(TRANSLATION_KEYS.PROMPT_SAVED), "success");
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

  renderPrompts() {
    const promptsList = document.getElementById("promptsList");
    const emptyState = document.getElementById("emptyState");
    const countBadge = document.getElementById("promptCount");
    const exportButton = document.getElementById("exportButton");

    // Filter prompts based on search query
    const filteredPrompts = this.prompts.filter((prompt) => {
      if (!this.searchQuery) return true;

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
                        <h3>${this.escapeHtml(prompt.title)}</h3>
                        <div class="prompt-date">${this.formatDate(
                          prompt.createdAt
                        )}</div>
                    </div>
                </div>
                <div class="prompt-content">${this.escapeHtml(
                  prompt.content
                )}</div>
                <div class="prompt-actions">
                    <button class="btn-copy" onclick="promptLibrary.copyPrompt(\`${this.escapeForAttribute(
                      prompt.content
                    )}\`)" aria-label="Copy prompt to clipboard">
                        ${this.t(TRANSLATION_KEYS.COPY_BUTTON)}
                    </button>
                    <button class="btn-delete" onclick="promptLibrary.deletePrompt(${
                      prompt.id
                    })" aria-label="Delete this prompt">
                        ${this.t(TRANSLATION_KEYS.DELETE_BUTTON)}
                    </button>
                </div>
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

  escapeForAttribute(text) {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
  }

  showToast(message, type = "success") {
    // Remove any existing toast
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
