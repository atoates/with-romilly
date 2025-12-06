document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const postTitle = document.getElementById('post-title');
    
    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    // Fetch content data
    fetch('src/data/content.json')
        .then(response => response.json())
        .then(data => {
            // Logic for Blog Listing Page
            if (blogGrid && data.blog) {
                // Sort posts by date (newest first)
                const sortedPosts = data.blog.sort((a, b) => new Date(b.date) - new Date(a.date));

                sortedPosts.forEach(post => {
                    const article = document.createElement('article');
                    article.className = 'blog-card fade-in-up';
                    
                    article.innerHTML = `
                        <a href="blog-post.html?id=${post.id}" class="blog-card-link" aria-label="Read ${post.title}">
                            <img src="${post.image}" alt="${post.title}" class="blog-card-image" loading="lazy">
                        </a>
                        <div class="blog-card-content">
                            <div class="blog-date">${formatDate(post.date)}</div>
                            <h2 class="blog-title">
                                <a href="blog-post.html?id=${post.id}" style="text-decoration: none; color: inherit;">
                                    ${post.title}
                                </a>
                            </h2>
                            <p class="blog-summary">${post.summary}</p>
                            <a href="blog-post.html?id=${post.id}" class="blog-link">Read Article &rarr;</a>
                        </div>
                    `;
                    
                    blogGrid.appendChild(article);
                });
                
                // Trigger animations if any
                if (typeof handleScrollAnimation === 'function') {
                    handleScrollAnimation();
                }
            }

            // Logic for Single Blog Post Page
            if (postTitle && data.blog) {
                const urlParams = new URLSearchParams(window.location.search);
                const postId = urlParams.get('id');
                
                if (postId) {
                    const post = data.blog.find(p => p.id === postId);
                    
                    if (post) {
                        document.title = `${post.title} - With Romilly`;
                        document.getElementById('post-title').textContent = post.title;
                        document.getElementById('post-date').textContent = formatDate(post.date);
                        
                        const imgEl = document.getElementById('post-image');
                        if (post.image) {
                            imgEl.src = post.image;
                            imgEl.alt = post.title;
                            imgEl.style.display = 'block';
                        }
                        
                        document.getElementById('post-body').innerHTML = post.content;
                    } else {
                        // Post not found
                        document.getElementById('post-title').textContent = 'Article Not Found';
                        document.getElementById('post-body').innerHTML = '<p>Sorry, the article you are looking for does not exist.</p><p><a href="blog.html" class="btn btn-primary">Return to Journal</a></p>';
                    }
                } else {
                    // No ID provided
                    window.location.href = 'blog.html';
                }
            }
        })
        .catch(error => {
            console.error('Error loading blog content:', error);
            if (blogGrid) {
                blogGrid.innerHTML = '<p>Sorry, we couldn\'t load the articles at this time. Please try again later.</p>';
            }
        });
});

