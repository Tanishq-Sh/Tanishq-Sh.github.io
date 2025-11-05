document.addEventListener('DOMContentLoaded', (event) => {
    
    // --- 1. Initialize Lucide Icons ---
    try {
        lucide.createIcons();
        console.log("Lucide icons initialized.");
    } catch (e) {
        console.error("Error initializing Lucide icons:", e);
    }

    // --- 2. KaTeX & Prism (Defer functions) ---
    // We need to re-run these when the modal opens,
    // so we'll wrap them in functions.
    
    function renderKatexIn(element) {
        try {
            if (typeof renderMathInElement !== 'undefined') {
                renderMathInElement(element, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ]
                });
            } else {
                console.warn("KaTeX 'renderMathInElement' not found.");
            }
        } catch (e) {
            console.error("Error rendering KaTeX:", e);
        }
    }
    
    function highlightPrismIn(element) {
            try {
                if (typeof Prism !== 'undefined') {
                Prism.highlightAllUnder(element);
                } else {
                console.warn("Prism.js not found.");
                }
        } catch (e) {
            console.error("Error highlighting code with Prism:", e);
        }
    }
    
    // Initial render on page load
    setTimeout(() => {
        renderKatexIn(document.body);
        highlightPrismIn(document.body);
        console.log("Initial KaTeX and Prism render complete.");
    }, 100);

    // --- 3. Page Navigation Logic ---
    const allNavLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const menuIcon = mobileMenuButton.querySelector('[data-lucide="menu"]');
    const xIcon = mobileMenuButton.querySelector('[data-lucide="x"]');

    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetId = link.getAttribute('data-target');
            if (!targetId) return;
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;

            sections.forEach(section => section.classList.add('hidden'));
            targetSection.classList.remove('hidden');

            allNavLinks.forEach(navLink => {
                navLink.classList.toggle('nav-link-active', navLink.getAttribute('data-target') === targetId);
            });

            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                menuIcon.classList.remove('hidden');
                menuIcon.classList.add('block');
                xIcon.classList.remove('block');
                xIcon.classList.add('hidden');
            }
            window.scrollTo(0, 0);
        });
    });

    // --- 4. Mobile Menu Toggle ---
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
    const allArticleCards = Array.from(writingsGrid.querySelectorAll('.article-card'));
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
        const articleContent = document.getElementById(articleId);
        if (!articleContent) {
            console.error('Article content not found:', articleId);
            modalContentArea.innerHTML = '<p>Error: Article content not found.</p>';
        } else {
            // Clone the content and put it in the modal
            const contentClone = articleContent.cloneNode(true);
            modalContentArea.innerHTML = ''; // Clear previous content
            modalContentArea.appendChild(contentClone);
            
            // IMPORTANT: Re-run KaTeX and Prism on the new modal content
            renderKatexIn(modalContentArea);
            highlightPrismIn(modalContentArea);
        }

        // Show the modal with animation
        articleModal.classList.remove('hidden');
        setTimeout(() => {
            articleModal.style.opacity = '1';
            modalContentBox.style.opacity = '1';
            modalContentBox.style.transform = 'scale(1)';
        }, 10); // Short delay to allow CSS transition
    }
    
    function closeArticleModal() {
        // Animate out
        articleModal.style.opacity = '0';
        modalContentBox.style.opacity = '0';
        modalContentBox.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            articleModal.classList.add('hidden');
            modalContentArea.innerHTML = ''; // Clear content
        }, 300); // Must match CSS transition duration
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