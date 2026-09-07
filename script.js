// Besties Website - JavaScript

// Navbar hide/show on scroll
const navbar = document.querySelector('.navbar');
let lastScrollY = 0;

// Parallax effect for hero background
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Parallax effect for hero section (only when hero is visible)
    if (heroSection && currentScrollY < heroSection.offsetHeight) {
        const parallaxValue = currentScrollY * 0.3;
        const heroPseudoBg = heroSection.style;
        heroPseudoBg.setProperty('--parallax-offset', `${parallaxValue}px`);
    }

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        navbar.classList.add('hidden');
    } else {
        // Scrolling up
        navbar.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
}, { passive: true });

// Navigation active state
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        navItems.forEach(i => i.classList.remove('active'));
        e.currentTarget.classList.add('active');
    });
});

// Set active state based on current page
const sections = [
    { id: 'home', selector: '.hero', navIndex: 0 },
    { id: 'about', selector: '#about', navIndex: 1 },
    { id: 'podcast', selector: '#podcast', navIndex: 2 },
    { id: 'contact', selector: '#contact', navIndex: 3 }
];

window.addEventListener('scroll', () => {
    let currentSection = null;
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const element = document.querySelector(section.selector);
        if (element) {
            const sectionTop = element.offsetTop;
            const sectionBottom = sectionTop + element.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section;
            }
        }
    });

    if (currentSection) {
        navItems.forEach(i => i.classList.remove('active'));
        navItems[currentSection.navIndex].classList.add('active');
    }
});

// Hero CTA Buttons
const heroCTAs = document.querySelectorAll('.hero-ctas .btn');
if (heroCTAs.length > 0) {
    heroCTAs[0].addEventListener('click', () => {
        document.getElementById('experiences').scrollIntoView({ behavior: 'smooth' });
    });

    heroCTAs[1].addEventListener('click', () => {
        document.querySelector('.meet-besties-wrapper').scrollIntoView({ behavior: 'smooth' });
    });

    heroCTAs[2].addEventListener('click', () => {
        document.getElementById('podcast').scrollIntoView({ behavior: 'smooth' });
    });
}

// Form Submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = signupForm.querySelector('input[type="email"]').value;
        const name = signupForm.querySelector('input[type="text"]').value;
        const age = signupForm.querySelector('select').value;

        // Simple validation
        if (!email || !name || !age) {
            alert('Please fill in all fields');
            return;
        }

        // Success message
        alert(`Welcome ${name}! We've sent a confirmation to ${email}. Get ready to shine! ✨`);
        signupForm.reset();
    });
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.value-card, .episode-card, .bestie-card, .product-card, .focus-card, .detail-box').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// GSAP Hero Button Animations
gsap.from('.hero-ctas .btn', {
    duration: 0.8,
    y: 20,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.6,
    stagger: 0.1
});

// Card hover animations
document.querySelectorAll('.value-card, .bestie-card, .podcast-cover, .experience-card, .shop-product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            y: -8,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.3,
            y: 0,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            ease: 'power2.out'
        });
    });
});

// Section title animations
document.querySelectorAll('h2').forEach(title => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(entry.target, {
                    duration: 0.8,
                    x: -40,
                    opacity: 0,
                    ease: 'power3.out'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(title);
});

// Add to Cart functionality
// Product card add to cart (in product-card elements)
const cartButtons = document.querySelectorAll('.product-card .btn');
cartButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = button.parentElement.querySelector('h4').textContent;
        const price = button.parentElement.querySelector('.product-price').textContent;

        addToCart(productName, price);

        // Show feedback
        const originalText = button.textContent;
        button.textContent = '✓ Added!';
        button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
});

// Conference Registration Button
const conferenceButtons = document.querySelectorAll('.conference-cta .btn');
conferenceButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        const buttonText = button.textContent;
        if (buttonText.includes('Register')) {
            alert('Registration coming soon! Stay tuned for the 2024 Made to Shine Conference.');
        } else if (buttonText.includes('FAQ')) {
            alert('FAQ document ready for download!');
        }
    });
});

