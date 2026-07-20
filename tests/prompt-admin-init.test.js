'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const pages = [
    'audio-prompty.html',
    'prezentace-prompty.html',
    'video-prompty.html'
];

const guardPattern = /const promptSelect = document\.getElementById\('prompt-select'\);\s*const uploadArea = document\.getElementById\('upload-area'\);\s*const fileInput = document\.getElementById\('file-input'\);\s*if \(!promptSelect \|\| !uploadArea \|\| !fileInput\) \{\s*return;\s*\}/;

for (const fileName of pages) {
    test(`${fileName} skips inactive legacy admin initialization safely`, () => {
        const html = fs.readFileSync(path.join(__dirname, '..', 'modules', fileName), 'utf8');
        const functionStart = html.indexOf('function initializeAdminPanel()');
        const nextFunction = html.indexOf('async function handleFileUpload', functionStart);
        const promptIteration = html.indexOf('localPrompts.forEach', functionStart);
        const guard = html.slice(functionStart, promptIteration).match(guardPattern);

        assert.notEqual(functionStart, -1);
        assert.notEqual(nextFunction, -1);
        assert.notEqual(promptIteration, -1);
        assert.ok(guard, 'Required admin elements must be checked before first use');

        const functionSource = html.slice(functionStart, nextFunction).trim();
        const runInitialization = (elements, prompts = []) => {
            const context = {
                localPrompts: prompts,
                document: {
                    getElementById: (id) => elements[id] || null,
                    createElement: () => ({})
                }
            };
            vm.runInNewContext(`${functionSource}; initializeAdminPanel();`, context);
        };

        assert.doesNotThrow(() => runInitialization({}));

        const appendedOptions = [];
        const registeredEvents = [];
        const elements = {
            'prompt-select': {
                appendChild: (option) => appendedOptions.push(option)
            },
            'upload-area': {
                addEventListener: (eventName) => registeredEvents.push(eventName),
                classList: { add() {}, remove() {} }
            },
            'file-input': {
                addEventListener: (eventName) => registeredEvents.push(eventName),
                click() {}
            }
        };
        const prompts = [{ id: 'test-prompt', number: 1, title: 'Test prompt' }];

        assert.doesNotThrow(() => runInitialization(elements, prompts));
        assert.equal(appendedOptions.length, 1);
        assert.equal(appendedOptions[0].value, 'test-prompt');
        assert.equal(appendedOptions[0].textContent, '#1 - Test prompt');
        assert.deepEqual(registeredEvents, ['click', 'dragover', 'dragleave', 'drop', 'change']);
        assert.deepEqual(prompts, [{ id: 'test-prompt', number: 1, title: 'Test prompt' }]);

        const databaseInit = html.indexOf('initializeDatabase();');
        const adminInit = html.indexOf('initializeAdminPanel();', databaseInit);
        assert.notEqual(databaseInit, -1);
        assert.ok(adminInit > databaseInit, 'Public catalog initialization must remain first');
    });
}
