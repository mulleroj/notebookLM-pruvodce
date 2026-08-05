/**
 * Gemini Notebook průvodce - Enhanced Chatbot
 * Inteligentní AI asistent s knowledge base
 */

// Knowledge base embedded directly to avoid CORS issues
const knowledgeBase = (typeof window !== 'undefined' && window.CHATBOT_KNOWLEDGE) || (() => {
    // Placeholder - will be replaced from external file
    return {};
})();

function resolveSafeHttpUrl(value, baseUrl) {
    try {
        const fallbackBase = typeof window !== 'undefined'
            ? window.location.href
            : 'https://example.invalid/';
        const url = new URL(String(value).trim(), baseUrl || fallbackBase);

        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch (error) {
        return null;
    }
}

function appendInlineFormatting(parent, value, baseUrl) {
    const doc = parent.ownerDocument || document;
    const text = String(value);
    const tokenPattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
    let cursor = 0;
    let match;

    while ((match = tokenPattern.exec(text)) !== null) {
        if (match.index > cursor) {
            parent.append(doc.createTextNode(text.slice(cursor, match.index)));
        }

        if (match[1] !== undefined) {
            const safeUrl = resolveSafeHttpUrl(match[2], baseUrl);
            if (safeUrl) {
                const link = doc.createElement('a');
                link.className = 'message-link';
                link.href = safeUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = `${match[1]} →`;
                parent.append(link);
            } else {
                parent.append(doc.createTextNode(match[0]));
            }
        } else {
            const strong = doc.createElement('strong');
            strong.textContent = match[3];
            parent.append(strong);
        }

        cursor = tokenPattern.lastIndex;
    }

    if (cursor < text.length) {
        parent.append(doc.createTextNode(text.slice(cursor)));
    }
}

function renderSafeMessageContent(container, value, baseUrl) {
    const doc = container.ownerDocument || document;
    const lines = String(value).replace(/\r\n?/g, '\n').split('\n');
    let currentList = null;
    let currentListType = null;

    for (const line of lines) {
        if (!line.trim()) {
            currentList = null;
            currentListType = null;
            continue;
        }

        const unordered = line.match(/^\s*(?:[-*•])\s+(.+)$/);
        const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
        const listType = ordered ? 'ol' : unordered ? 'ul' : null;

        if (listType) {
            if (!currentList || currentListType !== listType) {
                currentList = doc.createElement(listType);
                currentListType = listType;
                container.append(currentList);
            }

            const item = doc.createElement('li');
            appendInlineFormatting(item, (ordered || unordered)[1], baseUrl);
            currentList.append(item);
            continue;
        }

        currentList = null;
        currentListType = null;
        const paragraph = doc.createElement('p');
        appendInlineFormatting(paragraph, line, baseUrl);
        container.append(paragraph);
    }
}

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
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'chatbot-button pulse';
        toggle.id = 'chatbot-toggle';
        toggle.setAttribute('aria-label', 'Otevřít chat asistenta');
        toggle.textContent = '💬';

        const chatbotWindow = document.createElement('div');
        chatbotWindow.className = 'chatbot-window';
        chatbotWindow.id = 'chatbot-window';

        const header = document.createElement('div');
        header.className = 'chatbot-header';
        const headerInfo = document.createElement('div');
        const title = document.createElement('div');
        title.className = 'chatbot-title';
        const titleIcon = document.createElement('span');
        titleIcon.textContent = '🤖';
        const titleText = document.createElement('span');
        titleText.textContent = 'Asistent průvodce Gemini Notebook';
        title.append(titleIcon, titleText);

        const status = document.createElement('div');
        status.className = 'chatbot-status';
        const statusDot = document.createElement('span');
        statusDot.className = 'status-dot';
        const statusText = document.createElement('span');
        statusText.textContent = 'Online';
        status.append(statusDot, statusText);
        headerInfo.append(title, status);

        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'chatbot-close';
        close.id = 'chatbot-close';
        close.setAttribute('aria-label', 'Zavřít chat');
        close.textContent = '×';
        header.append(headerInfo, close);

        const messages = document.createElement('div');
        messages.className = 'chatbot-messages';
        messages.id = 'chatbot-messages';

        const inputArea = document.createElement('div');
        inputArea.className = 'chatbot-input';
        const textarea = document.createElement('textarea');
        textarea.id = 'chatbot-textarea';
        textarea.placeholder = 'Zeptejte se na Gemini Notebook...';
        textarea.rows = 1;
        textarea.maxLength = 500;
        const send = document.createElement('button');
        send.type = 'button';
        send.className = 'chatbot-send';
        send.id = 'chatbot-send';
        send.setAttribute('aria-label', 'Odeslat zprávu');
        send.textContent = '📤';
        inputArea.append(textarea, send);

        chatbotWindow.append(header, messages, inputArea);
        document.body.append(toggle, chatbotWindow);
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
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.replaceChildren();

        const welcome = document.createElement('div');
        welcome.className = 'welcome-message';
        const heading = document.createElement('h3');
        heading.textContent = '👋 Ahoj! Jsem váš AI asistent';
        const description = document.createElement('p');
        description.textContent = 'Pomohu vám najít informace o Gemini Notebook pro učitele.';
        const suggestions = document.createElement('div');
        suggestions.className = 'welcome-suggestions';

        const questions = [
            ['🚀 Jak začít s Gemini Notebook?', 'Jak začít s Gemini Notebook?'],
            ['🎥 Use cases pro video', 'Use cases pro video'],
            ['🎬 Co je Studio?', 'Co je Studio?']
        ];

        for (const [label, question] of questions) {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion-chip';
            suggestion.setAttribute('role', 'button');
            suggestion.tabIndex = 0;
            suggestion.textContent = label;
            suggestion.addEventListener('click', () => this.quickAsk(question));
            suggestion.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.quickAsk(question);
                }
            });
            suggestions.append(suggestion);
        }

        welcome.append(heading, description, suggestions);
        messagesContainer.append(welcome);
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

        const safeType = type === 'bot' ? 'bot' : 'user';
        const message = document.createElement('div');
        message.className = `message ${safeType}`;
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = safeType === 'bot' ? '🤖' : '👤';
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        renderSafeMessageContent(messageText, content, window.location.href);
        bubble.append(messageText);

        if (safeType === 'bot') {
            message.append(avatar, bubble);
        } else {
            message.append(bubble, avatar);
        }

        messagesContainer.append(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typing = document.createElement('div');
        typing.className = 'message bot typing-message';
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = '🤖';
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        for (let index = 0; index < 3; index += 1) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            indicator.append(dot);
        }
        bubble.append(indicator);
        typing.append(avatar, bubble);
        messagesContainer.append(typing);
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

        // Product facts change more quickly than the historical guide catalogue.
        // Route questions about them to the audited pages instead of repeating old claims.
        if (/limit|tarif|zdroj|audio|video|prezent|infograf|mobil|offline|citac|lecture/.test(normalizedQuestion)) {
            return 'Aktuální produktové informace, limity a nabídka funkcí se liší podle účtu a mohou se průběžně měnit. ' +
                'Použijte aktualizovaný rozcestník a ověřte detail v nápovědě Google: ' +
                '[oficiální nápověda Gemini Notebook (stránka může používat starší název)](https://support.google.com/notebooklm/) →';
        }

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
            'jak-zacit.html|Jak začít s Gemini Notebook',
            'troubleshooting.html|Troubleshooting'
        ];

        let defaultResponse = 'To je zajímavá otázka! Zkuste se podívat na:\n\n';
        suggestions.forEach(suggestion => {
            const [url, title] = suggestion.split('|');
            defaultResponse += `• [${title}](${url})\n`;
        });
        defaultResponse += `\nNebo mi zkuste položit otázku jinak - např:\n"Jak vytvořit video?"\n"Praktické postupy pro flipované učení"\n"Problémy s Gemini Notebook" 😊`;

        return defaultResponse;
    }

    setAPIKey(key) {
        this.apiKey = key;
    }
}

// Initialize chatbot when DOM is ready
let chatbot;
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            chatbot = new GeminiChatbot();
        });
    } else {
        chatbot = new GeminiChatbot();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appendInlineFormatting,
        GeminiChatbot,
        renderSafeMessageContent,
        resolveSafeHttpUrl
    };
}
