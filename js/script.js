document.addEventListener('DOMContentLoaded', (event) => {
    
    // --- 1. Initialize Lucide Icons ---
    try {
        lucide.createIcons();
        console.log("Lucide icons initialized.");
    } catch (e) {
        console.error("Error initializing Lucide icons:", e);
    }

    // --- 2. Prism Rendering Logic ---
    // KaTeX is replaced by MathJax, which handles its own rendering automatically.
    // We only need a function for Prism to re-highlight code in the modal.
    
    function highlightPrismIn(element) {
        try {
            if (typeof Prism !== 'undefined') {
                Prism.highlightAllUnder(element);
            } else {
                console.warn("Prism.js not found. Scripts might be blocked or failed to load.");
            }
        } catch (e) {
            console.error("Error highlighting code with Prism:", e);
        }
    }
    
    // Initial Prism render on page load. MathJax handles itself.
    setTimeout(() => {
        highlightPrismIn(document.body);
        console.log("Initial Prism render complete.");
    }, 100);

    // --- 3. Multi-Page Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';

    navLinks.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('nav-link-active');
        }
    });

    // --- 4. Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const menuIcon = mobileMenuButton.querySelector('[data-lucide="menu"]');
    const xIcon = mobileMenuButton.querySelector('[data-lucide="x"]');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            menuIcon.classList.toggle('block');
            xIcon.classList.toggle('block');
            xIcon.classList.toggle('hidden');
        });
    }

    // --- 5. Writings Section: Pagination & Modal Logic ---
    const articlesPerPage = 6;
    let currentArticlePage = 1;
    const writingsGrid = document.getElementById('writings-grid');
    
    // Check if writingsGrid exists before querying
    const allArticleCards = writingsGrid ? Array.from(writingsGrid.querySelectorAll('.article-card')) : [];
    
    const paginationControls = document.getElementById('pagination-controls');
    const totalArticles = allArticleCards.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);

    const articleModal = document.getElementById('article-modal');
    const modalContentBox = document.getElementById('modal-content-box');
    const modalContentArea = document.getElementById('modal-content-area');
    const modalCloseButton = document.getElementById('modal-close-button');

    function renderWritingsPage(page) {
        if (!writingsGrid) return;
        
        currentArticlePage = page;
        const start = (page - 1) * articlesPerPage;
        const end = start + articlesPerPage;

        // Hide all cards, then show only the ones for this page
        allArticleCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        renderPaginationControls(page);
    }

    function renderPaginationControls(page) {
        if (!paginationControls) return;
        
        // Don't show controls if only 1 page
        if (totalPages <= 1) {
            paginationControls.innerHTML = '';
            return;
        }
        
        let prevDisabled = (page === 1) ? 'disabled' : '';
        let nextDisabled = (page === totalPages) ? 'disabled' : '';

        paginationControls.innerHTML = `
            <button id="prev-page" class="pagination-button" ${prevDisabled}>
                <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
                Previous
            </button>
            <span class="text-sm text-gray-700">
                Page ${page} of ${totalPages}
            </span>
            <button id="next-page" class="pagination-button" ${nextDisabled}>
                Next
                <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
            </button>
        `;
        
        // Re-render icons and add listeners
        lucide.createIcons();
        
        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentArticlePage > 1) {
                renderWritingsPage(currentArticlePage - 1);
            }
        });
        
        document.getElementById('next-page').addEventListener('click', () => {
            if (currentArticlePage < totalPages) {
                renderWritingsPage(currentArticlePage + 1);
            }
        });
    }

    function openArticleModal(articleId) {
        if (!articleId) return;
        const articleContent = document.getElementById(articleId);
        
        if (!articleContent) {
            console.error('Article content not found:', articleId);
            modalContentArea.innerHTML = '<p>Error: Article content not found.</p>';
        } else {
            // Clone the content and put it in the modal
            const contentClone = articleContent.cloneNode(true);
            modalContentArea.innerHTML = ''; // Clear previous content
            modalContentArea.appendChild(contentClone);
            
            // Re-run Prism highlighting for the new modal content.
            // MathJax will automatically re-render the math.
            highlightPrismIn(modalContentArea);
        }

        // Show the modal with animation
        if (articleModal) {
            articleModal.classList.remove('hidden');
            setTimeout(() => {
                articleModal.style.opacity = '1';
                modalContentBox.style.opacity = '1';
                modalContentBox.style.transform = 'scale(1)';
            }, 10); // Short delay to allow CSS transition
        }
    }
    
    function closeArticleModal() {
        // Animate out
        if (articleModal) {
            articleModal.style.opacity = '0';
            modalContentBox.style.opacity = '0';
            modalContentBox.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                articleModal.classList.add('hidden');
                modalContentArea.innerHTML = ''; // Clear content
            }, 300); // Must match CSS transition duration
        }
    }
    
    // --- Event Listeners for Writings Section ---
    
    // Add click listener to the grid (event delegation)
    if (writingsGrid) {
        writingsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.article-card');
            if (card) {
                const articleId = card.getAttribute('data-article-id');
                if (articleId) {
                    openArticleModal(articleId);
                }
            }
        });
    }

    // Modal close listeners
    if (modalCloseButton && articleModal) {
        modalCloseButton.addEventListener('click', closeArticleModal);
        articleModal.addEventListener('click', (e) => {
            // Close if user clicks on the dark overlay (but not the content box)
            if (e.target === articleModal) {
                closeArticleModal();
            }
        });
    }

    // Initial render for writings (page 1)
    if (allArticleCards.length > 0) {
        renderWritingsPage(1);
    }

});