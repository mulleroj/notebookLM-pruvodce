'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
    moduleFiles,
    outputRoot,
    projectRoot,
    rootFiles
} = require('../scripts/build-production.js');

const forbiddenPaths = [
    'setup-cors.html',
    'test-supabase-connection.html',
    'test-cors.js',
    'icon-review.html',
    'debug_output.txt',
    path.join('modules', 'audio-prompty-backup.html'),
    path.join('modules', '_template_admin_changes.html')
];

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(fullPath) : [fullPath];
    });
}

test('production allowlist contains every declared public page and asset', () => {
    rootFiles.forEach((file) => assert.ok(fs.existsSync(path.join(outputRoot, file)), file));
    moduleFiles.forEach((file) => {
        assert.ok(fs.existsSync(path.join(outputRoot, 'modules', file)), file);
    });
    assert.ok(fs.existsSync(path.join(outputRoot, 'assets', 'icons', 'special', 'logo.png')));
    assert.ok(fs.existsSync(path.join(outputRoot, 'novinky', 'roadmap-2026.html')));
});

test('diagnostic, backup and development files are absent from publish output', () => {
    forbiddenPaths.forEach((file) => {
        assert.equal(fs.existsSync(path.join(outputRoot, file)), false, file);
    });

    const forbiddenExtensions = new Set(['.log', '.md', '.ps1', '.py', '.txt']);
    const leaked = walk(outputRoot).filter((file) => forbiddenExtensions.has(path.extname(file)));
    assert.deepEqual(leaked, []);
});

test('active production JavaScript contains no localhost ingest request', () => {
    const offenders = walk(outputRoot)
        .filter((file) => path.extname(file) === '.js')
        .filter((file) => fs.readFileSync(file, 'utf8').includes('127.0.0.1:7242'));

    assert.deepEqual(offenders, []);
});

test('Netlify publishes dist, revalidates unhashed assets and sets security headers', () => {
    const config = fs.readFileSync(path.join(projectRoot, 'netlify.toml'), 'utf8');

    assert.match(config, /publish\s*=\s*"dist"/);
    assert.doesNotMatch(config, /publish\s*=\s*"\."/);
    assert.doesNotMatch(config, /immutable/);
    assert.match(config, /Permissions-Policy/);
    assert.match(config, /Content-Security-Policy-Report-Only/);
    assert.match(config, /to\s*=\s*"\/404\.html"/);
    assert.match(config, /status\s*=\s*404/);
});

test('production HTML cache-busts security-sensitive JavaScript', () => {
    const expectedReferences = new Map([
        ['chatbot.js', '/chatbot.js?v=m0b1'],
        ['supabase-config.js', '/supabase-config.js?v=m0b1']
    ]);
    const references = [];
    const invalid = [];

    for (const htmlFile of walk(outputRoot).filter((file) => path.extname(file) === '.html')) {
        const html = fs.readFileSync(htmlFile, 'utf8');
        const scriptPattern = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
        let match;

        while ((match = scriptPattern.exec(html)) !== null) {
            const reference = match[1];
            const pathname = reference.split(/[?#]/, 1)[0];
            const filename = path.posix.basename(pathname.replace(/\\/g, '/'));
            const expected = expectedReferences.get(filename);

            if (!expected) continue;
            references.push({ htmlFile, reference });
            if (reference !== expected) {
                invalid.push({ htmlFile, reference, expected });
            }
        }
    }

    assert.ok(references.some(({ reference }) => reference === expectedReferences.get('chatbot.js')));
    assert.ok(references.some(({ reference }) => reference === expectedReferences.get('supabase-config.js')));
    assert.deepEqual(invalid, []);
});