// Podcast CTA Buttons
const podcastButtons = document.querySelectorAll('.podcast-ctas .btn');
podcastButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const buttonText = button.textContent;
        if (buttonText.includes('YouTube')) {
            window.open('https://youtube.com', '_blank');
        } else if (buttonText.includes('Episodes')) {
            alert('Episodes section coming soon!');
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            const offset = 70; // Height of navbar
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animate numbers on scroll
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});

// Responsive navigation
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.style.display = 'flex';
        navMenu.style.position = 'static';
    }
});

// Podcast Carousel Navigation - Infinite Loop
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const cardWidth = 280;
const gap = 32;
const cardTotalWidth = cardWidth + gap;
const originalCards = Array.from(carouselTrack.querySelectorAll('.podcast-cover'));
const totalCards = originalCards.length;

// Clone cards for infinite loop effect
originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    carouselTrack.appendChild(clone);
});

originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    carouselTrack.insertBefore(clone, carouselTrack.firstChild);
});

let currentPosition = totalCards * cardTotalWidth;
const isInfiniteScroll = true;

function updateCarousel(smooth = true) {
    if (smooth) {
        carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    } else {
        carouselTrack.style.transition = 'none';
    }
    carouselTrack.style.transform = `translateX(-${currentPosition}px)`;
}

function resetCarouselPosition() {
    currentPosition = totalCards * cardTotalWidth;
    updateCarousel(false);
}

prevBtn.addEventListener('click', () => {
    currentPosition -= cardTotalWidth;
    updateCarousel(true);

    if (currentPosition < cardTotalWidth) {
        setTimeout(() => {
            resetCarouselPosition();
        }, 500);
    }
});

nextBtn.addEventListener('click', () => {
    currentPosition += cardTotalWidth;
    updateCarousel(true);

    if (currentPosition > (totalCards * 2) * cardTotalWidth) {
        setTimeout(() => {
            resetCarouselPosition();
        }, 500);
    }
});

// Initialize carousel position
updateCarousel(false);

// Title Tiles Animation
const titleTiles = document.querySelectorAll('.title-tile');
titleTiles.forEach((tile, index) => {
    tile.addEventListener('mouseenter', () => {
        titleTiles.forEach((t, i) => {
            if (i === index) {
                t.style.transform = 'scale(1.2) rotateZ(5deg)';
                t.style.boxShadow = '0 10px 30px rgba(255, 107, 157, 0.6)';
            } else {
                t.style.opacity = '0.5';
            }
        });
    });

    tile.addEventListener('mouseleave', () => {
        titleTiles.forEach(t => {
            t.style.transform = 'scale(1) rotateZ(0deg)';
            t.style.opacity = '1';
            t.style.boxShadow = '';
        });
    });
});


// Shopping Cart Management
let cart = JSON.parse(localStorage.getItem('bestiesCart')) || [];

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    cartBadge.textContent = cart.length;
}

