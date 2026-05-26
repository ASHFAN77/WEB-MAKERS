// reviews.js
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewText = document.getElementById('review-text');
    const reviewsList = document.getElementById('reviews-list');
    
    // Fetch and display reviews
    async function loadReviews() {
        if (!window.supabaseClient) {
            reviewsList.innerHTML = '<div class="review-card glass-premium placeholder-review"><p class="review-quote">"Reviews are unavailable (Database disconnected)."</p></div>';
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;

            if (data.length === 0) {
                reviewsList.innerHTML = '<div class="review-card glass-premium"><p class="review-quote">"Be the first to leave your mark."</p></div>';
                return;
            }

            reviewsList.innerHTML = '';
            data.forEach(review => {
                const card = document.createElement('div');
                card.className = 'review-card glass-premium';
                
                // Parse tags
                let tagsHTML = '';
                if (review.tags && review.tags.length > 0) {
                    tagsHTML = '<div class="review-tags">';
                    review.tags.forEach(tag => {
                        tagsHTML += `<span class="review-tag">${tag}</span>`;
                    });
                    tagsHTML += '</div>';
                }

                // Mask email for privacy (e.g. j***@gmail.com)
                const emailParts = review.user_email.split('@');
                const maskedEmail = emailParts[0].charAt(0) + '***@' + emailParts[1];

                card.innerHTML = `
                    <p class="review-quote">"${review.content}"</p>
                    <div class="review-meta">
                        <span class="review-author">Client: ${maskedEmail}</span>
                        ${tagsHTML}
                    </div>
                `;
                reviewsList.appendChild(card);
            });
            
            // Re-trigger scroll animations if GSAP is loaded
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }

        } catch (error) {
            console.error('Error fetching reviews:', error);
            reviewsList.innerHTML = `<div class="review-card glass-premium">
                <p class="review-quote">"Failed to load praise."</p>
                <div class="review-meta">
                    <span style="color: #ff6b6b; font-size: 0.85rem;">Note: If this is a new Supabase project, make sure you ran the SQL setup script in your Supabase SQL Editor. Also ensure you are running this from a local server (like Live Server) or after deploying it (not via file://) to avoid CORS issues.</span>
                </div>
            </div>`;
        }
    }

    // Handle Review Submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!window.supabaseClient) return;

            const content = reviewText.value;
            const checkboxes = document.querySelectorAll('.tag-checkbox input:checked');
            const tags = Array.from(checkboxes).map(cb => cb.value);

            const { data: { session } } = await window.supabaseClient.auth.getSession();
            
            if (!session) {
                alert("You must be logged in to submit a review.");
                return;
            }

            try {
                const { error } = await window.supabaseClient
                    .from('reviews')
                    .insert([
                        { 
                            content: content, 
                            tags: tags,
                            user_id: session.user.id,
                            user_email: session.user.email
                        }
                    ]);
                
                if (error) throw error;
                
                // Reset form and reload reviews
                reviewForm.reset();
                alert("Thank you for your praise!");
                loadReviews();
                
            } catch (error) {
                console.error("Error submitting review:", error);
                alert("Failed to submit review: " + error.message);
            }
        });
    }

    // Load reviews initially
    loadReviews();

    // Listen for sign-in event from auth.js to reload reviews if needed
    window.addEventListener('user-signed-in', loadReviews);
});
