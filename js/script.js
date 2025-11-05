document.addEventListener('DOMContentLoaded', (event) => {
    
    // --- 1. Initialize Lucide Icons ---
    // This function finds all elements with 'data-lucide'
    // and replaces them with SVG icons.
    try {
        lucide.createIcons();
        console.log("Lucide icons initialized.");
    } catch (e) {
        console.error("Error initializing Lucide icons:", e);
    }

    // --- 2. Initialize KaTeX ---
    // This renders all math expressions on the page.
    try {
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ]
            });
            console.log("KaTeX auto-render complete.");
        } else {
            console.warn("KaTeX 'renderMathInElement' not found. Math will not be rendered.");
        }
    } catch (e) {
        console.error("Error rendering KaTeX:", e);
    }
    
    // --- 3. Initialize Prism.js ---
    // This highlights all code blocks.
    try {
            if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
            console.log("Prism.js syntax highlighting complete.");
            } else {
            console.warn("Prism.js not found. Code will not be highlighted.");
            }
    } catch (e) {
        console.error("Error highlighting code with Prism:", e);
    }

    // --- 4. Navigation Scrollspy ---
    // This highlights the active navigation link based on scroll position.
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#nav-links .nav-link');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.4 // 40% of the section must be visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Remove active class from all links
                    navLinks.forEach(link => {
                        link.classList.remove('nav-link-active');
                    });
                    
                    // Add active class to the matching link
                    const activeLink = document.querySelector(`#nav-links .nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('nav-link-active');
                    }
                }
            });
        }, observerOptions);

        // Observe each section
        sections.forEach(section => {
            observer.observe(section);
        });
        console.log("Navigation scrollspy initialized.");
    } else {
        console.warn("Scrollspy not initialized: Sections or Nav links not found.");
    }

    // --- 5. Mobile Menu Toggle ---
    const mobileMenuButton = document.querySelector('button[aria-controls="mobile-menu"]');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon (optional, if you want to switch between 'menu' and 'x')
            // const icon = mobileMenuButton.querySelector('i');
            // icon.setAttribute('data-lucide', isExpanded ? 'menu' : 'x');
            // lucide.createIcons(); // Re-render the icon
        });
        console.log("Mobile menu toggle initialized.");
    }
});