// ==========================================
// APPLICATION STATE
// ==========================================

const STATE = {
    phase: 1, // 1: Module selection, 2: Diagnostics, 3: Prompt generation
    selectedModule: null,
    topic: null,
    documentCount: null,
    scenario: null, // 'A' for 20+ docs, 'B' for <20 docs
    waitingForHotovo: false
};

// ==========================================
// DOM ELEMENTS
// ==========================================

let elements = {};

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
    // Get DOM elements
    elements = {
        chatMessages: document.getElementById('chatMessages'),
        userInput: document.getElementById('userInput'),
        sendBtn: document.getElementById('sendBtn'),
        restartBtn: document.getElementById('restartBtn'),
        typingIndicator: document.getElementById('typingIndicator')
    };

    // Check if all required elements exist
    if (!elements.chatMessages || !elements.userInput || !elements.sendBtn || !elements.restartBtn || !elements.typingIndicator) {
        console.error('Required DOM elements not found. Make sure the HTML contains all required elements.');
        return;
    }

    // Event listeners
    elements.sendBtn.addEventListener('click', handleSend);
    elements.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
    elements.restartBtn.addEventListener('click', restart);

    // Start conversation
    showWelcomeMessage();
}

// ==========================================
// MESSAGE HANDLING
// ==========================================

function handleSend() {
    const input = elements.userInput.value.trim();
    if (!input) return;

    // Display user message
    addMessage('user', input);
    elements.userInput.value = '';

    // Process input based on current phase
    setTimeout(() => processUserInput(input), 500);
}

function processUserInput(input) {
    showTyping();

    setTimeout(() => {
        hideTyping();

        if (STATE.phase === 1) {
            handlePhase1(input);
        } else if (STATE.phase === 2) {
            handlePhase2(input);
        } else if (STATE.phase === 3 && STATE.waitingForHotovo) {
            handleHotovoConfirmation(input);
        }
    }, 1000);
}

// ==========================================
// PHASE 1: MODULE SELECTION
// ==========================================

function showWelcomeMessage() {
    const modules = getAllModules();
    const moduleListHTML = modules.map(m =>
        `<div class="module-item" onclick="selectModule(${m.number})">${m.number}. ${m.icon} <strong>${m.name}</strong></div>`
    ).join('');

    const welcomeText = `
        <p>Ahoj! Jsem <strong>Gema</strong>, tvoje expertní AI průvodkyně ekosystémem Google NotebookLM. 💎</p>
        <p>Pomohu ti vytvořit perfektní výsledky, i když máš ve zdrojích stovky dokumentů. Provedu tě procesem krok za krokem.</p>
        <p class="mb-2"><strong>S jakým modulem budeme dnes pracovat? Vyber si:</strong></p>
        <div class="module-list">${moduleListHTML}</div>
        <p class="mt-2" style="color: var(--color-text-muted); font-size: 0.875rem;">Můžeš napsat číslo nebo kliknout na modul.</p>
    `;

    addMessage('ai', welcomeText);
}

