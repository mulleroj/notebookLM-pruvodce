'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const {
    renderSafeMessageContent,
    resolveSafeHttpUrl
} = require(path.join(projectRoot, 'chatbot.js'));

class FakeNode {
    constructor(ownerDocument) {
        this.ownerDocument = ownerDocument;
        this.childNodes = [];
    }

    append(...nodes) {
        this.childNodes.push(...nodes);
    }

    get textContent() {
        return this.childNodes.map((node) => node.textContent).join('');
    }
}

class FakeTextNode extends FakeNode {
    constructor(ownerDocument, value) {
        super(ownerDocument);
        this.value = String(value);
    }

    get textContent() {
        return this.value;
    }
}

class FakeElement extends FakeNode {
    constructor(ownerDocument, tagName) {
        super(ownerDocument);
        this.tagName = tagName.toUpperCase();
        this.className = '';
        this.href = '';
        this.rel = '';
        this.target = '';
    }

    set textContent(value) {
        this.childNodes = [new FakeTextNode(this.ownerDocument, value)];
    }

    get textContent() {
        return super.textContent;
    }

    querySelectorAll(tagName) {
        const wanted = tagName.toUpperCase();
        const matches = [];
        const visit = (node) => {
            if (node.tagName === wanted) {
                matches.push(node);
            }
            node.childNodes.forEach(visit);
        };
        this.childNodes.forEach(visit);
        return matches;
    }
}

class FakeDocument {
    constructor() {
        this.baseURI = 'https://notebooklm-pruvodce.example/';
    }

    createElement(tagName) {
        return new FakeElement(this, tagName);
    }

    createTextNode(value) {
        return new FakeTextNode(this, value);
    }
}

function render(value) {
    const document = new FakeDocument();
    const container = document.createElement('div');
    renderSafeMessageContent(container, value, document.baseURI);
    return container;
}

test('chatbot renders injected HTML as text and creates no img element', () => {
    const payload = '<img src=x onerror=alert(1)>';
    const container = render(payload);

    assert.equal(container.querySelectorAll('img').length, 0);
    assert.equal(container.textContent, payload);
});

test('javascript URLs are not rendered as active links', () => {
    const container = render('[bad](javascript:alert(1))');

    assert.equal(container.querySelectorAll('a').length, 0);
    assert.match(container.textContent, /javascript:alert/);
});

test('safe HTTPS links use noopener noreferrer', () => {
    const container = render('[bezpečný odkaz](https://example.com/path)');
    const links = container.querySelectorAll('a');

    assert.equal(links.length, 1);
    assert.equal(links[0].href, 'https://example.com/path');
    assert.equal(links[0].target, '_blank');
    assert.equal(links[0].rel, 'noopener noreferrer');
});

test('unsafe URL schemes are rejected while relative links resolve to HTTP(S)', () => {
    assert.equal(resolveSafeHttpUrl('data:text/html,test'), null);
    assert.equal(resolveSafeHttpUrl('vbscript:msgbox(1)'), null);
    assert.equal(
        resolveSafeHttpUrl('modules/video-prehled.html', 'https://example.com/guide/'),
        'https://example.com/guide/modules/video-prehled.html'
    );
});

test('fixed chatbot flow contains no HTML string injection sink or inline handler', () => {
    const source = fs.readFileSync(path.join(projectRoot, 'chatbot.js'), 'utf8');

    assert.doesNotMatch(source, /insertAdjacentHTML|\.innerHTML\s*=|onclick\s*=/);
});

test('dormant app user-message function uses textContent instead of HTML injection', () => {
    const source = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
    const start = source.indexOf('function addMessage(type, content)');
    const end = source.indexOf('function addTrustedMessage', start);
    const userMessageFunction = source.slice(start, end);

    assert.ok(start >= 0 && end > start);
    assert.match(userMessageFunction, /textContent\s*=\s*line/);
    assert.doesNotMatch(userMessageFunction, /innerHTML|insertAdjacentHTML/);
});
