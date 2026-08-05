'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { renderAuditedContent } = require('./render-audited-content.js');

const projectRoot = path.resolve(__dirname, '..');
const outputRoot = path.join(projectRoot, 'dist');

const rootFiles = [
    '404.html',
    'agentni-funkce.html',
    'chatbot.css',
    'chatbot.js',
    'chatbot-knowledge.js',
    'formular.html',
    'index.html',
    'infografika-prompts-db.js',
    'jak-zacit.html',
    'novinky.html',
    'prompts.js',
    'script.js',
    'sidebar.css',
    'sidebar.js',
    'spu-adhd.html',
    'style.css',
    'styles.css',
    'supabase-config.js',
    'troubleshooting.html',
    'use-cases.html'
];

const moduleFiles = [
    'audio-prehled.html',
    'audio-prompty.html',
    'chat-prompty.html',
    'infografika.html',
    'infografika-prompty.html',
    'infografika-styly.html',
    'karticky.html',
    'myslenkova-mapa.html',
    'prezentace.html',
    'prezentace-prompty.html',
    'quiz.html',
    'tabulka-dat.html',
    'video-prehled.html',
    'video-prompty.html',
    'zpravy-prehled.html'
];

const directoryAllowlist = ['assets', 'novinky'];

function assertInsideProject(targetPath) {
    const resolved = path.resolve(targetPath);
    if (resolved !== projectRoot && !resolved.startsWith(`${projectRoot}${path.sep}`)) {
        throw new Error(`Refusing to operate outside the project: ${resolved}`);
    }
}

function copyFile(relativePath) {
    const source = path.join(projectRoot, relativePath);
    const destination = path.join(outputRoot, relativePath);

    if (!fs.statSync(source).isFile()) {
        throw new Error(`Allowlisted source is not a file: ${relativePath}`);
    }

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    if (path.extname(source) === '.html') {
        fs.writeFileSync(destination, renderAuditedContent(relativePath.replace(/\\/g, '/'), fs.readFileSync(source, 'utf8')));
    } else {
        fs.copyFileSync(source, destination);
    }
}

function copyDirectory(relativePath) {
    const source = path.join(projectRoot, relativePath);
    const destination = path.join(outputRoot, relativePath);

    if (!fs.statSync(source).isDirectory()) {
        throw new Error(`Allowlisted source is not a directory: ${relativePath}`);
    }

    fs.cpSync(source, destination, { recursive: true, force: true });
    renderHtmlFilesInDirectory(destination, relativePath);
}

function renderHtmlFilesInDirectory(directory, relativePrefix) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
        const absolutePath = path.join(directory, entry.name);
        const relativePath = path.join(relativePrefix, entry.name);
        if (entry.isDirectory()) {
            renderHtmlFilesInDirectory(absolutePath, relativePath);
            return;
        }
        if (path.extname(entry.name) === '.html') {
            fs.writeFileSync(absolutePath, renderAuditedContent(relativePath.replace(/\\/g, '/'), fs.readFileSync(absolutePath, 'utf8')));
        }
    });
}

function countFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).reduce((count, entry) => {
        const fullPath = path.join(directory, entry.name);
        return count + (entry.isDirectory() ? countFiles(fullPath) : 1);
    }, 0);
}

function contentHash(relativePath) {
    return crypto.createHash('sha256')
        .update(fs.readFileSync(path.join(projectRoot, relativePath)))
        .digest('hex')
        .slice(0, 12);
}

function chatbotAssetVersions() {
    return {
        knowledge: contentHash('chatbot-knowledge.js'),
        chatbot: contentHash('chatbot.js')
    };
}

function versionChatbotAssets(directory, versions) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            versionChatbotAssets(absolutePath, versions);
            return;
        }
        if (path.extname(entry.name) !== '.html') return;

        const html = fs.readFileSync(absolutePath, 'utf8')
            .replace(/(src=["'][^"']*chatbot-knowledge\.js)(?:\?[^"']*)?(["'])/gi, `$1?v=${versions.knowledge}$2`)
            .replace(/(src=["'][^"']*chatbot\.js)(?:\?[^"']*)?(["'])/gi, `$1?v=${versions.chatbot}$2`);
        fs.writeFileSync(absolutePath, html);
    });
}

function buildProduction() {
    assertInsideProject(outputRoot);
    fs.rmSync(outputRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    fs.mkdirSync(outputRoot, { recursive: true });

    rootFiles.forEach(copyFile);
    moduleFiles.forEach((file) => copyFile(path.join('modules', file)));
    directoryAllowlist.forEach(copyDirectory);
    versionChatbotAssets(outputRoot, chatbotAssetVersions());

    const fileCount = countFiles(outputRoot);
    process.stdout.write(`Production allowlist built: ${fileCount} files in dist\n`);
}

if (require.main === module) {
    buildProduction();
}

module.exports = {
    buildProduction,
    directoryAllowlist,
    chatbotAssetVersions,
    moduleFiles,
    outputRoot,
    projectRoot,
    rootFiles
};