function handlePhase1(input) {
    const moduleNum = parseInt(input);

    if (moduleNum >= 1 && moduleNum <= 9) {
        STATE.selectedModule = moduleNum;
        STATE.phase = 2;

        const module = getModuleInfo(moduleNum);
        addMessage('ai', `
            <p>Výborná volba! ${module.icon} <strong>${module.name}</strong></p>
            <p>Aby byl výsledek perfektní, vyplň následující údaje:</p>
            
            <form id="topicForm" onsubmit="event.preventDefault(); submitTopicForm();">
                <div class="form-group">
                    <label>
                        <span class="question-number">1.</span>
                        NÁZEV tvé sbírky/sešitu:
                    </label>
                    <input 
                        type="text" 
                        id="sbirkaInput" 
                        class="form-input"
                        placeholder="např. Občanská nauka"
                        required
                    >
                    <div class="helper-text">Jak se jmenuje tvůj sešit v NotebookLM?</div>
                </div>

                <div class="form-group">
                    <label>
                        <span class="question-number">2.</span>
                        Kolik CELKEM máš ve zdrojích DOKUMENTŮ?
                    </label>
                    <input 
                        type="number" 
                        id="dokumentyInput" 
                        class="form-input"
                        placeholder="např. 250"
                        min="1"
                        required
                    >
                    <div class="helper-text">Celkový počet materiálů v této sbírce</div>
                </div>

                <div class="form-group">
                    <label>
                        <span class="question-number">3.</span>
                        O jaké KONKRÉTNÍ TÉMA ze zdrojů se chceš dozvědět?
                    </label>
                    <input 
                        type="text" 
                        id="temaInput" 
                        class="form-input"
                        placeholder="např. Politické strany ČR"
                        required
                    >
                    <div class="helper-text">Téma, které se vyskytuje v tvých dokumentech</div>
                </div>

                <button type="submit" class="form-submit-btn">✨ Pokračovat</button>
            </form>

            <div class="example-box">
                <h3>💡 Příklad vyplnění:</h3>
                <div class="example-item"><strong>Sbírka:</strong> Občanská nauka</div>
                <div class="example-item"><strong>Dokumentů celkem:</strong> 250</div>
                <div class="example-item"><strong>Téma:</strong> Politické strany ČR</div>
            </div>
        `);
    } else {
        addMessage('ai', '<p>Prosím, zadej číslo modulu od 1 do 9. 😊</p>');
    }
}

// ==========================================
// PHASE 2: DIAGNOSTICS
// ==========================================

function handlePhase2(input) {
    // Parse sbírka, topic and document count
    const sbirkaMatch = input.match(/sbírka[:\s]+([^,]+)/i);
    const docMatch = input.match(/dokument[^\d]*(\d+)/i);
    const topicMatch = input.match(/téma[:\s]+(.+)/i);

    if (sbirkaMatch && docMatch && topicMatch) {
        STATE.topic = topicMatch[1].trim();
        STATE.documentCount = parseInt(docMatch[1]);
        STATE.phase = 3;

        // Determine scenario
        if (STATE.documentCount > 20) {
            handleScenarioA();
        } else {
            handleScenarioB();
        }
    } else {
        addMessage('ai', `
            <p>Omlouvám se, nerozuměla jsem úplně. 😅</p>
            <p>Zkus prosím odpovědět ve formátu:<br>
            <strong>"Sbírka: [název], Dokumentů celkem: [počet], Téma: [téma]"</strong></p>
            <p>Například: <em>"Sbírka: Občanská nauka, Dokumentů celkem: 250, Téma: Politické strany ČR"</em></p>
        `);
    }
}

// ==========================================
// PHASE 3: PROMPT GENERATION
// ==========================================

// SCENARIO A: Many documents (>20)
function handleScenarioA() {
    STATE.scenario = 'A';
    STATE.waitingForHotovo = true;

    const filterPrompt = getMasterFilterPrompt(STATE.topic);

    addMessage('ai', `
        <p>⚠️ <strong>Pozor!</strong> Máš <strong>${STATE.documentCount} dokumentů</strong>.</p>
        <p>Při tomto množství zdrojů musíme nejdřív <strong>filtrovat</strong>, jinak bude výsledek nekvalitní a NotebookLM by míchal páté přes deváté.</p>
        <p><strong>📋 KROK 1: Filtrování</strong></p>
        <p>Vlož následující prompt do NotebookLM chatu a výsledek si ulož jako POZNÁMKU:</p>
    `);

    addCodeBlock(filterPrompt, 'Master filtrační prompt');

    addMessage('ai', `
        <p style="margin-top: 1rem;"><strong>Jakmile máš výsledek uložený jako poznámku, napiš sem:</strong> <code style="background: rgba(139, 92, 246, 0.2); padding: 0.25rem 0.5rem; border-radius: 4px;">HOTOVO</code></p>
    `);
}

// SCENARIO B: Few documents (≤20)
function handleScenarioB() {
    STATE.scenario = 'B';

    const modulePrompt = getModulePrompt(STATE.selectedModule, STATE.topic, false);
    const module = getModuleInfo(STATE.selectedModule);

    addMessage('ai', `
        <p>✅ Perfektní! S <strong>${STATE.documentCount} dokumenty</strong> můžeme pracovat rovnou.</p>
        <p><strong>${module.icon} Prompt pro ${module.name}:</strong></p>
    `);

    addCodeBlock(modulePrompt, `Prompt pro ${module.name}`);

    addMessage('ai', `
        <p style="margin-top: 1rem;">Vlož tento prompt do NotebookLM a užij si výsledek! 🎉</p>
        <p style="color: var(--color-text-muted); font-size: 0.875rem;">Chceš pracovat s jiným modulem? Klikni na <strong>Restart</strong> nahoře.</p>
    `);
}

