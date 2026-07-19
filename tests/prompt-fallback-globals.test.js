'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const pages = [
    ['audio-prompty.html', 'AUDIO_PROMPTS'],
    ['prezentace-prompty.html', 'PREZENTACE_PROMPTS'],
    ['video-prompty.html', 'VIDEO_PROMPTS']
];

for (const [fileName, globalName] of pages) {
    test(`${fileName} safely reads its optional prompt fallback`, () => {
        const html = fs.readFileSync(path.join(__dirname, '..', 'modules', fileName), 'utf8');
        const guardPattern = new RegExp(
            `const localPrompts = Array\\.isArray\\(globalThis\\.${globalName}\\)\\s*` +
            `\\? globalThis\\.${globalName}\\s*:\\s*\\[\\];`
        );
        const guard = html.match(guardPattern);

        assert.ok(guard, `Missing safe globalThis guard for ${globalName}`);

        const unguarded = html
            .replaceAll(`globalThis.${globalName}`, '')
            .match(new RegExp(`\\b${globalName}\\b`, 'g'));
        assert.equal(unguarded, null, `Found an unguarded read of ${globalName}`);

        const withoutGlobal = {};
        vm.runInNewContext(`${guard[0]} globalThis.result = localPrompts;`, withoutGlobal);
        assert.ok(Array.isArray(withoutGlobal.result));
        assert.equal(withoutGlobal.result.length, 0);

        const testPrompts = [{ id: 'test-prompt', title: 'Test prompt' }];
        const withGlobal = { [globalName]: testPrompts };
        vm.runInNewContext(`${guard[0]} globalThis.result = localPrompts;`, withGlobal);
        assert.equal(withGlobal.result, testPrompts);
    });
}
