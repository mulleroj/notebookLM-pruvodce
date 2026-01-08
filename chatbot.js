/**
 * NotebookLM Průvodce - Enhanced Chatbot
 * Inteligentní AI asistent s knowledge base
 */

// Knowledge base embedded directly to avoid CORS issues
const knowledgeBase = window.CHATBOT_KNOWLEDGE || (() => {
    // Placeholder - will be replaced from external file
    return {};
})();

class GeminiChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.apiKey = '';
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        // Knowledge base will be injected from separate script
        this.kb = window.CHATBOT_KNOWLEDGE;

        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.showWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <!-- Chatbot Button -->
            <button class="chatbot-button pulse" id="chatbot-toggle" aria-label="Otevřít chat asistenta">
                💬
            </button>

            <!-- Chatbot Window -->
            <div class="chatbot-window" id="chatbot-window">
                <!-- Header -->
                <div class="chatbot-header">
                    <div>
                        <div class="chatbot-title">
                            <span>🤖</span>
                            <span>NotebookLM Asistent</span>
                        </div>
                        <div class="chatbot-status">
                            <span class="status-dot"></span>
                            <span>Online</span>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbot-close" aria-label="Zavřít chat">
                        ×
                    </button>
                </div>

                <!-- Messages Area -->
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- Messages will be inserted here -->
                </div>

                <!-- Input Area -->
                <div class="chatbot-input">
                    <textarea 
                        id="chatbot-textarea" 
                        placeholder="Zeptejte se na NotebookLM..."
                        rows="1"
                        maxlength="500"
                    ></textarea>
                    <button class="chatbot-send" id="chatbot-send" aria-label="Odeslat zprávu">
                        📤
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const textarea = document.getElementById('chatbot-textarea');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        textarea.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-toggle');

        if (this.isOpen) {
            window.classList.add('open');
            button.classList.add('active');
            button.classList.remove('pulse');
            document.getElementById('chatbot-textarea').focus();
        } else {
            window.classList.remove('open');
            button.classList.remove('active');
        }
    }

    showWelcomeMessage() {
        const welcomeHTML = `
            <div class="welcome-message">
                <h3>👋 Ahoj! Jsem váš AI asistent</h3>
                <p>Pomohu vám najít informace o NotebookLM pro učitele.</p>
                <div class="welcome-suggestions">
                    <div class="suggestion-chip" onclick="chatbot.quickAsk('Jak začít s NotebookLM?')">
                        🚀 Jak začít s NotebookLM?
                    </div>
                    <div class="suggestion-chip" onclick="chatbot.quickAsk('Use cases pro video')">
                        🎥 Use cases pro video
                    </div>
                    <div class="suggestion-chip" onclick="chatbot.quickAsk('Co je Studio?')">
                        🎬 Co je Studio?
                    </div>
                </div>
            </div>
        `;

        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = welcomeHTML;
    }

    quickAsk(question) {
        document.getElementById('chatbot-textarea').value = question;
        this.sendMessage();
    }

    async sendMessage() {
        const textarea = document.getElementById('chatbot-textarea');
        const message = textarea.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        textarea.value = '';
        textarea.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        // Get bot response
        try {
            const response = await this.getBotResponse(message);
            this.hideTypingIndicator();
            this.addMessage('bot', response);
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('bot', 'Omlouvám se, došlo k chybě. Zkuste to prosím znovu.');
            console.error('Chatbot error:', error);
        }
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('chatbot-messages');

        // Remove welcome message if exists
        const welcome = messagesContainer.querySelector('.welcome-message');
        if (welcome) welcome.remove();

        const messageHTML = `
            <div class="message ${type}">
                ${type === 'bot' ? '<div class="message-avatar">🤖</div>' : ''}
                <div class="message-bubble">
                    <p class="message-text">${this.formatMessage(content)}</p>
                </div>
                ${type === 'user' ? '<div class="message-avatar">👤</div>' : ''}
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatMessage(text) {
        // Simple markdown-like formatting
        // Convert [text](url) to links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="message-link" target="_blank">$1 →</a>');

        // Convert **bold** to <strong>
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Convert line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingHTML = `
            <div class="message bot typing-message">
                <div class="message-avatar">🤖</div>
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typing = document.querySelector('.typing-message');
        if (typing) typing.remove();
    }

    async getBotResponse(userMessage) {
        return this.searchKnowledgeBase(userMessage);
    }

    searchKnowledgeBase(question) {
        const lowerQuestion = question.toLowerCase();

        // Odstranění diakritiky pro lepší vyhledávání
        const removeDiacritics = (str) => {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };
        const normalizedQuestion = removeDiacritics(lowerQuestion);

        // 1. Zkus přímou shodu v quick answers
        for (const [key, response] of Object.entries(this.kb.quickAnswers)) {
            const normalizedKey = removeDiacritics(key.toLowerCase());
            if (normalizedQuestion.includes(normalizedKey)) {
                return `${response.answer}\n\n[${response.link.includes('#') ? 'Zobrazit přímo tuto sekci' : 'Zobrazit stránku'}](${response.link}) →`;
            }
        }

        // 2. Hledej v modulech
        for (const [moduleKey, module] of Object.entries(this.kb.modules)) {
            const normalizedTitle = removeDiacritics(module.title.toLowerCase());

            // Zkontroluj název modulu
            if (normalizedQuestion.includes(normalizedTitle)) {
                let response = `**${module.title}**\n\n${module.description}\n\n`;

                // Přidej top use cases, pokud existují
                if (module.topUseCases && module.topUseCases.length > 0) {
                    response += `**TOP Use Cases:**\n`;
                    module.topUseCases.slice(0, 3).forEach((uc, i) => {
                        response += `${i + 1}. ${uc}\n`;
                    });
                    response += `\n`;
                }

                response += `[Zobrazit kompletní návod a všechny use cases](${module.url}#top-use-cases) →`;
                return response;
            }

            // Zkontroluj keywords v sekcích
            for (const section of module.sections) {
                for (const keyword of section.keywords) {
                    if (normalizedQuestion.includes(removeDiacritics(keyword.toLowerCase()))) {
                        return `Našel jsem informace o **${module.title}** - ${section.title}:\n\n${module.description}\n\n[Zobrazit ${section.title}](${module.url}#${section.id}) →`;
                    }
                }
            }
        }

        // 3. Hledej v ostatních stránkách
        for (const [pageKey, page] of Object.entries(this.kb.pages)) {
            const normalizedTitle = removeDiacritics(page.title.toLowerCase());

            if (normalizedQuestion.includes(normalizedTitle)) {
                let response = `Našel jsem stránku: **${page.title}**\n\nSekce:\n`;
                page.sections.slice(0, 3).forEach((section, i) => {
                    response += `• ${section.title}\n`;
                });
                response += `\n[Zobrazit ${page.title}](${page.url}) →`;
                return response;
            }

            // Zkontroluj keywords
            for (const section of page.sections) {
                for (const keyword of section.keywords) {
                    if (normalizedQuestion.includes(removeDiacritics(keyword.toLowerCase()))) {
                        return `Našel jsem: **${section.title}** (${page.title})\n\n[Zobrazit tuto sekci](${page.url}#${section.id}) →`;
                    }
                }
            }
        }

        // 4. Speciální případy - čísla
        if (normalizedQuestion.match(/\d+/) && (normalizedQuestion.includes('use case') || normalizedQuestion.includes('priklad'))) {
            return `Máme pro vás **189 use cases** rozdělených do kategorií:\n\n📚 Příprava výuky\n📊 Hodnocení\n📋 Administrativa\n🧠 SPU & ADHD\n🎬 Studio moduly (Audio, Video, atd.)\n\n[Prohlédnout všechny use cases](use-cases.html) →`;
        }

        // 5. Default response s nápovědou
        const suggestions = [
            'use-cases.html|189 Use Cases pro učitele',
            'modules/video-prehled.html#top-use-cases|TOP 10 Video Use Cases',
            'modules/audio-prehled.html#top-use-cases|TOP 10 Audio Use Cases',
            'jak-zacit.html|Jak začít s NotebookLM',
            'troubleshooting.html|Troubleshooting'
        ];

        let defaultResponse = 'To je zajímavá otázka! Zkuste se podívat na:\n\n';
        suggestions.forEach(suggestion => {
            const [url, title] = suggestion.split('|');
            defaultResponse += `• [${title}](${url})\n`;
        });
        defaultResponse += `\nNebo mi zkuste položit otázku jinak - např:\n"Jak vytvořit video?"\n"Use cases pro flipované učení"\n"Problémy s NotebookLM" 😊`;

        return defaultResponse;
    }

    setAPIKey(key) {
        this.apiKey = key;
    }
}

// Initialize chatbot when DOM is ready
let chatbot;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatbot = new GeminiChatbot();
    });
} else {
    chatbot = new GeminiChatbot();
}