// Handle HOTOVO confirmation (Scenario A continuation)
function handleHotovoConfirmation(input) {
    if (input.toLowerCase().includes('hotovo')) {
        STATE.waitingForHotovo = false;

        const modulePrompt = getModulePrompt(STATE.selectedModule, STATE.topic, true);
        const module = getModuleInfo(STATE.selectedModule);

        addMessage('ai', `
            <p>🎯 Skvělé! Teď vygeneruji finální prompt.</p>
            <p><strong>${module.icon} Prompt pro ${module.name} (s filtrovanými daty):</strong></p>
        `);

        addCodeBlock(modulePrompt, `Prompt pro ${module.name}`);

        addMessage('ai', `
            <p style="margin-top: 1rem;">Vlož tento prompt do NotebookLM (který má už otevřenou poznámku Source Briefing) a užij si perfektní výsledek! 🎉</p>
            <p style="color: var(--color-text-muted); font-size: 0.875rem;">Potřebuješ další modul? Klikni na <strong>Restart</strong>.</p>
        `);
    } else {
        addMessage('ai', '<p>Čekám na potvrzení. Napiš <strong>HOTOVO</strong>, až budeš mít filtrovaná data uložená jako poznámku. 😊</p>');
    }
}

// ==========================================
// UI FUNCTIONS
// ==========================================

function addMessage(type, content) {
    const avatar = type === 'ai' ? '💎' : '👤';
    const messageHTML = `
        <div class="message ${type}">
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${content}</div>
            </div>
        </div>
    `;

    elements.chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
}

function addCodeBlock(code, label = 'Prompt') {
    const codeHTML = `
        <div class="code-container">
            <div class="code-header">
                <span class="code-label">${label}</span>
                <button class="copy-btn" onclick="copyToClipboard(this, \`${escapeForTemplate(code)}\`)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Kopírovat
                </button>
            </div>
            <pre class="code-block">${escapeHTML(code)}</pre>
        </div>
    `;

    const lastMessage = elements.chatMessages.lastElementChild;
    if (lastMessage) {
        lastMessage.querySelector('.message-text').insertAdjacentHTML('beforeend', codeHTML);
    }
}

function showTyping() {
    elements.typingIndicator.style.display = 'flex';
    scrollToBottom();
}

function hideTyping() {
    elements.typingIndicator.style.display = 'none';
}

function scrollToBottom() {
    setTimeout(() => {
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }, 100);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function copyToClipboard(button, text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Zkopírováno!
        `;

        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalHTML;
        }, 2000);
    });
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeForTemplate(text) {
    return text.replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function submitTopicForm() {
    const sbirka = document.getElementById('sbirkaInput').value.trim();
    const dokumenty = document.getElementById('dokumentyInput').value.trim();
    const tema = document.getElementById('temaInput').value.trim();

    if (!sbirka || !dokumenty || !tema) {
        return; // Form validation will handle this
    }

    // Create formatted response
    const formattedResponse = `Sbírka: ${sbirka}, Dokumentů celkem: ${dokumenty}, Téma: ${tema}`;

    // Display as user message
    addMessage('user', `<p>${formattedResponse}</p>`);

    // Process the input
    setTimeout(() => processUserInput(formattedResponse), 500);
}

function selectModule(number) {
    elements.userInput.value = number;
    handleSend();
}

function restart() {
    // Reset state
    STATE.phase = 1;
    STATE.selectedModule = null;
    STATE.topic = null;
    STATE.documentCount = null;
    STATE.scenario = null;
    STATE.waitingForHotovo = false;

    // Clear chat
    elements.chatMessages.innerHTML = '';
    elements.userInput.value = '';

    // Restart
    showWelcomeMessage();
}

// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener('DOMContentLoaded', init);
