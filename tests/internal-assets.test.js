'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { outputRoot } = require('../scripts/build-production.js');

function walkHtml(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return walkHtml(fullPath);
        return path.extname(entry.name) === '.html' ? [fullPath] : [];
    });
}

function resolveLocalReference(htmlFile, reference) {
    if (!reference || reference.includes('${')) return null;
    if (/^(?:[a-z]+:|\/\/)/i.test(reference)) return null;
    if (reference === '#') return null;

    const clean = reference.split(/[?#]/, 1)[0];
    if (!clean) return htmlFile;

    return clean.startsWith('/')
        ? path.join(outputRoot, clean.slice(1))
        : path.resolve(path.dirname(htmlFile), clean);
}

function extractFragment(reference) {
    if (!reference || reference.includes('${')) return null;
    const hashIndex = reference.indexOf('#');
    if (hashIndex === -1) return null;

    const fragment = reference.slice(hashIndex + 1).split(/[?&]/, 1)[0];
    return fragment ? decodeURIComponent(fragment) : null;
}

function htmlIds(html) {
    return new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
}

test('production local href, fragment, script, stylesheet and image references resolve', () => {
    const missingFiles = [];
    const missingFragments = [];
    const checkedFiles = new Map();

    const referencePattern = /<(a)\b[^>]*\bhref=["']([^"']+)["'][^>]*>|<(script)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>|<(link)\b(?=[^>]*\brel=["']stylesheet["'])[^>]*\bhref=["']([^"']+)["'][^>]*>|<(img)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;

    for (const htmlFile of walkHtml(outputRoot)) {
        const html = fs.readFileSync(htmlFile, 'utf8');
        let match;

        while ((match = referencePattern.exec(html)) !== null) {
            const tagName = match[1] || match[3] || match[5] || match[7];
            const reference = match[2] || match[4] || match[6] || match[8];
            const resolved = resolveLocalReference(htmlFile, reference);

            if (!resolved) continue;

            if (!fs.existsSync(resolved)) {
                missingFiles.push({ htmlFile, tagName, reference, resolved });
                continue;
            }

            const fragment = extractFragment(reference);
            if (!fragment) continue;

            if (path.extname(resolved).toLowerCase() !== '.html') continue;

            let ids = checkedFiles.get(resolved);
            if (!ids) {
                ids = htmlIds(fs.readFileSync(resolved, 'utf8'));
                checkedFiles.set(resolved, ids);
            }

            if (!ids.has(fragment)) {
                missingFragments.push({ htmlFile, reference, resolved, fragment });
            }
        }
    }

    assert.deepEqual(missingFiles, []);
    assert.deepEqual(missingFragments, []);
});
