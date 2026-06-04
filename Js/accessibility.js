/**
 * J&M Tech Solutions - Web Accessibility System (a11y)
 * ---------------------------------------------------
 * This script is fully self-contained. It injects its own CSS styles,
 * creates the floating accessibility controls panel (glassmorphism),
 * and manages persistence of state via localStorage.
 */
(function () {
    "use strict";

    // 1. CSS Injections for Panel and Custom Accessibility Overrides
    const css = `
        /* --- Floating Action Button & Panel CSS --- */
        .a11y-widget-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999990;
            border: 2px solid rgba(255, 255, 255, 0.2);
            outline: none;
        }
        .a11y-widget-fab:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 12px 30px rgba(37, 99, 235, 0.6);
        }
        .a11y-widget-fab svg {
            width: 28px;
            height: 28px;
            fill: currentColor;
        }
        .a11y-widget-panel {
            position: fixed;
            bottom: 92px;
            right: 24px;
            width: 320px;
            max-height: calc(100vh - 120px);
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            gap: 12px;
            z-index: 999990;
            overflow-y: auto;
            color: #f8fafc;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            box-sizing: border-box;
            scrollbar-width: thin;
        }
        .a11y-widget-panel.active {
            display: flex;
            animation: a11y-fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .a11y-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 12px;
            margin-bottom: 4px;
        }
        .a11y-panel-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .a11y-close-btn {
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border-radius: 6px;
            transition: all 0.2s;
        }
        .a11y-close-btn:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.08);
        }
        .a11y-panel-body {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .a11y-control-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .a11y-control-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
            margin-bottom: 2px;
        }
        .a11y-btn {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #cbd5e1;
            padding: 10px 14px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            width: 100%;
            text-align: left;
            box-sizing: border-box;
        }
        .a11y-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
            color: #ffffff;
        }
        .a11y-btn.active {
            background: #2563eb;
            border-color: #2563eb;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .a11y-btn-icon {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .a11y-btn-toggle {
            width: 32px;
            height: 18px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.15);
            position: relative;
            transition: background 0.2s;
        }
        .a11y-btn-toggle::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #ffffff;
            transition: transform 0.2s;
        }
        .a11y-btn.active .a11y-btn-toggle {
            background: rgba(255, 255, 255, 0.3);
        }
        .a11y-btn.active .a11y-btn-toggle::after {
            transform: translateX(14px);
        }
        
        /* Font size specific controls */
        .a11y-size-controls {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 8px;
        }
        .a11y-size-btn {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #cbd5e1;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            text-align: center;
            transition: all 0.2s;
        }
        .a11y-size-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            color: #ffffff;
        }
        .a11y-size-display {
            font-size: 13px;
            font-weight: 700;
            color: #ffffff;
            text-align: center;
            padding: 4px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 6px;
            border: 1px dashed rgba(255, 255, 255, 0.1);
        }

        .a11y-reset-btn {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #f87171;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 700;
            text-align: center;
            width: 100%;
            transition: all 0.2s;
            margin-top: 6px;
        }
        .a11y-reset-btn:hover {
            background: #ef4444;
            color: #ffffff;
            border-color: #ef4444;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        @keyframes a11y-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* --- Global Accessibility Overrides CSS --- */
        
        /* Grayscale Filter */
        .a11y-mode-grayscale {
            filter: grayscale(100%) !important;
        }

        /* High Contrast Theme */
        .a11y-mode-high-contrast {
            background-color: #000000 !important;
            background-image: none !important;
            color: #ffff00 !important;
        }
        .a11y-mode-high-contrast *:not(.a11y-widget-fab):not(.a11y-widget-panel):not(.a11y-widget-panel *) {
            background-color: #000000 !important;
            background-image: none !important;
            color: #ffff00 !important;
            border-color: #ffff00 !important;
            box-shadow: none !important;
            text-shadow: none !important;
        }
        .a11y-mode-high-contrast a:not(.a11y-widget-panel *) {
            color: #00ffff !important;
            text-decoration: underline !important;
            font-weight: bold !important;
        }
        .a11y-mode-high-contrast img, 
        .a11y-mode-high-contrast video, 
        .a11y-mode-high-contrast iframe {
            filter: contrast(150%) brightness(90%) !important;
        }
        
        /* Highly Readable Font Class */
        .a11y-mode-readable-font *:not(i):not(.fa):not(.fab):not(.fas):not(.far) {
            font-family: 'Arial', 'Helvetica', 'Segoe UI', sans-serif !important;
            letter-spacing: 0.05em !important;
            word-spacing: 0.1em !important;
            line-height: 1.65 !important;
        }

        /* Outline & Highlight Links */
        .a11y-mode-highlight-links a:not(.a11y-widget-panel *):not(.a11y-widget-fab) {
            outline: 3px solid #ff9f00 !important;
            background-color: rgba(255, 159, 0, 0.15) !important;
            color: #ffffff !important;
            text-decoration: underline !important;
            font-weight: 800 !important;
            padding: 2px 4px !important;
            border-radius: 4px !important;
        }

        /* Border & Highlight Titles */
        .a11y-mode-highlight-titles h1, 
        .a11y-mode-highlight-titles h2, 
        .a11y-mode-highlight-titles h3, 
        .a11y-mode-highlight-titles h4, 
        .a11y-mode-highlight-titles h5, 
        .a11y-mode-highlight-titles h6 {
            border-left: 6px solid #3b82f6 !important;
            padding-left: 8px !important;
            background-color: rgba(59, 130, 246, 0.08) !important;
            border-radius: 0 8px 8px 0 !important;
        }

        /* Reading guide line */
        #a11y-reading-guide-line {
            position: fixed;
            left: 0;
            width: 100vw;
            height: 4px;
            background-color: rgba(239, 68, 68, 0.85);
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
            pointer-events: none;
            z-index: 999999;
            display: none;
            transition: top 0.05s ease-out;
        }
    `;

    // 2. State & Storage Management
    const STORAGE_KEY = "jym_a11y_settings";
    
    const defaultState = {
        highContrast: false,
        grayscale: false,
        readableFont: false,
        highlightLinks: false,
        highlightTitles: false,
        readingGuide: false,
        textSize: 100 // percentages: 100, 110, 120, 130
    };

    let state = { ...defaultState };

    // Load state from localStorage
    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                state = { ...defaultState, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error("A11y storage load failed:", e);
        }
    }

    // Save state to localStorage
    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("A11y storage save failed:", e);
        }
    }

    // Apply active classes to document
    function applyAccessibility() {
        const root = document.documentElement;
        const body = document.body;

        if (!body) return;

        // Toggle global classes
        body.classList.toggle("a11y-mode-high-contrast", state.highContrast);
        body.classList.toggle("a11y-mode-grayscale", state.grayscale);
        body.classList.toggle("a11y-mode-readable-font", state.readableFont);
        body.classList.toggle("a11y-mode-highlight-links", state.highlightLinks);
        body.classList.toggle("a11y-mode-highlight-titles", state.highlightTitles);

        // Apply text size directly to root
        if (state.textSize === 100) {
            root.style.removeProperty("font-size");
        } else {
            root.style.fontSize = `${state.textSize}%`;
        }

        // Reading guide toggle
        const guide = document.getElementById("a11y-reading-guide-line");
        if (guide) {
            guide.style.display = state.readingGuide ? "block" : "none";
        }

        // Sync panel button visual active states
        updateButtonUI();
    }

    // 3. UI Interactions
    function updateButtonUI() {
        const buttons = {
            "highContrast": document.getElementById("a11y-toggle-contrast"),
            "grayscale": document.getElementById("a11y-toggle-grayscale"),
            "readableFont": document.getElementById("a11y-toggle-font"),
            "highlightLinks": document.getElementById("a11y-toggle-links"),
            "highlightTitles": document.getElementById("a11y-toggle-titles"),
            "readingGuide": document.getElementById("a11y-toggle-guide")
        };

        for (const [key, btn] of Object.entries(buttons)) {
            if (btn) {
                if (state[key]) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            }
        }

        // Sync text size display value
        const sizeDisplay = document.getElementById("a11y-size-val");
        if (sizeDisplay) {
            sizeDisplay.textContent = `${state.textSize}%`;
        }
    }

    // Toggle specific setting
    function toggleSetting(key) {
        state[key] = !state[key];
        saveState();
        applyAccessibility();
    }

    // Change text size
    function changeTextSize(increment) {
        if (increment) {
            if (state.textSize < 130) state.textSize += 10;
        } else {
            if (state.textSize > 100) state.textSize -= 10;
        }
        saveState();
        applyAccessibility();
    }

    // Reset all settings
    function resetAll() {
        state = { ...defaultState };
        saveState();
        applyAccessibility();
    }

    // Initialize Widget elements
    function initWidget() {
        // Inject styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);

        // Inject Reading Guide Line
        const guideLine = document.createElement("div");
        guideLine.id = "a11y-reading-guide-line";
        document.body.appendChild(guideLine);

        // Follow mouse movement for reading guide
        document.addEventListener("mousemove", function (e) {
            if (state.readingGuide) {
                guideLine.style.top = `${e.clientY - 2}px`;
            }
        });

        // Inject FAB (Floating Action Button)
        const fab = document.createElement("button");
        fab.className = "a11y-widget-fab";
        fab.setAttribute("aria-label", "Menú de Accesibilidad Web");
        fab.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
            </svg>
        `;
        document.body.appendChild(fab);

        // Inject Config Panel
        const panel = document.createElement("div");
        panel.className = "a11y-widget-panel";
        panel.innerHTML = `
            <div class="a11y-panel-header">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" style="fill:#3b82f6;">
                        <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                    </svg>
                    Accesibilidad Web
                </h3>
                <button class="a11y-close-btn" id="a11y-close" aria-label="Cerrar menú">&times;</button>
            </div>
            <div class="a11y-panel-body">
                
                <div class="a11y-control-group">
                    <span class="a11y-control-label">Tamaño de Texto</span>
                    <div class="a11y-size-controls">
                        <button class="a11y-size-btn" id="a11y-size-dec" aria-label="Disminuir texto">A-</button>
                        <button class="a11y-size-btn" id="a11y-size-inc" aria-label="Aumentar texto">A+</button>
                    </div>
                    <div class="a11y-size-display" id="a11y-size-val">100%</div>
                </div>

                <div class="a11y-control-group">
                    <span class="a11y-control-label">Visualización & Contraste</span>
                    <button class="a11y-btn" id="a11y-toggle-contrast">
                        <span class="a11y-btn-icon">🌓 Contraste Alto</span>
                        <div class="a11y-btn-toggle"></div>
                    </button>
                    <button class="a11y-btn" id="a11y-toggle-grayscale">
                        <span class="a11y-btn-icon">🖤 Escala de Grises</span>
                        <div class="a11y-btn-toggle"></div>
                    </button>
                </div>

                <div class="a11y-control-group">
                    <span class="a11y-control-label">Navegación & Enfoque</span>
                    <button class="a11y-btn" id="a11y-toggle-font">
                        <span class="a11y-btn-icon">🔤 Fuente Legible</span>
                        <div class="a11y-btn-toggle"></div>
                    </button>
                    <button class="a11y-btn" id="a11y-toggle-links">
                        <span class="a11y-btn-icon">🔗 Resaltar Enlaces</span>
                        <div class="a11y-btn-toggle"></div>
                    </button>
                    <button class="a11y-btn" id="a11y-toggle-titles">
                        <span class="a11y-btn-icon">🏷️ Resaltar Títulos</span>
                        <div class="a11y-btn-toggle"></div>
                    </button>
                    <button class="a11y-btn" id="a11y-toggle-guide">
                        <span class="a11y-btn-icon">📏 Guía de Lectura</span>
                        <div class="a11y-btn-toggle"></div>
                    </button>
                </div>

                <button class="a11y-reset-btn" id="a11y-reset">Restaurar Valores</button>
            </div>
        `;
        document.body.appendChild(panel);

        // Click listeners
        fab.addEventListener("click", function (e) {
            e.stopPropagation();
            panel.classList.toggle("active");
        });

        document.getElementById("a11y-close").addEventListener("click", function () {
            panel.classList.remove("active");
        });

        // Close on clicking outside
        document.addEventListener("click", function (e) {
            if (!panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) {
                panel.classList.remove("active");
            }
        });

        // Settings click triggers
        document.getElementById("a11y-toggle-contrast").addEventListener("click", () => toggleSetting("highContrast"));
        document.getElementById("a11y-toggle-grayscale").addEventListener("click", () => toggleSetting("grayscale"));
        document.getElementById("a11y-toggle-font").addEventListener("click", () => toggleSetting("readableFont"));
        document.getElementById("a11y-toggle-links").addEventListener("click", () => toggleSetting("highlightLinks"));
        document.getElementById("a11y-toggle-titles").addEventListener("click", () => toggleSetting("highlightTitles"));
        document.getElementById("a11y-toggle-guide").addEventListener("click", () => toggleSetting("readingGuide"));

        document.getElementById("a11y-size-inc").addEventListener("click", () => changeTextSize(true));
        document.getElementById("a11y-size-dec").addEventListener("click", () => changeTextSize(false));
        
        document.getElementById("a11y-reset").addEventListener("click", resetAll);

        // Initial apply
        applyAccessibility();
    }

    // 4. Dom Load Event Trigger
    loadState();
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initWidget);
    } else {
        initWidget();
    }
})();
