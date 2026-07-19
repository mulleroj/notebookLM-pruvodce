// Supabase Configuration and Helper Functions
// Author: NotebookLM Průvodce
// Purpose: Manages Supabase connection and image upload/retrieval for prompt examples

const SUPABASE_CONFIG = {
    url: 'https://ukrwqmaiddvmvkmeqzcv.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcndxbWFpZGR2bXZrbWVxemN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTI3MDQsImV4cCI6MjA4MTQ4ODcwNH0.uYsPfhSY3Ib2lIpPu8nj8E8Zr4tz1Cgq0Xaom3I4bWU',
    bucketName: 'prompt-examples'
};

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded. Please include the Supabase CDN script.');
        return null;
    }

    // Check if Supabase is properly configured
    if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL' || SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY') {
        console.warn('Supabase not configured. Using local mode without image examples.');
        return null;
    }

    if (!supabaseClient) {
        try {
            supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
            return null;
        }
    }
    return supabaseClient;
}

/**
 * Convert image file to base64 string
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} Base64 string
 */
async function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Upload an image to a prompt's image_base64 field
 * @param {File} file - The image file to upload
 * @param {string} promptId - The prompt ID to associate with this image
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function uploadPromptExample(file, promptId) {
    try {
        const client = initSupabase();
        if (!client) {
            throw new Error('Supabase client not initialized');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('Image must be smaller than 5MB');
        }

        // Resize image if needed
        const optimizedFile = await optimizeImage(file);

        // Convert to base64
        const base64Image = await imageToBase64(optimizedFile);

        // Update the prompt record with the base64 image
        const { error: dbError } = await client
            .from('prompts')
            .update({ image_base64: base64Image })
            .eq('id', promptId);

        if (dbError) {
            console.error('Database update error:', dbError);
            throw dbError;
        }

        return {
            success: true
        };

    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Optimize image by resizing if it's too large
 * @param {File} file - Original image file
 * @returns {Promise<File>} Optimized image file
 */
async function optimizeImage(file) {
    return new Promise((resolve, reject) => {
        const maxWidth = 1200;
        const maxHeight = 1200;

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            let width = img.width;
            let height = img.height;

            // Check if resizing is needed
            if (width <= maxWidth && height <= maxHeight) {
                resolve(file);
                return;
            }

            // Calculate new dimensions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            // Create canvas and resize
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    const optimizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    resolve(optimizedFile);
                } else {
                    reject(new Error('Failed to optimize image'));
                }
            }, file.type, 0.85); // 85% quality
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Get the example image for a specific prompt (from image_base64 field)
 * @param {string} promptId - The prompt ID
 * @returns {Promise<string|null>} Base64 image string or null
 */
async function getPromptExamples(promptId) {
    try {
        const client = initSupabase();
        if (!client) {
            return null;
        }

        const { data, error } = await client
            .from('prompts')
            .select('image_base64')
            .eq('id', promptId)
            .single();

        if (error) {
            console.error('Fetch error:', error);
            return null;
        }

        return data?.image_base64 || null;

    } catch (error) {
        console.error('Error fetching prompt image:', error);
        return null;
    }
}

/**
 * Delete an example image from a prompt
 * @param {string} promptId - The prompt ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function deletePromptExample(promptId) {
    try {
        const client = initSupabase();
        if (!client) {
            throw new Error('Supabase client not initialized');
        }

        // Clear the image_base64 field
        const { error: dbError } = await client
            .from('prompts')
            .update({ image_base64: null })
            .eq('id', promptId);

        if (dbError) {
            throw dbError;
        }

        return { success: true };

    } catch (error) {
        console.error('Delete error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * CUSTOM PROMPTS MANAGEMENT
 * Functions for managing user's custom prompts in Supabase
 */

/**
 * Fetch all custom prompts from Supabase for current user
 * @returns {Promise<Array>} Array of custom prompt objects
 */
async function getCustomPromptsFromSupabase() {
    try {
        const client = initSupabase();
        if (!client) {
            console.warn('Supabase not configured, using localStorage');
            return null; // Signal to use localStorage
        }

        const { data, error } = await client
            .from('custom_prompts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching custom prompts from Supabase:', error);
            return null; // Signal to use localStorage
        }

        return data || [];

    } catch (error) {
        console.error('Error in getCustomPromptsFromSupabase:', error);
        return null; // Signal to use localStorage
    }
}

/**
 * Save a custom prompt to Supabase
 * @param {Object} prompt - Prompt object to save
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function saveCustomPromptToSupabase(prompt) {
    try {
        const client = initSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not configured' };
        }

        const promptData = {
            id: prompt.id,
            user_id: null, // For now, no authentication
            number: prompt.number,
            title: prompt.title,
            category: prompt.category,
            icon: prompt.icon,
            prompt: prompt.prompt
        };

        const { data, error } = await client
            .from('custom_prompts')
            .insert([promptData])
            .select();

        if (error) {
            console.error('Error saving prompt to Supabase:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };

    } catch (error) {
        console.error('Error in saveCustomPromptToSupabase:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update an existing custom prompt in Supabase
 * @param {string} promptId - ID of the prompt to update
 * @param {Object} updates - Object with fields to update
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function updateCustomPromptInSupabase(promptId, updates) {
    try {
        const client = initSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not configured' };
        }

        const { data, error } = await client
            .from('custom_prompts')
            .update(updates)
            .eq('id', promptId)
            .select();

        if (error) {
            console.error('Error updating prompt in Supabase:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };

    } catch (error) {
        console.error('Error in updateCustomPromptInSupabase:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a custom prompt from Supabase
 * @param {string} promptId - ID of the prompt to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function deleteCustomPromptFromSupabase(promptId) {
    try {
        const client = initSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not configured' };
        }

        const { error } = await client
            .from('custom_prompts')
            .delete()
            .eq('id', promptId);

        if (error) {
            console.error('Error deleting prompt from Supabase:', error);
            return { success: false, error: error.message };
        }

        return { success: true };

    } catch (error) {
        console.error('Error in deleteCustomPromptFromSupabase:', error);
        return { success: false, error: error.message };
    }
}

/**
 * INFOGRAFIKA PROMPTS MANAGEMENT
 * Functions for fetching infografika prompts from Supabase prompts table
 */

/**
 * Fetch all infografika prompts from Supabase
 * Maps Supabase schema to infografika format: tags[0]=category, tags[1]=icon, tags[2]=#number
 * @returns {Promise<Array>} Array of infograf ika prompt objects
 */
async function getInfografikaPromptsFromSupabase() {
    try {
        const client = initSupabase();

        if (!client) {
            console.warn('Supabase not initialized, using local infografika-prompts-db.js');
            return null; // Signal to use local data
        }

        const { data, error } = await client
            .from('prompts')
            .select('*')
            .eq('type', 'infografika')
            .order('title', { ascending: true });

        if (error) {
            console.error('Error fetching infografika prompts:', error);
            return null;
        }

        // Map Supabase schema to infografika format
        const mapped = (data || []).map(prompt => ({
            id: prompt.id,
            number: parseInt(prompt.tags[2]?.replace('#', '') || 0),
            title: prompt.title,
            category: prompt.tags[0] || 'Ostatní',
            icon: prompt.tags[1] || '📝',
            prompt: prompt.content
        }));

        // Sort by number
        mapped.sort((a, b) => a.number - b.number);

        return mapped;

    } catch (error) {
        console.error('Error in getInfografikaPromptsFromSupabase:', error);
        return null;
    }
}

/**
 * Get unique categories from infografika prompts
 * @returns {Promise<Array>} Array of unique category names
 */
async function getInfografikaCategories() {
    const prompts = await getInfografikaPromptsFromSupabase();
    if (!prompts) return null;

    const categories = ['Všechny'];
    const unique = [...new Set(prompts.map(p => p.category))];
    return categories.concat(unique.sort());
}

/**
 * PREZENTACE PROMPTS MANAGEMENT
 * Functions for fetching prezentace prompts from Supabase prompts table
 */

/**
 * Fetch all prezentace prompts from Supabase
 * Maps Supabase schema to prezentace format: tags[0]=category, tags[1]=icon, tags[2]=#number
 * @returns {Promise<Array>} Array of prezentace prompt objects
 */
async function getPrezentacePromptsFromSupabase() {
    try {
        const client = initSupabase();
        if (!client) {
            console.warn('Supabase not initialized, using local data');
            return null; // Signal to use local data
        }

        const { data, error } = await client
            .from('prompts')
            .select('*')
            .eq('type', 'prezentace')
            .order('title', { ascending: true });

        if (error) {
            console.error('Error fetching prezentace prompts:', error);
            return null;
        }

        // Map Supabase schema to prezentace format
        const mapped = (data || []).map(prompt => ({
            id: prompt.id,
            number: parseInt(prompt.tags[2]?.replace('#', '') || 0),
            title: prompt.title,
            category: prompt.tags[0] || 'Ostatní',
            icon: prompt.tags[1] || '📝',
            prompt: prompt.content
        }));

        // Sort by number
        mapped.sort((a, b) => a.number - b.number);

        return mapped;

    } catch (error) {
        console.error('Error in getPrezentacePromptsFromSupabase:', error);
        return null;
    }
}

/**
 * Get unique categories from prezentace prompts
 * @returns {Promise<Array>} Array of unique category names
 */
async function getPrezentaceCategories() {
    const prompts = await getPrezentacePromptsFromSupabase();
    if (!prompts) return null;

    const categories = ['Všechny'];
    const unique = [...new Set(prompts.map(p => p.category))];
    return categories.concat(unique.sort());
}

/**
 * VIDEO PROMPTS MANAGEMENT
 * Functions for fetching video prompts from Supabase prompts table
 */

/**
 * Fetch all video prompts from Supabase
 * Maps Supabase schema to video format: tags[0]=category, tags[1]=icon, tags[2]=#number
 * @returns {Promise<Array>} Array of video prompt objects
 */
async function getVideoPromptsFromSupabase() {
    try {
        const client = initSupabase();
        if (!client) {
            console.warn('Supabase not initialized, using local data');
            return null; // Signal to use local data
        }

        const { data, error } = await client
            .from('prompts')
            .select('*')
            .eq('type', 'video')
            .order('title', { ascending: true });

        if (error) {
            console.error('Error fetching video prompts:', error);
            return null;
        }

        // Map Supabase schema to video format
        const mapped = (data || []).map(prompt => ({
            id: prompt.id,
            number: parseInt(prompt.tags[2]?.replace('#', '') || 0),
            title: prompt.title,
            category: prompt.tags[0] || 'Ostatní',
            icon: prompt.tags[1] || '📝',
            prompt: prompt.content
        }));

        // Sort by number
        mapped.sort((a, b) => a.number - b.number);

        return mapped;

    } catch (error) {
        console.error('Error in getVideoPromptsFromSupabase:', error);
        return null;
    }
}

/**
 * Get unique categories from video prompts
 * @returns {Promise<Array>} Array of unique category names
 */
async function getVideoCategories() {
    const prompts = await getVideoPromptsFromSupabase();
    if (!prompts) return null;

    const categories = ['Všechny'];
    const unique = [...new Set(prompts.map(p => p.category))];
    return categories.concat(unique.sort());
}

/**
 * AUDIO PROMPTS MANAGEMENT
 * Functions for fetching audio prompts from Supabase prompts table
 */

/**
 * Fetch all audio prompts from Supabase
 * Maps Supabase schema to audio format: tags[0]=category, tags[1]=icon, tags[2]=#number
 * @returns {Promise<Array>} Array of audio prompt objects
 */
async function getAudioPromptsFromSupabase() {
    try {
        const client = initSupabase();
        if (!client) {
            console.warn('Supabase not initialized, using local data');
            return null;
        }

        const { data, error } = await client
            .from('prompts')
            .select('*')
            .eq('type', 'audio')
            .order('title', { ascending: true });

        if (error) {
            console.error('Error fetching audio prompts:', error);
            return null;
        }

        // Map Supabase schema to audio format
        const mapped = (data || []).map(prompt => ({
            id: prompt.id,
            number: parseInt(prompt.tags[2]?.replace('#', '') || 0),
            title: prompt.title,
            category: prompt.tags[0] || 'Ostatní',
            icon: prompt.tags[1] || '📝',
            prompt: prompt.content
        }));

        // Sort by number
        mapped.sort((a, b) => a.number - b.number);

        return mapped;

    } catch (error) {
        console.error('Error in getAudioPromptsFromSupabase:', error);
        return null;
    }
}

/**
 * Get unique categories from audio prompts
 * @returns {Promise<Array>} Array of unique category names
 */
async function getAudioCategories() {
    const prompts = await getAudioPromptsFromSupabase();
    if (!prompts) return null;

    const categories = ['Všechny'];
    const unique = [...new Set(prompts.map(p => p.category))];
    return categories.concat(unique.sort());
}

/**
 * AUTHENTICATION FUNCTIONS
 */

const ADMIN_USER_ID = 'ed8ac0aa-bed0-4846-b321-0f278b597e90';

async function loginWithEmail(email, password) {
    try {
        const client = initSupabase();
        if (!client) return { success: false, error: 'Supabase not initialized' };

        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };

        return { success: true, user: data.user, session: data.session };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function logout() {
    try {
        const client = initSupabase();
        if (!client) return { success: false, error: 'Client not initialized' };

        // Sign out from Supabase (clears session and cookies)
        const { error } = await client.auth.signOut();

        if (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }

        // Clear any cached client to force re-initialization
        supabaseClient = null;

        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}


async function getCurrentUser() {
    try {
        const client = initSupabase();
        if (!client) return null;
        const { data } = await client.auth.getSession();
        return data.session?.user || null;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

function isAdmin(user) {
    return user?.id === ADMIN_USER_ID;
}

function onAuthStateChange(callback) {
    const client = initSupabase();
    if (!client) return null;
    const { data } = client.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
    return data;
}

/**
 * PROMPT CRUD FUNCTIONS (admin only)
 */

async function addInfografikaPrompt(promptData) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { data, error } = await client.from('prompts').insert([{
            title: promptData.title,
            content: promptData.content,
            type: 'infografika',
            model: 'NotebookLM',
            tags: [promptData.category, promptData.icon, `#${promptData.number}`],
            user_id: user.id,
            is_favorite: false
        }]).select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateInfografikaPrompt(promptId, updates) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { data, error } = await client.from('prompts').update({
            title: updates.title,
            content: updates.content,
            tags: [updates.category, updates.icon, `#${updates.number}`]
        }).eq('id', promptId).eq('type', 'infografika').select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteInfografikaPrompt(promptId) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { error } = await client.from('prompts').delete()
            .eq('id', promptId).eq('type', 'infografika');

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * PREZENTACE CRUD FUNCTIONS (admin only)
 */

async function addPrezentacePrompt(promptData) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { data, error } = await client.from('prompts').insert([{
            title: promptData.title,
            content: promptData.content,
            type: 'prezentace',
            model: 'NotebookLM',
            tags: [promptData.category, promptData.icon, `#${promptData.number}`],
            user_id: user.id,
            is_favorite: false
        }]).select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updatePrezentacePrompt(promptId, updates) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { data, error } = await client.from('prompts').update({
            title: updates.title,
            content: updates.content,
            tags: [updates.category, updates.icon, `#${updates.number}`]
        }).eq('id', promptId).eq('type', 'prezentace').select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deletePrezentacePrompt(promptId) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { error } = await client.from('prompts').delete()
            .eq('id', promptId).eq('type', 'prezentace');

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * VIDEO CRUD FUNCTIONS (admin only)
 */

async function addVideoPrompt(promptData) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { data, error } = await client.from('prompts').insert([{
            title: promptData.title,
            content: promptData.content,
            type: 'video',
            model: 'NotebookLM',
            tags: [promptData.category, promptData.icon, `#${promptData.number}`],
            user_id: user.id,
            is_favorite: false
        }]).select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateVideoPrompt(promptId, updates) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { data, error } = await client.from('prompts').update({
            title: updates.title,
            content: updates.content,
            tags: [updates.category, updates.icon, `#${updates.number}`]
        }).eq('id', promptId).eq('type', 'video').select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteVideoPrompt(promptId) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { error } = await client.from('prompts').delete()
            .eq('id', promptId).eq('type', 'video');

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * AUDIO CRUD FUNCTIONS (admin only)
 */

async function addAudioPrompt(promptData) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { data, error } = await client.from('prompts').insert([{
            title: promptData.title,
            content: promptData.content,
            type: 'audio',
            model: 'NotebookLM',
            tags: [promptData.category, promptData.icon, `#${promptData.number}`],
            user_id: user.id,
            is_favorite: false
        }]).select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateAudioPrompt(promptId, updates) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { data, error } = await client.from('prompts').update({
            title: updates.title,
            content: updates.content,
            tags: [updates.category, updates.icon, `#${updates.number}`]
        }).eq('id', promptId).eq('type', 'audio').select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteAudioPrompt(promptId) {
    try {
        const client = initSupabase();
        const user = await getCurrentUser();
        if (!isAdmin(user)) return { success: false, error: 'Nepřihlášen nebo nejste admin' };

        const { error } = await client.from('prompts').delete()
            .eq('id', promptId).eq('type', 'audio');

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSupabase,
        uploadPromptExample,
        getPromptExamples,
        deletePromptExample,
        getCustomPromptsFromSupabase,
        saveCustomPromptToSupabase,
        updateCustomPromptInSupabase,
        deleteCustomPromptFromSupabase,
        getInfografikaPromptsFromSupabase,
        getInfografikaCategories,
        getPrezentacePromptsFromSupabase,
        getPrezentaceCategories,
        getVideoPromptsFromSupabase,
        getVideoCategories,
        getAudioPromptsFromSupabase,
        getAudioCategories,
        loginWithEmail,
        logout,
        getCurrentUser,
        isAdmin,
        onAuthStateChange,
        addInfografikaPrompt,
        updateInfografikaPrompt,
        deleteInfografikaPrompt,
        addPrezentacePrompt,
        updatePrezentacePrompt,
        deletePrezentacePrompt,
        addVideoPrompt,
        updateVideoPrompt,
        deleteVideoPrompt,
        addAudioPrompt,
        updateAudioPrompt,
        deleteAudioPrompt
    };
} else if (typeof window !== 'undefined') {
    // Make functions globally available for browser usage
    window.initSupabase = initSupabase;
    window.uploadPromptExample = uploadPromptExample;
    window.getPromptExamples = getPromptExamples;
    window.deletePromptExample = deletePromptExample;
    window.getCustomPromptsFromSupabase = getCustomPromptsFromSupabase;
    window.saveCustomPromptToSupabase = saveCustomPromptToSupabase;
    window.updateCustomPromptInSupabase = updateCustomPromptInSupabase;
    window.deleteCustomPromptFromSupabase = deleteCustomPromptFromSupabase;
    window.getInfografikaPromptsFromSupabase = getInfografikaPromptsFromSupabase;
    window.getInfografikaCategories = getInfografikaCategories;
    window.getPrezentacePromptsFromSupabase = getPrezentacePromptsFromSupabase;
    window.getPrezentaceCategories = getPrezentaceCategories;
    window.getVideoPromptsFromSupabase = getVideoPromptsFromSupabase;
    window.getVideoCategories = getVideoCategories;
    window.getAudioPromptsFromSupabase = getAudioPromptsFromSupabase;
    window.getAudioCategories = getAudioCategories;
    window.loginWithEmail = loginWithEmail;
    window.logout = logout;
    window.getCurrentUser = getCurrentUser;
    window.isAdmin = isAdmin;
    window.onAuthStateChange = onAuthStateChange;
    window.addInfografikaPrompt = addInfografikaPrompt;
    window.updateInfografikaPrompt = updateInfografikaPrompt;
    window.deleteInfografikaPrompt = deleteInfografikaPrompt;
    window.addPrezentacePrompt = addPrezentacePrompt;
    window.updatePrezentacePrompt = updatePrezentacePrompt;
    window.deletePrezentacePrompt = deletePrezentacePrompt;
    window.addVideoPrompt = addVideoPrompt;
    window.updateVideoPrompt = updateVideoPrompt;
    window.deleteVideoPrompt = deleteVideoPrompt;
    window.addAudioPrompt = addAudioPrompt;
    window.updateAudioPrompt = updateAudioPrompt;
    window.deleteAudioPrompt = deleteAudioPrompt;
}
