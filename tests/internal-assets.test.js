'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { outputRoot } = require('../scripts/build-production.js');

const knownPreexistingMissingScripts = new Set([
    'audio-prompts-db.js',
    'prezentace-prompts-db.js',
    'video-prompts-db.js'
]);

function walkHtml(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return walkHtml(fullPath);
        return path.extname(entry.name) === '.html' ? [fullPath] : [];
    });
}

function resolveLocalReference(htmlFile, reference) {
    const clean = reference.split(/[?#]/, 1)[0];
    if (!clean || /^(?:[a-z]+:|\/\/|#)/i.test(clean)) return null;
    return clean.startsWith('/')
        ? path.join(outputRoot, clean.slice(1))
        : path.resolve(path.dirname(htmlFile), clean);
}

test('production HTML script and stylesheet paths resolve, except documented baseline gaps', (context) => {
    const missing = [];
    const referencePattern = /<(script)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>|<(link)\b(?=[^>]*\brel=["']stylesheet["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;

    for (const htmlFile of walkHtml(outputRoot)) {
        const html = fs.readFileSync(htmlFile, 'utf8');
        let match;
        while ((match = referencePattern.exec(html)) !== null) {
            const reference = match[2] || match[4];
            const resolved = resolveLocalReference(htmlFile, reference);
            if (resolved && !fs.existsSync(resolved)) {
                missing.push({ htmlFile, reference, resolved });
            }
        }
    }

    const unexpected = missing.filter(({ resolved }) => {
        return !knownPreexistingMissingScripts.has(path.basename(resolved));
    });
    const known = missing.filter(({ resolved }) => {
        return knownPreexistingMissingScripts.has(path.basename(resolved));
    });

    context.diagnostic(`Known pre-existing missing prompt DB scripts: ${known.length}`);
    assert.deepEqual(unexpected, []);
});
