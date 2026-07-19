'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const { buildProduction, moduleFiles, outputRoot } = require('../scripts/build-production.js');

const publicPaths = [
    '/',
    '/jak-zacit.html',
    '/use-cases.html',
    '/troubleshooting.html',
    '/spu-adhd.html',
    '/novinky.html',
    ...moduleFiles.map((file) => `/modules/${file}`),
    '/styles.css',
    '/sidebar.css',
    '/chatbot.css',
    '/script.js',
    '/sidebar.js',
    '/chatbot.js',
    '/supabase-config.js'
];

const privatePaths = [
    '/setup-cors.html',
    '/test-supabase-connection.html',
    '/test-cors.js',
    '/icon-review.html',
    '/debug_output.txt',
    '/modules/audio-prompty-backup.html',
    '/modules/_template_admin_changes.html'
];

function contentType(filePath) {
    const extension = path.extname(filePath);
    if (extension === '.html') return 'text/html; charset=utf-8';
    if (extension === '.css') return 'text/css; charset=utf-8';
    if (extension === '.js') return 'application/javascript; charset=utf-8';
    return 'application/octet-stream';
}

function createServer() {
    return http.createServer((request, response) => {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
        const candidate = path.resolve(outputRoot, relative);
        const insideOutput = candidate.startsWith(`${path.resolve(outputRoot)}${path.sep}`);

        if (insideOutput && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            response.writeHead(200, { 'Content-Type': contentType(candidate) });
            fs.createReadStream(candidate).pipe(response);
            return;
        }

        const notFound = path.join(outputRoot, '404.html');
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(notFound).pipe(response);
    });
}

function request(port, pathname) {
    return new Promise((resolve, reject) => {
        http.get({ hostname: '127.0.0.1', port, path: pathname }, (response) => {
            response.resume();
            response.on('end', () => resolve(response.statusCode));
        }).on('error', reject);
    });
}

async function main() {
    buildProduction();
    const server = createServer();
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();

    try {
        for (const pathname of publicPaths) {
            assert.equal(await request(port, pathname), 200, pathname);
        }
        for (const pathname of privatePaths) {
            assert.equal(await request(port, pathname), 404, pathname);
        }
        process.stdout.write(`HTTP smoke passed: ${publicPaths.length} public and ${privatePaths.length} private paths\n`);
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
