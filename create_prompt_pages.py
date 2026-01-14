#!/usr/bin/env python3
"""
Script to create prompt pages from infografika-prompty.html template
"""

import re

# Read the template file
template_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'
with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

# Define replacements for each page type
pages = {
    'prezentace-prompty.html': {
        'title': 'Databáze promptů - Prezentace | NotebookLM',
        'meta_description': 'Databáze promptů pro tvorbu prezentací v NotebookLM',
        'header_icon': '📽',
        'header_title': '📽 Databáze promptů pro Prezentace',
        'header_subtitle': 'připravených promptů s možností snadného kopírování a ukázkovými obrázky',
        'function_get': 'getPrezentacePromptsFromSupabase',
        'function_add': 'addPrezentacePrompt',
        'function_update': 'updatePrezentacePrompt',
        'function_delete': 'deletePrezentacePrompt',
        'fallback_var': 'PREZENTACE_PROMPTS',
        'fallback_log': 'prezentace-prompts-db.js',
        'has_images': True,
        'back_link': 'prezentace.html'
    },
    'video-prompty.html': {
        'title': 'Databáze promptů - Video přehled | NotebookLM',
        'meta_description': 'Databáze promptů pro tvorbu video přehledů v NotebookLM',
        'header_icon': '🎥',
        'header_title': '🎥 Databáze promptů pro Video přehled',
        'header_subtitle': 'připravených promptů s možností snadného kopírování a ukázkovými obrázky',
        'function_get': 'getVideoPromptsFromSupabase',
        'function_add': 'addVideoPrompt',
        'function_update': 'updateVideoPrompt',
        'function_delete': 'deleteVideoPrompt',
        'fallback_var': 'VIDEO_PROMPTS',
        'fallback_log': 'video-prompts-db.js',
        'has_images': True,
        'back_link': 'video-prehled.html'
    },
    'audio-prompty.html': {
        'title': 'Databáze promptů - Audio přehled | NotebookLM',
        'meta_description': 'Databáze promptů pro tvorbu audio přehledů v NotebookLM',
        'header_icon': '🎧',
        'header_title': '🎧 Databáze promptů pro Audio přehled',
        'header_subtitle': 'připravených promptů s možností snadného kopírování',
        'function_get': 'getAudioPromptsFromSupabase',
        'function_add': 'addAudioPrompt',
        'function_update': 'updateAudioPrompt',
        'function_delete': 'deleteAudioPrompt',
        'fallback_var': 'AUDIO_PROMPTS',
        'fallback_log': 'audio-prompts-db.js',
        'has_images': False,  # Audio doesn't have images
        'back_link': 'audio-prehled.html'
    }
}

output_dir = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules'

for filename, config in pages.items():
    print(f"Creating {filename}...")
    
    content = template
    
    # Replace title
    content = re.sub(
        r'<title>.*?</title>',
        f'<title>{config["title"]}</title>',
        content
    )
    
    # Replace meta description
    content = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{config["meta_description"]}">',
        content
    )
    
    # Replace header title (the H1)
    content = re.sub(
        r'&#127912; Databáze promptů pro Infografiku',
        config['header_title'],
        content
    )
    
    # Replace header subtitle
    content = re.sub(
        r'33 připravených promptů s možností snadného kopírování a ukázkovými obrázky',
        config['header_subtitle'],
        content
    )
    
    # Replace function calls
    content = content.replace('getInfografikaPromptsFromSupabase', config['function_get'])
    content = content.replace('addInfografikaPrompt', config['function_add'])
    content = content.replace('updateInfografikaPrompt', config['function_update'])
    content = content.replace('deleteInfografikaPrompt', config['function_delete'])
    
    # Replace fallback variable
    content = content.replace('INFOGRAFIKA_PROMPTS', config['fallback_var'])
    
    # Replace fallback log message
    content = content.replace('infografika-prompts-db.js', config['fallback_log'])
    
    # Replace back link in sticky nav (link to parent module page)
    # The infografika has "infografika.html" as the back link, we need to update this
    content = content.replace('href="infografika.html"', f'href="{config["back_link"]}"')
    
    # For audio page, remove image-related functionality
    if not config['has_images']:
        # Remove the image toggle button from cards
        # This is complex, so we'll just hide it via CSS
        # Add a style to hide image buttons
        style_addition = '''
        /* Hide image buttons for audio (no images) */
        .btn-toggle-examples,
        .examples-gallery,
        .upload-area-inline,
        #prompt-upload-area,
        #prompt-upload-preview,
        #prompt-upload-status {
            display: none !important;
        }
'''
        # Insert the style before </style>
        content = content.replace('</style>', style_addition + '</style>', 1)
    
    # Save the new file
    output_path = f'{output_dir}\\{filename}'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Created: {output_path}")

print("\nDone! All pages created successfully.")
