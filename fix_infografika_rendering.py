#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix corrupted characters and add optimized rendering functions to infografika-prompty.html
"""

import re

# Read the file
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix corrupted characters
fixes = [
    # Line 1402-1403: Fix broken alert with newline
    (r"alert\('➕\r?\n Prompt přidán! Stránka se obnoví!'\);", "alert('✅ Prompt přidán! Stránka se obnoví!');"),
    
    # Line 1470: Fix loading message
    (r'<p class="loading">➕ł Načítám prompty z databáze\.\.\.</p>', '<p class="loading">⏳ Načítám prompty z databáze...</p>'),
    
    # Line 1490: Fix category filter
    (r'<option value="Vťechny">🎓 Vťechny kategorie</option>', '<option value="Všechny">🎓 Všechny kategorie</option>'),
    
    # Line 1610: Fix button icon
    (r'🎓ź', '🖼️'),
    
    # Line 1622: Fix "no examples" text
    (r'Zatím žádn×Š ukázky', 'Zatím žádné ukázky'),
]

for pattern, replacement in fixes:
    content = re.sub(pattern, replacement, content)

# Find the position to insert new functions (right before the old createPromptCard function)
insert_marker = '                // Create prompt card element\n                async function createPromptCard(prompt) {'

new_functions = '''                // Create prompt card element synchronously (without waiting for images)
                function createPromptCardSync(prompt) {
                    const card = document.createElement('div');
                    card.className = 'prompt-card';
                    card.dataset.promptId = prompt.id;

                    card.innerHTML = `
                <div class="prompt-card-header">
                    <span class="prompt-icon">${prompt.icon}</span>
                    <span class="prompt-number">#${prompt.number}</span>
                </div>
                <h3 class="prompt-title">${prompt.title}</h3>
                <span class="prompt-category">${prompt.category}</span>
                <div class="prompt-text">${prompt.prompt}</div>
                <div class="prompt-actions">
                    <button class="btn-copy" onclick="handleCopy('${prompt.id}', this)">
                        📋 Zkopírovat prompt
                    </button>
                </div>
                <div class="examples-gallery" id="examples-${prompt.id}">
                    <div class="no-examples">Načítám ukázky...</div>
                </div>
            `;

                    return card;
                }

                // Load images for all prompts in parallel (async, non-blocking)
                async function loadImagesForAllPrompts(prompts) {
                    // Load all images in parallel
                    const imagePromises = prompts.map(async (prompt) => {
                        try {
                            const imageData = await getPromptExamples(prompt.id);
                            if (imageData) {
                                updateCardWithImage(prompt.id, imageData);
                            } else {
                                updateCardNoImage(prompt.id);
                            }
                        } catch (error) {
                            console.error(`Error loading image for ${prompt.id}:`, error);
                            updateCardNoImage(prompt.id);
                        }
                    });

                    // Wait for all images to load (but don't block rendering)
                    await Promise.all(imagePromises);
                }

                // Update card with loaded image
                function updateCardWithImage(promptId, imageData) {
                    const gallery = document.getElementById(`examples-${promptId}`);
                    if (!gallery) return;

                    const card = document.querySelector(`[data-prompt-id="${promptId}"]`);
                    if (!card) return;

                    // Add toggle button to actions
                    const actionsDiv = card.querySelector('.prompt-actions');
                    if (actionsDiv && !actionsDiv.querySelector('.btn-toggle-examples')) {
                        const toggleBtn = document.createElement('button');
                        toggleBtn.className = 'btn-toggle-examples';
                        toggleBtn.onclick = () => toggleExamples(promptId);
                        toggleBtn.innerHTML = '🖼️ 1';
                        actionsDiv.appendChild(toggleBtn);
                    }

                    // Update gallery with image
                    gallery.innerHTML = `
                        <img src="${imageData}" 
                             alt="Příklad" 
                             class="example-image"
                             onclick="openImagePreview('${imageData}')">
                    `;
                }

                // Update card when no image is available
                function updateCardNoImage(promptId) {
                    const gallery = document.getElementById(`examples-${promptId}`);
                    if (!gallery) return;

                    gallery.innerHTML = '<div class="no-examples">Zatím žádné ukázky</div>';
                }

                '''

# Insert new functions before the old createPromptCard
content = content.replace(insert_marker, new_functions + insert_marker)

# Also fix the old createPromptCard to use correct icons
content = content.replace('🎓 Zkopírovat prompt', '📋 Zkopírovat prompt')
content = content.replace('🎓ź', '🖼️')

# Write the fixed content
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed corrupted characters and added optimized rendering functions!")
print("   - Fixed broken alert message (line 1402-1403)")
print("   - Fixed loading message (line 1470)")
print("   - Fixed category filter (line 1490)")
print("   - Fixed button icons (line 1610)")
print("   - Fixed 'no examples' text (line 1622)")
print("   - Added createPromptCardSync() function")
print("   - Added loadImagesForAllPrompts() function")
print("   - Added updateCardWithImage() function")
print("   - Added updateCardNoImage() function")
