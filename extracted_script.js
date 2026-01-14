
                // === AUTH STATE MANAGEMENT ===
                let currentAdmin = null;

                // Initialize on page load - now with auth check
                document.addEventListener('DOMContentLoaded', async () => {
                    await checkAuthState();
                    initializeDatabase();
                    initializeAdminPanel();
                });

                // Check and update auth state
                async function checkAuthState() {
                    const user = await getCurrentUser();
                    currentAdmin = (user && isAdmin(user)) ? user : null;
                    updateUIForAuthState();
                }

                // Listen for auth state changes (logout/login)
                onAuthStateChange((event, session) => {
                    console.log('Auth state changed:', event);

                    if (event === 'SIGNED_OUT') {
                        console.log('User signed out - updating UI');
                        currentAdmin = null;
                        updateUIForAuthState();
                    } else if (event === 'SIGNED_IN' && session) {
                        console.log('User signed in - checking admin status');
                        checkAuthState();
                    }
                });

                // Update UI based on login state
                function updateUIForAuthState() {
                    const buttonText = document.getElementById('admin-button-text');

                    if (currentAdmin) {
                        buttonText.innerHTML = ' Admin | Odhlásit';
                        showAdminControls();
                    } else {
                        buttonText.innerHTML = '🔒 Přihlásit';
                        hideAdminControls();
                    }
                }

                // Handle admin button click
                function handleAdminButtonClick() {
                    if (currentAdmin) {
                        handleLogout();
                    } else {
                        openLoginModal();
                    }
                }

                // === LOGIN FUNCTIONS ===

                function openLoginModal() {
                    document.getElementById('login-modal').classList.add('visible');
                    document.getElementById('login-email').value = '';
                    document.getElementById('login-password').value = '';
                    document.getElementById('login-error').style.display = 'none';
                }

                function closeLoginModal() {
                    document.getElementById('login-modal').classList.remove('visible');
                }

                async function handleLogin() {
                    const email = document.getElementById('login-email').value;
                    const password = document.getElementById('login-password').value;
                    const errorDiv = document.getElementById('login-error');

                    if (!email || !password) {
                        errorDiv.textContent = '⚠ Vyplňte email i heslo';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    const result = await loginWithEmail(email, password);

                    if (result.success) {
                        currentAdmin = result.user;
                        closeLoginModal();
                        updateUIForAuthState();
                        alert(' Úspěšně přihlášen jako admin!');
                    } else {
                        errorDiv.textContent = `❌ ${result.error}`;
                        errorDiv.style.display = 'block';
                    }
                }

                async function handleLogout() {
                    // Show custom logout confirmation modal instead of confirm()
                    showLogoutConfirmation();
                }

                // Show logout confirmation dialog
                function showLogoutConfirmation() {
                    const modal = document.createElement('div');
                    modal.className = 'modal visible';
                    modal.style.zIndex = '10000'; // Ensure it's on top
                    modal.innerHTML = `
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2>🚪 Odhlášení</h2>
                    </div>
                    <div style="padding: 1.5rem; text-align: center;">
                        <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">Opravdu se chcete odhlásit?</p>
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <button id="confirm-logout-btn" class="btn-copy" style="flex: 1; max-width: 150px;">
                                 Ano, odhlásit
                            </button>
                            <button id="cancel-logout-btn" class="btn-toggle-examples" style="flex: 1; max-width: 150px;">
                                ❌ Zrušit
                            </button>
                        </div>
                    </div>
                </div>
            `;
                    document.body.appendChild(modal);

                    // Cancel button
                    document.getElementById('cancel-logout-btn').onclick = () => {
                        document.body.removeChild(modal);
                    };

                    // Confirm button
                    document.getElementById('confirm-logout-btn').onclick = async () => {
                        document.body.removeChild(modal);
                        await performLogout();
                    };

                    // Close on background click
                    modal.onclick = (e) => {
                        if (e.target === modal) {
                            document.body.removeChild(modal);
                        }
                    };
                }

                // Perform the actual logout
                async function performLogout() {
                    try {
                        const result = await logout();

                        if (result && !result.success) {
                            showMessage(`❌ Chyba při odhláťení: ${result.error}`, 'error');
                            return;
                        }

                        // Clear local admin state
                        currentAdmin = null;

                        // Update UI immediately
                        updateUIForAuthState();

                        // Show success message
                        showMessage('👋 Úspěšně odhlášen', 'success');

                        // Reload page to ensure completely clean state
                        setTimeout(() => location.reload(), 1000);

                    } catch (error) {
                        console.error('Logout error:', error);
                        showMessage('❌ Chyba při odhláťení', 'error');
                    }
                }

                // Show custom message (replaces alert())
                function showMessage(message, type = 'info') {
                    const modal = document.createElement('div');
                    modal.className = 'modal visible';
                    modal.style.zIndex = '10000';
                    const bgColor = type === 'error' ? '#fff5f5' : type === 'success' ? '#f0fdf4' : '#f7fafc';
                    const borderColor = type === 'error' ? '#feb2b2' : type === 'success' ? '#86efac' : '#cbd5e0';
                    const textColor = type === 'error' ? '#c53030' : type === 'success' ? '#065f46' : '#2d3748';

                    modal.innerHTML = `
                <div class="modal-content" style="max-width: 400px;">
                    <div style="padding: 1.5rem; text-align: center; background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 8px;">
                        <p style="font-size: 1.1rem; margin: 0; color: ${textColor};">${message}</p>
                    </div>
                </div>
            `;
                    document.body.appendChild(modal);

                    // Auto-close after 2 seconds
                    setTimeout(() => {
                        if (document.body.contains(modal)) {
                            document.body.removeChild(modal);
                        }
                    }, 2000);

                    // Allow manual close
                    modal.onclick = () => {
                        if (document.body.contains(modal)) {
                            document.body.removeChild(modal);
                        }
                    };
                }


                // === ADMIN UI CONTROLS ===

                function showAdminControls() {
                    // Add edit/delete buttons to all prompt cards
                    const cards = document.querySelectorAll('.prompt-card');
                    cards.forEach(card => {
                        if (!card.querySelector('.admin-controls')) {
                            const promptId = card.dataset.promptId;
                            const controls = document.createElement('div');
                            controls.className = 'admin-controls';
                            controls.innerHTML = `
                        <div class="custom-prompt-actions" style="margin-top: 1rem;">
                            <button class="btn-edit" onclick="editPrompt('${promptId}')"> Upravit</button>
                            <button class="btn-delete" onclick="deletePrompt('${promptId}')">🗑 Smazat</button>
                        </div>
                    `;
                            card.appendChild(controls);
                        }
                    });

                    // Show "Add prompt" button in header
                    const header = document.querySelector('.prompt-database-header .container');
                    if (!document.getElementById('add-prompt-btn')) {
                        const addBtn = document.createElement('button');
                        addBtn.id = 'add-prompt-btn';
                        addBtn.className = 'btn-copy';
                        addBtn.style.cssText = 'margin-top: 1rem;';
                        addBtn.innerHTML = ' Přidat nový prompt';
                        addBtn.onclick = showAddPromptForm;
                        header.appendChild(addBtn);
                    }
                }

                function hideAdminControls() {
                    document.querySelectorAll('.admin-controls').forEach(el => el.remove());
                    const addBtn = document.getElementById('add-prompt-btn');
                    if (addBtn) addBtn.remove();
                }

                // === CRUD FUNCTIONS ===

                function showAddPromptForm() {
                    // Get the modal element and make it visible
                    const modal = document.getElementById('admin-modal');
                    modal.style.display = 'flex';  // Make modal visible
                    modal.classList.add('visible');

                    // Switch to prompts tab
                    switchAdminTab('prompts');

                    // Show the form and reset fields
                    document.getElementById('form-title').textContent = 'Nový prompt';
                    document.getElementById('edit-prompt-id').value = '';
                    document.getElementById('edit-prompt-id').removeAttribute('data-number');
                    document.getElementById('prompt-title').value = '';
                    document.getElementById('prompt-category').value = 'Základní';
                    document.getElementById('prompt-icon').value = '';
                    document.getElementById('prompt-text').value = '';

                    // Clear image preview and file input
                    const imageInput = document.getElementById('prompt-image-file');
                    const previewDiv = document.getElementById('prompt-upload-preview');
                    const statusDiv = document.getElementById('prompt-upload-status');

                    if (imageInput) imageInput.value = '';
                    if (previewDiv) previewDiv.innerHTML = '';
                    if (statusDiv) statusDiv.textContent = '';

                    document.getElementById('prompt-form').style.display = 'block';
                }

                async function addNewPrompt(promptData) {
                    const result = await addInfografikaPrompt(promptData);

                    if (result.success) {
                        alert('✅ Prompt přidán! Stránka se obnoví!');
                location.reload();
                    } else {
                        alert('❌ Chyba: ' + result.error);
                    }
                }

                async function editPrompt(promptId) {
                    const promptToEdit = window.currentPrompts?.find(p => p.id === promptId);
                    if (!promptToEdit) {
                        alert('❌ Prompt nenalezen');
                        return;
                    }

                    // Open admin modal and switch to prompts tab
                    document.getElementById('admin-modal').classList.add('visible');
                    switchAdminTab('prompts');

                    // Populate the form with existing data
                    document.getElementById('form-title').textContent = 'Upravit prompt';
                    const editIdField = document.getElementById('edit-prompt-id');
                    editIdField.value = promptToEdit.id;
                    editIdField.dataset.number = promptToEdit.number; // Store number for update
                    document.getElementById('prompt-title').value = promptToEdit.title;
                    document.getElementById('prompt-category').value = promptToEdit.category;
                    document.getElementById('prompt-icon').value = promptToEdit.icon;
                    document.getElementById('prompt-text').value = promptToEdit.prompt;
                    document.getElementById('prompt-form').style.display = 'block';
                }

                async function deletePrompt(promptId) {
                    if (!confirm('Opravdu smazat tento prompt?')) return;

                    const result = await deleteInfografikaPrompt(promptId);

                    if (result.success) {
                        alert(' Prompt smazán! Stránka se obnoví...');
                        location.reload();
                    } else {
                        alert('❌ Chyba: ' + result.error);
                    }
                }

                // === MODAL CONTROLS ===

                function closeAdminModal() {
                    const modal = document.getElementById('admin-modal');
                    modal.style.display = 'none';
                    modal.classList.remove('visible');
                    // Also hide the prompt form
                    document.getElementById('prompt-form').style.display = 'none';
                }

                function closeLoginModal() {
                    const modal = document.getElementById('login-modal');
                    modal.style.display = 'none';
                    modal.classList.remove('visible');
                }


                // Initialize database and display prompts
                async function initializeDatabase() {
                    // Initialize Supabase
                    initSupabase();

                    // Show loading indicator
                    const container = document.getElementById('prompts-container');
                    container.innerHTML = '\u003cp class="loading"\u003eł Načítám prompty z databáze...\u003c/p\u003e';

                    // Try to load from Supabase first
                    let prompts = await getInfografikaPromptsFromSupabase();

                    // Fallback to local data if Supabase fails
                    if (!prompts || prompts.length === 0) {
                        console.log('Using local infografika-prompts-db.js as fallback');
                        prompts = INFOGRAFIKA_PROMPTS; // From infografika-prompts-db.js
                    } else {
                        console.log(`
 Loaded ${prompts.length} prompts from Supabase`);
                    }

                    // Store prompts globally for search/filter
                    window.currentPrompts = prompts;

                    // Get and populate categories
                    const categories = [...new Set(prompts.map(p => p.category))].sort();
                    const categoryFilter = document.getElementById('category-filter');
                    categoryFilter.innerHTML = '\u003coption value="Vťechny"\u003e🎓 Vťechny kategorie\u003c/option\u003e';
                    categories.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat;
                        option.textContent = `🎓 ${cat}`;
                        categoryFilter.appendChild(option);
                    });

                    // Update total prompts stat
                    document.getElementById('total-prompts').textContent = prompts.length;

                    // Display all prompts initially
                    displayPrompts(prompts);

                    // Setup event listeners
                    document.getElementById('search-input').addEventListener('input', handleSearch);
                    document.getElementById('category-filter').addEventListener('change', handleFilter);
                }

                // Display prompts grouped by category - OPTIMIZED for fast rendering
                async function displayPrompts(prompts) {
                    const container = document.getElementById('prompts-container');
                    const noResults = document.getElementById('no-results');

                    if (prompts.length === 0) {
                        container.style.display = 'none';
                        noResults.style.display = 'block';
                        return;
                    }

                    container.style.display = 'block';
                    noResults.style.display = 'none';
                    container.innerHTML = '';

                    // Group prompts by category
                    const grouped = {};
                    prompts.forEach(prompt => {
                        if (!grouped[prompt.category]) {
                            grouped[prompt.category] = [];
                        }
                        grouped[prompt.category].push(prompt);
                    });

                    // Sort categories alphabetically
                    const sortedCategories = Object.keys(grouped).sort();

                    // Create sections for each category
                    for (const category of sortedCategories) {
                        const categoryPrompts = grouped[category];

                        // Create category section
                        const section = document.createElement('div');
                        section.className = 'category-section';
                        section.id = `category-${category.replace(/\s+/g, '-').toLowerCase()}`;

                        // Create category header
                        const header = document.createElement('div');
                        header.className = 'category-header';

                        // Get icon from first prompt in category
                        const icon = categoryPrompts[0].icon || '🎓';

                        header.innerHTML = `
                    <span class="category-icon">${icon}</span>
                    <h2 class="category-title">${category}</h2>
                    <span class="category-count">(${categoryPrompts.length})</span>
                `;
                        section.appendChild(header);

                        // Create grid for prompts in this category
                        const grid = document.createElement('div');
                        grid.className = 'prompts-grid';

                        // OPTIMIZATION: Create all cards synchronously first (no await)
                        for (const prompt of categoryPrompts) {
                            const card = createPromptCardSync(prompt);
                            grid.appendChild(card);
                        }

                        section.appendChild(grid);
                        container.appendChild(section);
                    }

                    // Update stats - always show total since we're not filtering
                    document.getElementById('visible-prompts').textContent = prompts.length;

                    // IMPORTANT: Re-apply admin controls after cards are rendered
                    if (currentAdmin) {
                        showAdminControls();
                    }

                    // OPTIMIZATION: Load images in parallel AFTER cards are visible
                    loadImagesForAllPrompts(prompts);
                }

                // Create prompt card element synchronously (without waiting for images)
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
                        toggleBtn.innerHTML = '🖼 1';
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

                                // Create prompt card element
                async function createPromptCard(prompt) {
                    const card = document.createElement('div');
                    card.className = 'prompt-card';
                    card.dataset.promptId = prompt.id;

                    // Fetch image for this prompt (now returns single base64 string or null)
                    const imageData = await getPromptExamples(prompt.id);
                    // Convert single string to array format for compatibility
                    const examples = imageData ? [{ image_url: imageData, title: 'Příklad' }] : [];

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
                        🎓 Zkopírovat prompt
                    </button>
                    ${examples.length > 0 ? `
                        <button class="btn-toggle-examples" onclick="toggleExamples('${prompt.id}')">
                            🎓ź ${examples.length}
                        </button>
                    ` : ''}
                </div>
                <div class="examples-gallery" id="examples-${prompt.id}">
                    ${examples.length > 0 ?
                            examples.map(ex => `
                            <img src="${ex.image_url}" 
                                 alt="${ex.title || 'Příklad'}" 
                                 class="example-image"
                                 onclick="openImagePreview('${ex.image_url}')">
                        `).join('') :
                            '<div class="no-examples">Zatím žádné ukázky</div>'
                        }
                </div>
            `;

                    return card;
                }

                // Handle copy button click
                async function handleCopy(promptId, button) {
                    try {
                        // Find prompt in current prompts
                        const prompt = window.currentPrompts?.find(p => p.id === promptId);
                        if (!prompt) {
                            throw new Error('Prompt nenalezen');
                        }

                        // Copy to clipboard
                        await navigator.clipboard.writeText(prompt.prompt);

                        // Visual feedback
                        const originalText = button.innerHTML;
                        button.innerHTML = ' Zkopírováno!';
                        button.classList.add('copied');

                        setTimeout(() => {
                            button.innerHTML = originalText;
                            button.classList.remove('copied');
                        }, 2000);

                    } catch (error) {
                        console.error('Chyba při kopírování:', error);
                        alert('Chyba při kopírování: ' + error.message);
                    }
                }

                // Toggle examples visibility
                function toggleExamples(promptId) {
                    const gallery = document.getElementById(`examples-${promptId}`);
                    gallery.classList.toggle('visible');
                }

                // Handle search - scroll to first match and highlight
                function handleSearch(e) {
                    const keyword = e.target.value.toLowerCase().trim();

                    // Remove previous highlights
                    document.querySelectorAll('.prompt-card').forEach(card => {
                        card.classList.remove('highlight');
                    });

                    if (!keyword) return;

                    // Find first matching card
                    const cards = Array.from(document.querySelectorAll('.prompt-card'));
                    const match = cards.find(card => {
                        const title = card.querySelector('.prompt-title')?.textContent.toLowerCase() || '';
                        const text = card.querySelector('.prompt-text')?.textContent.toLowerCase() || '';
                        const category = card.querySelector('.prompt-category')?.textContent.toLowerCase() || '';
                        return title.includes(keyword) || text.includes(keyword) || category.includes(keyword);
                    });

                    if (match) {
                        match.classList.add('highlight');
                        match.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Remove highlight after animation
                        setTimeout(() => {
                            match.classList.remove('highlight');
                        }, 3000);
                    }
                }

                // Handle category filter - scroll to category section
                function handleFilter(e) {
                    const category = e.target.value;

                    // Remove highlights
                    document.querySelectorAll('.prompt-card').forEach(card => {
                        card.classList.remove('highlight');
                    });

                    // Clear search input
                    document.getElementById('search-input').value = '';

                    if (category === 'Vťechny') {
                        // Scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                    }

                    // Find category section
                    const sectionId = `category-${category.replace(/\s+/g, '-').toLowerCase()}`;
                    const section = document.getElementById(sectionId);

                    if (section) {
                        // Scroll to category with some offset for header
                        const yOffset = -80;
                        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });

                        // Briefly highlight first card in category
                        const firstCard = section.querySelector('.prompt-card');
                        if (firstCard) {
                            setTimeout(() => {
                                firstCard.classList.add('highlight');
                                setTimeout(() => firstCard.classList.remove('highlight'), 2000);
                            }, 500);
                        }
                    }
                }

                // Admin Panel Functions
                function initializeAdminPanel() {
                    const promptSelect = document.getElementById('prompt-select');
                    INFOGRAFIKA_PROMPTS.forEach(prompt => {
                        const option = document.createElement('option');
                        option.value = prompt.id;
                        option.textContent = `#${prompt.number} - ${prompt.title}`;
                        promptSelect.appendChild(option);
                    });

                    // Upload area drag & drop
                    const uploadArea = document.getElementById('upload-area');
                    const fileInput = document.getElementById('file-input');

                    uploadArea.addEventListener('click', () => fileInput.click());
                    uploadArea.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        uploadArea.classList.add('dragover');
                    });
                    uploadArea.addEventListener('dragleave', () => {
                        uploadArea.classList.remove('dragover');
                    });
                    uploadArea.addEventListener('drop', (e) => {
                        e.preventDefault();
                        uploadArea.classList.remove('dragover');
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                            handleFileUpload(files[0]);
                        }
                    });
                    fileInput.addEventListener('change', (e) => {
                        if (e.target.files.length > 0) {
                            handleFileUpload(e.target.files[0]);
                        }
                    });
                }

                async function handleFileUpload(file) {
                    const promptId = document.getElementById('prompt-select').value;
                    const statusDiv = document.getElementById('upload-status');

                    statusDiv.innerHTML = '<p class="loading">ł Nahrávám...</p>';

                    const result = await uploadPromptExample(file, promptId);

                    if (result.success) {
                        statusDiv.innerHTML = '<p style="color: #48bb78;"> Obrázek úspěšně nahrán!</p>';
                        setTimeout(() => {
                            closeAdminModal();
                            location.reload(); // Refresh to show new image
                        }, 1500);
                    } else {
                        statusDiv.innerHTML = `<p style="color: #f56565;">❌ Chyba: ${result.error}</p>`;
                    }
                }

                function openImagePreview(imageUrl) {
                    document.getElementById('preview-image').src = imageUrl;
                    document.getElementById('image-modal').classList.add('visible');
                }

                function closeImageModal() {
                    document.getElementById('image-modal').classList.remove('visible');
                }

                // ===== CUSTOM PROMPTS MANAGEMENT =====

                const CUSTOM_PROMPTS_KEY = 'infografika_custom_prompts';

                // Load custom prompts from localStorage
                function loadCustomPrompts() {
                    try {
                        const stored = localStorage.getItem(CUSTOM_PROMPTS_KEY);
                        return stored ? JSON.parse(stored) : [];
                    } catch (error) {
                        console.error('Error loading custom prompts:', error);
                        return [];
                    }
                }

                // Load custom prompts with Supabase or localStorage fallback
                async function loadAllCustomPrompts() {
                    try {
                        // Try Supabase first
                        const supabasePrompts = await getCustomPromptsFromSupabase();

                        if (supabasePrompts !== null) {
                            console.log('Loaded custom prompts from Supabase:', supabasePrompts.length);
                            return supabasePrompts;
                        }

                        // Fallback to localStorage
                        console.log('Loading custom prompts from localStorage');
                        return loadCustomPrompts();

                    } catch (error) {
                        console.error('Error loading custom prompts:', error);
                        return loadCustomPrompts(); // Fallback to localStorage
                    }
                }

                // Save custom prompts to localStorage
                function saveCustomPrompts(customPrompts) {
                    try {
                        localStorage.setItem(CUSTOM_PROMPTS_KEY, JSON.stringify(customPrompts));
                    } catch (error) {
                        console.error('Error saving custom prompts:', error);
                        alert('Chyba při ukládání: ' + error.message);
                    }
                }

                // Get all prompts (default + custom) - async version
                async function getAllPrompts() {
                    const customPrompts = await loadAllCustomPrompts();
                    return [...INFOGRAFIKA_PROMPTS, ...customPrompts];
                }

                // Switch between admin tabs
                function switchAdminTab(tabName) {
                    // Update tab buttons
                    document.querySelectorAll('.admin-tab').forEach(tab => {
                        tab.classList.remove('active');
                    });

                    // Only try to use event.target if event exists (clicked vs programmatic call)
                    if (typeof event !== 'undefined' && event.target) {
                        event.target.classList.add('active');
                    } else {
                        // Find and activate the correct tab button programmatically
                        const targetTabButton = Array.from(document.querySelectorAll('.admin-tab'))
                            .find(tab => tab.textContent.includes(tabName === 'prompts' ? 'Spravovat' : 'Nahrát'));
                        if (targetTabButton) {
                            targetTabButton.classList.add('active');
                        }
                    }

                    // Update tab content
                    document.querySelectorAll('.admin-tab-content').forEach(content => {
                        content.style.display = 'none';
                    });
                    document.getElementById(`${tabName}-tab`).style.display = 'block';

                    // If switching to prompts tab, refresh the custom prompts list
                    if (tabName === 'prompts') {
                        loadPromptFormCategories();
                        displayCustomPromptsList();
                    }
                }


                // Cancel prompt form
                function cancelPromptForm() {
                    document.getElementById('prompt-form').style.display = 'none';

                    // Clear image preview and file input
                    const imageInput = document.getElementById('prompt-image-file');
                    const previewDiv = document.getElementById('prompt-upload-preview');
                    const statusDiv = document.getElementById('prompt-upload-status');

                    if (imageInput) imageInput.value = '';
                    if (previewDiv) previewDiv.innerHTML = '';
                    if (statusDiv) statusDiv.textContent = '';
                }

                // Helper function to get unique categories from prompts
                function getCategories() {
                    const allPrompts = window.currentPrompts || [];
                    const categories = ['Vťechny', ...new Set(allPrompts.map(p => p.category))].sort();
                    return categories;
                }

                // Load categories into the form dropdown
                function loadPromptFormCategories() {
                    const dropdown = document.getElementById('prompt-category');
                    dropdown.innerHTML = '';

                    const categories = getCategories().filter(c => c !== 'Vťechny');
                    categories.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat;
                        option.textContent = cat;
                        dropdown.appendChild(option);
                    });
                }

                // Save prompt (add or edit)
                async function savePrompt() {
                    const title = document.getElementById('prompt-title').value.trim();
                    const category = document.getElementById('prompt-category').value;
                    const icon = document.getElementById('prompt-icon').value.trim() || '🎓';
                    const promptText = document.getElementById('prompt-text').value.trim();

                    if (!title || !promptText) {
                        alert('Vyplňte prosím název a text promptu!');
                        return;
                    }

                    const editId = document.getElementById('edit-prompt-id').value;

                    // Get selected image file if any
                    const imageInput = document.getElementById('prompt-image-file');
                    const imageFile = imageInput?.files?.[0] || null;

                    if (editId) {
                        // Edit existing prompt - use Supabase
                        const result = await updateInfografikaPrompt(editId, {
                            title,
                            content: promptText,
                            category,
                            icon,
                            number: parseInt(document.getElementById('edit-prompt-id').dataset.number) || 1
                        });

                        if (result.success) {
                            // If there's an image, upload it after successful prompt update
                            if (imageFile) {
                                const uploadStatus = document.getElementById('prompt-upload-status');
                                uploadStatus.textContent = '🎓¤ Nahrávám obrázek...';
                                uploadStatus.style.color = '#667eea';

                                const uploadResult = await uploadPromptExample(imageFile, editId);

                                if (uploadResult.success) {
                                    uploadStatus.textContent = ' Obrázek nahrán!';
                                    uploadStatus.style.color = '#48bb78';
                                } else {
                                    uploadStatus.textContent = '⚠ Chyba při nahrávání obrázku: ' + uploadResult.error;
                                    uploadStatus.style.color = '#f56565';
                                }
                            }

                            alert(' Prompt aktualizován! Stránka se obnoví...');
                            cancelPromptForm();
                            closeAdminModal();
                            location.reload();
                        } else {
                            alert('❌ Chyba při aktualizaci: ' + result.error);
                        }
                    } else {
                        // Add new prompt - use Supabase
                        const allPrompts = window.currentPrompts || [];
                        const maxNumber = allPrompts.length > 0 ? Math.max(...allPrompts.map(p => p.number || 0)) : 0;

                        const result = await addInfografikaPrompt({
                            number: maxNumber + 1,
                            title,
                            content: promptText,
                            category,
                            icon
                        });

                        if (result.success) {
                            // If there's an image, upload it after successful prompt creation
                            if (imageFile) {
                                const uploadStatus = document.getElementById('prompt-upload-status');
                                uploadStatus.textContent = '🎓¤ Nahrávám obrázek...';
                                uploadStatus.style.color = '#667eea';

                                const uploadResult = await uploadPromptExample(imageFile, result.data.id);

                                if (uploadResult.success) {
                                    uploadStatus.textContent = ' Obrázek nahrán!';
                                    uploadStatus.style.color = '#48bb78';
                                } else {
                                    uploadStatus.textContent = '⚠ Chyba při nahrávání obrázku: ' + uploadResult.error;
                                    uploadStatus.style.color = '#f56565';
                                }
                            }

                            alert(' Prompt přidán! Stránka se obnoví...');
                            cancelPromptForm();
                            closeAdminModal();
                            location.reload();
                        } else {
                            alert('❌ Chyba při přidání: ' + result.error);
                        }
                    }
                }

                // Edit custom prompt
                function editCustomPrompt(promptId) {
                    const customPrompts = loadCustomPrompts();
                    const prompt = customPrompts.find(p => p.id === promptId);

                    if (!prompt) return;

                    document.getElementById('form-title').textContent = 'Upravit prompt';
                    document.getElementById('edit-prompt-id').value = prompt.id;
                    document.getElementById('prompt-title').value = prompt.title;
                    document.getElementById('prompt-category').value = prompt.category;
                    document.getElementById('prompt-icon').value = prompt.icon;
                    document.getElementById('prompt-text').value = prompt.prompt;
                    document.getElementById('prompt-form').style.display = 'block';
                }

                // Delete custom prompt
                function deleteCustomPrompt(promptId) {
                    if (!confirm('Opravdu chcete smazat tento prompt?')) return;

                    let customPrompts = loadCustomPrompts();
                    customPrompts = customPrompts.filter(p => p.id !== promptId);
                    saveCustomPrompts(customPrompts);

                    displayCustomPromptsList();
                    initializeDatabase();

                    alert(' Prompt byl smazán!');
                }

                // Display list of custom prompts in admin panel
                function displayCustomPromptsList() {
                    const container = document.getElementById('custom-prompts-container');
                    const customPrompts = loadCustomPrompts();

                    if (customPrompts.length === 0) {
                        container.innerHTML = '<p style="color: #a0aec0; font-style: italic;">Zatím nemáte žádné vlastní prompty.</p>';
                        return;
                    }

                    container.innerHTML = customPrompts.map(prompt => `
                <div style="padding: 1rem; background: white; border: 2px solid #e0e0e0; border-radius: 8px; margin-bottom: 0.75rem;">
                    <div style="display: flex; align-items: start; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">${prompt.icon}</span>
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.25rem 0;">#${prompt.number} ${prompt.title}</h4>
                            <p style="font-size: 0.875rem; color: #667eea; margin: 0 0 0.5rem 0;">${prompt.category}</p>
                            <p style="font-size: 0.875rem; color: #4a5568; margin: 0;">${prompt.prompt.substring(0, 100)}${prompt.prompt.length > 100 ? '...' : ''}</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                        <button class="btn-edit" onclick="editCustomPrompt('${prompt.id}')"> Upravit</button>
                        <button class="btn-delete" onclick="deleteCustomPrompt('${prompt.id}')">🗑 Smazat</button>
                    </div>
                </div>
            `).join('');
                }

                // Export custom prompts
                function exportCustomPrompts() {
                    const customPrompts = loadCustomPrompts();

                    if (customPrompts.length === 0) {
                        alert('Nemáte žádné vlastní prompty k exportu!');
                        return;
                    }

                    const dataStr = JSON.stringify(customPrompts, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `infografika-prompty-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    alert(`
 Exportováno ${customPrompts.length} promptů!`);
                }

                // Import custom prompts
                function importCustomPrompts(event) {
                    const file = event.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importedPrompts = JSON.parse(e.target.result);

                            if (!Array.isArray(importedPrompts)) {
                                throw new Error('Neplatný formát souboru');
                            }

                            // Validate prompts
                            const isValid = importedPrompts.every(p =>
                                p.id && p.title && p.prompt && p.category && p.icon
                            );

                            if (!isValid) {
                                throw new Error('Některé prompty nemají požadovaná pole');
                            }

                            // Merge with existing custom prompts
                            let customPrompts = loadCustomPrompts();

                            importedPrompts.forEach(imported => {
                                const existingIndex = customPrompts.findIndex(p => p.id === imported.id);
                                if (existingIndex !== -1) {
                                    // Update existing
                                    customPrompts[existingIndex] = imported;
                                } else {
                                    // Add new
                                    customPrompts.push(imported);
                                }
                            });

                            saveCustomPrompts(customPrompts);
                            displayCustomPromptsList();
                            initializeDatabase();

                            alert(` Importováno ${importedPrompts.length} promptů!`);
                        } catch (error) {
                            alert('❌ Chyba při importu: ' + error.message);
                        }
                    };
                    reader.readAsText(file);

                    // Reset file input
                    event.target.value = '';
                }

                // =======================================================
                // UPLOAD IMAGE FUNCTIONALITY FOR PROMPT FORM
                // =======================================================

                // Initialize upload area in prompt form
                function initializePromptFormUpload() {
                    const uploadArea = document.getElementById('upload-area-inline');
                    const fileInput = document.getElementById('prompt-image-file');

                    if (!uploadArea || !fileInput) return;

                    // Click to upload
                    uploadArea.addEventListener('click', () => fileInput.click());

                    // Drag and drop handlers
                    uploadArea.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        uploadArea.style.borderColor = '#667eea';
                        uploadArea.style.background = '#edf2f7';
                    });

                    uploadArea.addEventListener('dragleave', () => {
                        uploadArea.style.borderColor = '#cbd5e0';
                        uploadArea.style.background = '#f7fafc';
                    });

                    uploadArea.addEventListener('drop', (e) => {
                        e.preventDefault();
                        uploadArea.style.borderColor = '#cbd5e0';
                        uploadArea.style.background = '#f7fafc';

                        const file = e.dataTransfer.files[0];
                        if (file && file.type.startsWith('image/')) {
                            handlePromptImagePreview(file);
                        }
                    });

                    // File input change
                    fileInput.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            handlePromptImagePreview(file);
                        }
                    });
                }

                // Preview uploaded image
                function handlePromptImagePreview(file) {
                    const previewDiv = document.getElementById('prompt-upload-preview');

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        previewDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Náhled">
                    <p style="margin-top: 0.5rem; color: #4a5568; font-size: 0.875rem;">
                        ${file.name} (${(file.size / 1024).toFixed(1)} KB)
                    </p>
                `;
                    };
                    reader.readAsDataURL(file);
                }

                // Call this when opening admin modal
                document.addEventListener('DOMContentLoaded', () => {
                    // Initialize upload on page load
                    initializePromptFormUpload();
                });

            