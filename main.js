document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .tag-checkbox');

    // Only enable custom cursor if on non-touch device
    if (window.matchMedia("(pointer: fine)").matches && cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }

    // GSAP Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Initial Hero Animation (Slow, elegant reveal)
        const heroTl = gsap.timeline();
        heroTl.to('.hero-title', {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power4.out',
            delay: 0.3
        })
        .to('.hero-subtitle', {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power4.out'
        }, '-=1.2')
        .to('.hero .gold-btn', {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power4.out'
        }, '-=1.2');

        // Scroll Animations for Sections
        const sections = gsap.utils.toArray('section:not(.hero)');
        
        sections.forEach(section => {
            const title = section.querySelector('.section-title');
            const glassElements = section.querySelectorAll('.glass-premium');
            const splitText = section.querySelector('.split-text');
            const splitImage = section.querySelector('.split-image');
            
            // Animate Section Title
            if (title) {
                gsap.fromTo(title, 
                    { y: 40, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 85%',
                        },
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: 'power3.out'
                    }
                );
            }

            // Animate Glass Cards (Staggered)
            if (glassElements.length > 0) {
                gsap.fromTo(glassElements,
                    { y: 50, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                        },
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        stagger: 0.15,
                        ease: 'power3.out'
                    }
                );
            }
        });

        // Navbar background blur effect on scroll
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenu.classList.remove('hidden');
        });
    }

    const hideMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            // Allow animation to finish before adding hidden
            setTimeout(() => {
                if (!mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.add('hidden');
                }
            }, 400);
        }
    };

    if (closeMenu) {
        closeMenu.addEventListener('click', hideMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', hideMenu);
    });
});
