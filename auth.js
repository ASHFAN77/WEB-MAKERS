// auth.js
document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('auth-modal');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navLogoutBtn = document.getElementById('nav-logout-btn');
    const closeModalBtn = document.getElementById('close-modal');
    
    const authForm = document.getElementById('auth-form');
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const authSubmitBtn = document.getElementById('auth-submit');
    const authToggleBtn = document.getElementById('auth-toggle-btn');
    const authToggleText = document.getElementById('auth-toggle-text');
    const authTitle = document.getElementById('auth-title');
    const authError = document.getElementById('auth-error');
    
    let isLoginMode = true;

    // Toggle Modal
    navLoginBtn.addEventListener('click', () => {
        authModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        authModal.classList.remove('active');
        authError.textContent = '';
    });

    // Toggle Login/Signup Mode
    authToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authTitle.textContent = 'Enter the Elite';
            authSubmitBtn.textContent = 'Authenticate';
            authToggleText.textContent = 'New here?';
            authToggleBtn.textContent = 'Sign Up instead';
        } else {
            authTitle.textContent = 'Join the Elite';
            authSubmitBtn.textContent = 'Sign Up';
            authToggleText.textContent = 'Already exclusive?';
            authToggleBtn.textContent = 'Log In instead';
        }
        authError.textContent = '';
    });

    // Handle Form Submit
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!window.supabaseClient) {
            authError.textContent = "Supabase not configured. Please add credentials.";
            return;
        }

        const email = authEmail.value;
        const password = authPassword.value;
        authError.textContent = 'Processing...';

        try {
            if (isLoginMode) {
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
            } else {
                const { data, error } = await window.supabaseClient.auth.signUp({
                    email,
                    password
                });
                if (error) throw error;
                if (data.user && data.user.identities && data.user.identities.length === 0) {
                     authError.textContent = "Email already in use or requires confirmation.";
                     return;
                }
                authError.textContent = "Signup successful! Check email for confirmation if required.";
            }
            
            authModal.classList.remove('active');
            authForm.reset();
            checkUser(); // Update UI
        } catch (error) {
            if (error.message === 'Failed to fetch') {
                authError.textContent = "Connection failed. Note: If running locally via file://, browser security (CORS) blocks database requests. Please run via a local server (e.g. Live Server) or deploy the site.";
            } else {
                authError.textContent = error.message;
            }
        }
    });

    // Handle Logout
    navLogoutBtn.addEventListener('click', async () => {
        if (window.supabaseClient) {
            await window.supabaseClient.auth.signOut();
            checkUser();
        }
    });

    // Check User State on Load
    async function checkUser() {
        if (!window.supabaseClient) return;

        const { data: { session } } = await window.supabaseClient.auth.getSession();
        
        const reviewSubmitArea = document.getElementById('review-submission-area');
        const loginPrompt = document.getElementById('login-prompt-reviews');

        if (session) {
            navLoginBtn.classList.add('hidden');
            navLogoutBtn.classList.remove('hidden');
            if (reviewSubmitArea) reviewSubmitArea.classList.remove('hidden');
            if (loginPrompt) loginPrompt.classList.add('hidden');
        } else {
            navLoginBtn.classList.remove('hidden');
            navLogoutBtn.classList.add('hidden');
            if (reviewSubmitArea) reviewSubmitArea.classList.add('hidden');
            if (loginPrompt) loginPrompt.classList.remove('hidden');
        }
    }

    // Listen for auth state changes
    if (window.supabaseClient) {
        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            checkUser();
            if (event === 'SIGNED_IN') {
                // Dispatch event to refresh reviews if needed
                window.dispatchEvent(new Event('user-signed-in'));
            }
        });
        checkUser();
    }
});