function addToCart(productName, price) {
    cart.push({ name: productName, price: price.replace('$', '') });
    localStorage.setItem('bestiesCart', JSON.stringify(cart));
    updateCartBadge();
    updateCartDisplay();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('bestiesCart', JSON.stringify(cart));
    updateCartBadge();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        cartTotalPrice.textContent = '$0.00';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map((item, index) => {
        total += parseFloat(item.price);
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</div>
                </div>
                <button class="cart-item-remove" data-index="${index}">×</button>
            </div>
        `;
    }).join('');

    cartTotalPrice.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(parseInt(btn.dataset.index));
        });
    });
}

// Shop Modal
const startShoppingBtn = document.getElementById('startShoppingBtn');
const shopModal = document.getElementById('shopModal');
const closeShopModal = document.getElementById('closeShopModal');

if (startShoppingBtn && shopModal) {
    startShoppingBtn.addEventListener('click', () => {
        shopModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeShopModal.addEventListener('click', () => {
        shopModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    shopModal.addEventListener('click', (e) => {
        if (e.target === shopModal) {
            shopModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Add to cart functionality
    const addCartButtons = document.querySelectorAll('.shop-add-cart');
    addCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = button.parentElement.querySelector('h3').textContent;
            const productPrice = button.parentElement.querySelector('.shop-product-price').textContent;

            addToCart(productName, productPrice);

            const originalText = button.textContent;
            button.textContent = '✓ Added!';
            button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        });
    });
}

// Cart Modal
const cartIcon = document.getElementById('cartIcon');
const cartDrawer = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartModal = document.getElementById('closeCartModal');
const continueShopping = document.getElementById('continueShopping');
const checkoutBtn = document.getElementById('checkoutBtn');

if (cartIcon && cartDrawer && cartOverlay) {
    // Open cart
    cartIcon.addEventListener('click', () => {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close cart button
    closeCartModal.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Continue shopping button
    continueShopping.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on overlay click
    cartOverlay.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        openCheckout();
    });
}

// Checkout Modal
const checkoutModal = document.getElementById('checkoutModal');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const closeCheckout = document.getElementById('closeCheckout');
const backToCartBtn = document.getElementById('backToCart');
const completeOrderBtn = document.getElementById('completeOrderBtn');
const checkoutForm = document.getElementById('checkoutForm');

function openCheckout() {
    checkoutModal.classList.add('active');
    checkoutOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCheckoutDisplay();
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    checkoutOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function updateCheckoutDisplay() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    let total = 0;
    checkoutItems.innerHTML = cart.map((item, index) => {
        total += parseFloat(item.price);
        return `
            <div class="checkout-item">
                <span>${item.name}</span>
                <span>$${parseFloat(item.price).toFixed(2)}</span>
            </div>
        `;
    }).join('');

    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

if (closeCheckout) {
    closeCheckout.addEventListener('click', closeCheckoutModal);
}

if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', closeCheckoutModal);
}

if (backToCartBtn) {
    backToCartBtn.addEventListener('click', () => {
        closeCheckoutModal();
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
    });
}

// Payment Method Selection
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const cardDetails = document.getElementById('card-details');

paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const paymentMethod = e.target.value;

        if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
            cardDetails.classList.add('active');
            // Make card fields required
            cardDetails.querySelectorAll('input').forEach(input => {
                input.required = true;
            });
        } else {
            cardDetails.classList.remove('active');
            // Make card fields not required
            cardDetails.querySelectorAll('input').forEach(input => {
                input.required = false;
                input.value = '';
            });
        }
    });
});

if (completeOrderBtn) {
    completeOrderBtn.addEventListener('click', () => {
        const fullName = checkoutForm.querySelector('input[placeholder="John Doe"]').value;
        const email = checkoutForm.querySelector('input[type="email"]').value;
        const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

        if (!fullName || !email) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate card details if credit/debit card selected
        if (selectedPayment === 'credit-card' || selectedPayment === 'debit-card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;

            if (!cardNumber || !expiryDate || !cvv) {
                alert('Please fill in all card details');
                return;
            }
        }

        const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
        const paymentMethodDisplay = selectedPayment.replace('-', ' ').toUpperCase();

        alert(`Thank you for your order, ${fullName}!\n\nOrder Total: $${total}\nPayment Method: ${paymentMethodDisplay}\nConfirmation sent to ${email}\n\nThank you for shopping at Besties!`);

        cart = [];
        localStorage.setItem('bestiesCart', JSON.stringify(cart));
        updateCartBadge();
        updateCartDisplay();
        closeCheckoutModal();
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        checkoutForm.reset();
    });
}

// Initialize cart display
updateCartBadge();
updateCartDisplay();

// Dynamic Navbar Icon Color Based on Background
function updateNavbarColors() {
    const navItems = document.querySelectorAll('.nav-item');
    const navIcons = document.querySelectorAll('.nav-icon');
    const scrollPosition = window.scrollY + 100;

    const sections = [
        { element: document.querySelector('.hero'), isDark: false },
        { element: document.querySelector('.about'), isDark: false },
        { element: document.querySelector('.podcast'), isDark: true },
        { element: document.querySelector('.experiences'), isDark: true },
        { element: document.querySelector('.contact'), isDark: false },
        { element: document.querySelector('footer'), isDark: false }
    ];

    for (let section of sections) {
        if (section.element) {
            const sectionTop = section.element.offsetTop;
            const sectionBottom = sectionTop + section.element.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const iconColor = section.isDark ? '#FFFFFF' : '#333333';

                navIcons.forEach(icon => {
                    icon.style.color = iconColor;
                });

                navItems.forEach(item => {
                    item.style.color = iconColor;
                });
                break;
            }
        }
    }
}

window.addEventListener('scroll', updateNavbarColors);
window.addEventListener('load', updateNavbarColors);
updateNavbarColors();



// Experience Carousel Add to Cart - Using event delegation for cloned elements
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('experience-book')) {
        const button = e.target;
        const productName = button.parentElement.querySelector('h3').textContent;
        const productPrice = button.parentElement.querySelector('.experience-price').textContent;

        addToCart(productName, productPrice);

        const originalText = button.textContent;
        button.textContent = '✓ Added!';
        button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
});

// Experience Carousel Navigation - Infinite Loop
const experienceCarouselTrack = document.getElementById('experienceCarouselTrack');
const expPrevBtn = document.getElementById('expPrevBtn');
const expNextBtn = document.getElementById('expNextBtn');

if (experienceCarouselTrack) {
    const expCardWidth = 320;
    const expGap = 32;
    const expCardTotalWidth = expCardWidth + expGap;
    const originalExpCards = Array.from(experienceCarouselTrack.querySelectorAll('.experience-card'));
    const totalExpCards = originalExpCards.length;

    // Clone cards for infinite loop effect
    originalExpCards.forEach(card => {
        const clone = card.cloneNode(true);
        experienceCarouselTrack.appendChild(clone);
    });

    originalExpCards.forEach(card => {
        const clone = card.cloneNode(true);
        experienceCarouselTrack.insertBefore(clone, experienceCarouselTrack.firstChild);
    });

    let expCurrentPosition = totalExpCards * expCardTotalWidth;

    function updateExpCarousel(smooth = true) {
        if (smooth) {
            experienceCarouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        } else {
            experienceCarouselTrack.style.transition = 'none';
        }
        experienceCarouselTrack.style.transform = `translateX(-${expCurrentPosition}px)`;
    }

    function resetExpCarouselPosition() {
        expCurrentPosition = totalExpCards * expCardTotalWidth;
        updateExpCarousel(false);
    }

    expPrevBtn.addEventListener('click', () => {
        expCurrentPosition -= expCardTotalWidth;
        updateExpCarousel(true);

        if (expCurrentPosition < expCardTotalWidth) {
            setTimeout(() => {
                resetExpCarouselPosition();
            }, 500);
        }
    });

    expNextBtn.addEventListener('click', () => {
        expCurrentPosition += expCardTotalWidth;
        updateExpCarousel(true);

        if (expCurrentPosition > (totalExpCards * 2) * expCardTotalWidth) {
            setTimeout(() => {
                resetExpCarouselPosition();
            }, 500);
        }
    });

    // Initialize carousel position
    updateExpCarousel(false);
}

// Instagram Integration
const instagramUsername = 'eglistudios';
const instagramHandle = 'https://www.instagram.com/eglistudios';

// Function to fetch Instagram posts using a public endpoint
async function fetchInstagramPosts() {
    try {
        // Try to fetch from Instagram public endpoint
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`https://www.instagram.com/${instagramUsername}/`, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Instagram fetch failed');
        }

        const html = await response.text();

        // Extract JSON data from Instagram page
        const jsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        if (jsonMatch && jsonMatch[1]) {
            const jsonData = JSON.parse(jsonMatch[1]);
            console.log('Successfully fetched Instagram data');
            renderInstagramPosts(getInstagramFallbackData());
            return;
        }

        renderInstagramPosts(getInstagramFallbackData());
    } catch (error) {
        console.log('Instagram fetch error (expected for CORS restrictions):', error.message);
        console.log('Using local Instagram data - all posts will link to @eglistudios');
        renderInstagramPosts(getInstagramFallbackData());
    }
}

