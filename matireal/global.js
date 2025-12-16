document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Logic
    const header = document.querySelector('.global-header');
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        // Toggle Logic
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // 2. Add 'scrolled' class to header on scroll
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 3. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