// Fallback Instagram data if API fetch fails
function getInstagramFallbackData() {
    return [
        {
            id: '1',
            image: 'assets/image_28.jpg',
            caption: 'Check out our latest Instagram post! Follow @eglistudios for daily inspiration.',
            date: 'Today',
            url: 'https://www.instagram.com/eglistudios',
            likes: 150,
            category: 'instagram'
        },
        {
            id: '2',
            image: 'assets/image_29.jpg',
            caption: 'Connecting with our community. Real talks, real girls, real friendships.',
            date: 'Yesterday',
            url: 'https://www.instagram.com/eglistudios',
            likes: 200,
            category: 'instagram'
        },
        {
            id: '3',
            image: 'assets/image_30.jpg',
            caption: 'Made to Shine - Empowering the next generation of confident girls.',
            date: '2 days ago',
            url: 'https://www.instagram.com/eglistudios',
            likes: 320,
            category: 'instagram'
        },
        {
            id: '4',
            image: 'assets/image_31.jpg',
            caption: 'New podcast episode out now! Tune in to hear from our featured guests.',
            date: '3 days ago',
            url: 'https://www.instagram.com/eglistudios',
            likes: 280,
            category: 'instagram'
        },
        {
            id: '5',
            image: 'assets/image_32.jpg',
            caption: 'Behind the scenes of creating content that matters to you.',
            date: '4 days ago',
            url: 'https://www.instagram.com/eglistudios',
            likes: 195,
            category: 'instagram'
        },
        {
            id: '6',
            image: 'assets/image_33.jpg',
            caption: 'Your story matters. Share your journey with the Besties community!',
            date: '5 days ago',
            url: 'https://www.instagram.com/eglistudios',
            likes: 410,
            category: 'instagram'
        }
    ];
}

// Render Instagram posts as blog cards
function renderInstagramPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    blogGrid.innerHTML = posts.map(post => `
        <article class="blog-card" data-category="instagram">
            <div class="blog-image">
                <img src="${post.image}" alt="${post.caption.substring(0, 50)}">
                <span class="blog-category">Instagram</span>
            </div>
            <div class="blog-content">
                <h3>${post.caption.substring(0, 50)}${post.caption.length > 50 ? '...' : ''}</h3>
                <p class="blog-excerpt">${post.caption.substring(0, 120)}${post.caption.length > 120 ? '...' : ''}</p>
                <div class="blog-meta">
                    <span class="blog-date">${post.date}</span>
                    <a href="${post.url}" target="_blank" class="blog-read-more">View Post →</a>
                </div>
            </div>
        </article>
    `).join('');

    // Re-attach blog filter functionality
    setupBlogFilters();
}

// Setup blog filter functionality
function setupBlogFilters() {
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            // Filter cards
            blogCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Gallery Modal with Genie Animation
let clickedGalleryItem = null;

function initGalleryModal() {
    const galleryModalOverlay = document.getElementById('galleryModalOverlay');
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalImage = document.getElementById('galleryModalImage');
    const galleryModalClose = document.getElementById('galleryModalClose');

    if (!galleryModalOverlay || !galleryModal) {
        console.log('Gallery modal elements not found');
        return;
    }

    // Add click handlers to gallery items
    document.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem && galleryItem.querySelector('img')) {
            clickedGalleryItem = galleryItem;
            const img = galleryItem.querySelector('img');
            if (img && img.src) {
                galleryModalImage.src = img.src;
                openGalleryModal(galleryItem, galleryModalOverlay, galleryModal);
            }
        }
    });

    function openGalleryModal(galleryItem, overlay, modal) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Get the position and size of the clicked gallery item
        const rect = galleryItem.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        // Set initial state for genie animation
        gsap.set(modal, {
            x: startX - window.innerWidth / 2,
            y: startY - window.innerHeight / 2,
            scale: 0.1,
            rotation: -15,
            opacity: 0
        });

        // Animate to center with genie effect
        gsap.to(modal, {
            duration: 0.8,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            ease: 'back.out(1.2)',
            overwrite: 'auto'
        });

        // Animate overlay
        gsap.from(overlay, {
            duration: 0.8,
            opacity: 0,
            ease: 'power2.out'
        });
    }

    function closeGalleryModal(overlay, modal) {
        if (!clickedGalleryItem) {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            return;
        }

        // Get the position of the original gallery item
        const rect = clickedGalleryItem.getBoundingClientRect();
        const endX = rect.left + rect.width / 2;
        const endY = rect.top + rect.height / 2;

        // Animate back to gallery item position (genie exit)
        gsap.to(modal, {
            duration: 0.6,
            x: endX - window.innerWidth / 2,
            y: endY - window.innerHeight / 2,
            scale: 0.05,
            rotation: 15,
            opacity: 0,
            ease: 'back.in(1.2)',
            onComplete: () => {
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Fade out overlay
        gsap.to(overlay, {
            duration: 0.6,
            opacity: 0,
            ease: 'power2.in'
        });
    }

    // Close modal on button click
    galleryModalClose.addEventListener('click', () => closeGalleryModal(galleryModalOverlay, galleryModal));

    // Close modal on overlay click
    galleryModalOverlay.addEventListener('click', (e) => {
        if (e.target === galleryModalOverlay) {
            closeGalleryModal(galleryModalOverlay, galleryModal);
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && galleryModalOverlay.classList.contains('active')) {
            closeGalleryModal(galleryModalOverlay, galleryModal);
        }
    });
}

// Initialize gallery modal when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryModal);
} else {
    initGalleryModal();
}

// Initialize
console.log('Besties website loaded! Made to Shine ✨');

// Initialize cart on page load
updateCartBadge();
updateCartDisplay();

// Fetch and render Instagram posts when page loads
window.addEventListener('load', () => {
    fetchInstagramPosts();
});

// Log when page is fully loaded
window.addEventListener('load', () => {
    console.log('All resources loaded!');
    updateCartBadge();
    updateCartDisplay();
});

// Contact Form Handler with reCAPTCHA
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if reCAPTCHA is completed
            const recaptchaResponse = grecaptcha.getResponse();
            
            if (!recaptchaResponse) {
                alert('❌ Please complete the reCAPTCHA verification');
                return;
            }
            
            const name = document.getElementById('name').value;
            const subject = document.getElementById('subject').value;
            
            // Demo success message
            alert(`✨ Thank you ${name}!\n\nYour message about "${subject}" has been received.\n\nWe'll get back to you soon at myeglistudios@gmail.com`);
            
            // Reset form and reCAPTCHA
            contactForm.reset();
            grecaptcha.reset();
        });
    }

    // Newsletter Form Handler
    const footerNewsletterForm = document.getElementById('footerNewsletterForm');
    if (footerNewsletterForm) {
        footerNewsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = footerNewsletterForm.querySelector('input[type="email"]').value;

            if (email) {
                // Show success message
                const btn = footerNewsletterForm.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = '✓ Subscribed!';
                btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

                // Reset after 2 seconds
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    footerNewsletterForm.reset();
                }, 2000);
            }
        });
    }
});
