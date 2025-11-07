// App entry (vanilla JS) — uses data/data.json and GSAP for animations

let treksData = [];
let testimonials = [];
let currentSlide = 0;
let currentTestimonial = 0;
let selectedRating = 0;
let filteredPackages = [];

async function loadData() {
    try {
        const res = await fetch('data/data.json');
        const data = await res.json();
        treksData = data.treks || [];
        testimonials = data.testimonials || [];
        filteredPackages = [...treksData];
    } catch (err) {
        console.error('Failed to load data', err);
        treksData = [];
        testimonials = [];
        filteredPackages = [];
    }
}

function init() {
    renderFeaturedTreks();
    renderTestimonials();
    startHeroSlider();
    startTestimonialSlider();
    setupScrollEffects();
    setupObservers();
    bindUI();
}

function bindUI() {
    document.getElementById('hamburger')?.addEventListener('click', toggleMenu);
    document.getElementById('searchBar')?.addEventListener('input', handleSearch);
    document.addEventListener('keydown', handleGlobalKeys);
}

function handleGlobalKeys(e) {
    if (e.key === 'Escape') {
        closeReviewModal();
        closeLightbox();
        closeMenu();
    }
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMenu() {
    document.getElementById('navLinks')?.classList.remove('active');
    document.getElementById('hamburger')?.classList.remove('active');
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageMap = {
        'home': 'homePage',
        'packages': 'packagesPage',
        'detail': 'detailPage',
        'about': 'aboutPage',
        'contact': 'contactPage'
    };
    const id = pageMap[page];
    if (id) document.getElementById(id)?.classList.add('active');
    if (page === 'packages') renderAllPackages();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
}

// Hero slider using GSAP
function startHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    // show first
    slides.forEach((s, i) => s.style.opacity = i === 0 ? '1' : '0');

    // timeline
    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 1.5, ease: 'power2.inOut' } });
    slides.forEach((s, i) => {
        tl.to(slides[i], { opacity: 1 }, '+=3');
        tl.to(slides[i], { opacity: 0 }, '+=3');
    });
}

// IntersectionObserver for card entrances
function setupObservers() {
    const q = (sel) => document.querySelectorAll(sel);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    q('.trek-card').forEach(el => {
        gsap.set(el, { autoAlpha: 0, y: 20 });
        observer.observe(el);
    });

    q('.feature-card').forEach(el => {
        gsap.set(el, { autoAlpha: 0, y: 20 });
        observer.observe(el);
    });
}

function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
    });
}

// Render functions
function renderFeaturedTreks() {
    const container = document.getElementById('featuredTreks');
    if (!container) return;
    const featured = treksData.slice(0, 6);
    container.innerHTML = featured.map(trek => trekCardHTML(trek, true)).join('');
}

function renderAllPackages() {
    const container = document.getElementById('allPackages');
    const count = document.getElementById('resultsCount');
    if (!container || !count) return;
    count.textContent = `Showing ${filteredPackages.length} ${filteredPackages.length === 1 ? 'package' : 'packages'}`;
    container.innerHTML = filteredPackages.map(trek => trekCardHTML(trek, false)).join('');
}

function trekCardHTML(trek, featured=false) {
    return `
    <div class="trek-card" role="button" tabindex="0" onclick="showTrekDetail(${trek.id})" onkeypress="(event.key==='Enter') && showTrekDetail(${trek.id})">
        <div class="trek-image-container">
            <img src="${trek.image}" loading="lazy" alt="${trek.title}" class="trek-image">
            <div class="trek-badge">${featured ? 'Featured' : trek.type}</div>
        </div>
        <div class="trek-content">
            <div class="trek-title">${trek.title}</div>
            <p class="trek-description">${trek.description}</p>
            <div class="trek-meta">
                <span>📅 ${trek.duration} days</span>
                <span>⛰️ ${trek.difficulty}</span>
                <span class="rating">⭐ ${trek.rating} (${trek.reviews || 0})</span>
            </div>
            <div class="trek-footer">
                <div class="trek-price">${trek.price} <span>/ person</span></div>
                <button class="view-details" aria-label="View details for ${trek.title}">View Details →</button>
            </div>
        </div>
    </div>
    `;
}

function renderTestimonials() {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;
    container.innerHTML = testimonials.map((t, index) => `
        <div class="testimonial ${index === 0 ? 'active' : ''}">
            <img src="${t.image}" alt="${t.name}" class="testimonial-image">
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-author">${t.name} - ${t.country}</div>
            <div class="testimonial-stars">${'⭐'.repeat(t.rating)}</div>
        </div>
    `).join('');

    const dots = document.getElementById('testimonialDots');
    if (dots) dots.innerHTML = testimonials.map((_, i) => `<span class="dot ${i===0? 'active':''}" onclick="showTestimonial(${i})"></span>`).join('');
}

function showTestimonial(index) {
    document.querySelectorAll('.testimonial').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.slider-nav .dot').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.testimonial')[index]?.classList.add('active');
    document.querySelectorAll('.slider-nav .dot')[index]?.classList.add('active');
    currentTestimonial = index;
}

function startTestimonialSlider() {
    if (!testimonials.length) return;
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 6000);
}

// Filters & Search
function applyFilters() {
    const destinations = Array.from(document.querySelectorAll('#nepal, #bhutan, #tibet, #india')).filter(cb=>cb.checked).map(cb=>cb.nextElementSibling.textContent);
    const types = Array.from(document.querySelectorAll('#trek, #tour, #climb')).filter(cb=>cb.checked).map(cb=>cb.nextElementSibling.textContent);
    const difficulties = Array.from(document.querySelectorAll('#easy, #moderate, #challenging')).filter(cb=>cb.checked).map(cb=>cb.nextElementSibling.textContent);

    filteredPackages = treksData.filter(trek => {
        const destMatch = destinations.length===0 || destinations.some(d => trek.destination.toLowerCase().includes(d.toLowerCase()));
        const typeMatch = types.length===0 || types.some(t => trek.type.toLowerCase().includes(t.toLowerCase()));
        const diffMatch = difficulties.length===0 || difficulties.some(d => trek.difficulty.toLowerCase()===d.toLowerCase());
        return destMatch && typeMatch && diffMatch;
    });
    renderAllPackages();
}

function sortPackages(criteria) {
    switch(criteria) {
        case 'price-low': filteredPackages.sort((a,b)=>a.price-b.price); break;
        case 'price-high': filteredPackages.sort((a,b)=>b.price-a.price); break;
        case 'duration': filteredPackages.sort((a,b)=>a.duration-b.duration); break;
        default: filteredPackages.sort((a,b)=>b.rating-a.rating);
    }
    renderAllPackages();
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    if (query.length > 2) {
        filteredPackages = treksData.filter(trek => trek.title.toLowerCase().includes(query) || trek.description.toLowerCase().includes(query) || trek.destination.toLowerCase().includes(query));
        if (document.getElementById('packagesPage')?.classList.contains('active')) renderAllPackages();
    } else if (query.length === 0) {
        filteredPackages = [...treksData];
        if (document.getElementById('packagesPage')?.classList.contains('active')) renderAllPackages();
    }
}

// Detail page & booking
function showTrekDetail(id) {
    const trek = treksData.find(t=>t.id===id);
    if (!trek) return;
    document.getElementById('detailHeroImage').src = trek.image;
    document.getElementById('detailTitle').textContent = trek.title;
    document.getElementById('detailMeta').innerHTML = `
        <span style="color: white;">📅 ${trek.duration} days</span>
        <span style="color: white;">⛰️ ${trek.difficulty}</span>
        <span style="color: white;">📍 ${trek.destination}</span>
        <span style="color: white;">⭐ ${trek.rating}/5 (${trek.reviews} reviews)</span>
    `;
    document.getElementById('detailOverview').textContent = trek.overview || trek.description;
    document.getElementById('bookingPrice').innerHTML = `${trek.price} <span>/ person</span>`;
    document.getElementById('bookingRating').innerHTML = `<span class="rating" style="font-size:20px;">⭐ ${trek.rating}/5</span> <span style="color:#666;">(${trek.reviews} reviews)</span>`;
    document.getElementById('detailIncluded').innerHTML = (trek.included||[]).map(i=>`<li>${i}</li>`).join('');
    document.getElementById('detailExcluded').innerHTML = (trek.excluded||[]).map(i=>`<li>${i}</li>`).join('');
    if ((trek.itinerary||[]).length>0) {
        document.getElementById('itineraryAccordion').innerHTML = (trek.itinerary||[]).map(day=>`
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <div>
                        <div class="accordion-title">Day ${day.day}: ${day.title}</div>
                        ${day.distance? `<div class="accordion-meta">🥾 ${day.distance} | 📍 ${day.elevation}</div>`: ''}
                    </div>
                    <div class="accordion-toggle">+</div>
                </div>
                <div class="accordion-content"><div class="accordion-body">${day.description}</div></div>
            </div>
        `).join('');
    }
    renderReviews();
    if ((trek.gallery||[]).length>0) document.getElementById('detailGallery').innerHTML = trek.gallery.map(img=>`<div class="gallery-item" onclick="openLightbox('${img}')"><img src="${img}" loading="lazy" alt="Trek photo"></div>`).join('');
    showPage('detail');
}

function submitBooking(e) {
    e.preventDefault();
    alert('✅ Thank you for your booking request! We will contact you within 24 hours to confirm details.');
    e.target.reset();
}

function submitContact(e) {
    e.preventDefault();
    alert('✅ Thank you for contacting us! We will respond to your inquiry within 24 hours.');
    e.target.reset();
}

function subscribeNewsletter(e) {
    e.preventDefault();
    alert('✅ Thank you for subscribing! Check your email for exclusive deals and trek tips.');
    e.target.reset();
}

// Reviews
function renderReviews() {
    const reviews = [
        { name: "John Smith", rating: 5, date: "2 weeks ago", text: "Absolutely amazing experience! Our guide was fantastic and the views were incredible.", verified: true },
        { name: "Lisa Wang", rating: 5, date: "1 month ago", text: "Best trek of my life. Super Treks took care of everything seamlessly.", verified: true },
        { name: "Carlos Rodriguez", rating: 4, date: "2 months ago", text: "Great trek with professional guides. Highly recommended!", verified: true }
    ];
    document.getElementById('reviewsList').innerHTML = reviews.map(review=>`
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" class="reviewer-avatar" alt="${review.name}">
                    <div>
                        <div class="reviewer-name">${review.name}</div>
                        ${review.verified? '<div class="verified-badge">✓ Verified Trekker</div>':''}
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-stars">${'⭐'.repeat(review.rating)}</div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

// Accordion
function toggleAccordion(header) {
    const item = header.parentElement;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.accordion-item').forEach(i=>i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}

// Chat
function toggleChat() { document.getElementById('chatWindow')?.classList.toggle('active'); }
function handleChatEnter(e) { if (e.key === 'Enter') sendChatMessage(); }

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML += `<div class="chat-message user">${escapeHtml(message)}</div>`;
    input.value = '';
    setTimeout(()=>{
        let botResponse = "Thank you for your message! ";
        const m = message.toLowerCase();
        if (m.includes('price')||m.includes('cost')) botResponse += "Our treks range from $899 to $2499. Would you like details about a specific trek?";
        else if (m.includes('book')) botResponse += "Visit our packages page or fill out the booking form on any trek detail page.";
        else if (m.includes('difficulty')||m.includes('fit')) botResponse += "We offer treks for all fitness levels. Would you like recommendations based on your experience?";
        else botResponse += "A team member will contact you shortly. Call us at +977-1-4567890 or WhatsApp +977-9841234567.";
        messagesContainer.innerHTML += `<div class="chat-message bot">${botResponse}</div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 800);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Review modal accessibility
function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.add('active');
    trapFocus(modal);
}
function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.remove('active');
    releaseFocusTrap();
    selectedRating = 0; updateStarDisplay();
}

function setRating(rating) { selectedRating = rating; updateStarDisplay(); }
function updateStarDisplay(){ document.querySelectorAll('.star').forEach((star,i)=>{ if (i<selectedRating){ star.textContent='★'; star.classList.add('active'); } else { star.textContent='☆'; star.classList.remove('active'); }}); }
function submitReview(e){ e.preventDefault(); if (selectedRating===0){ alert('⚠️ Please select a rating!'); return; } alert('✅ Thank you for your review! It will be published after verification.'); closeReviewModal(); e.target.reset(); }

// Lightbox
function openLightbox(src){ const lb = document.getElementById('lightbox'); lb.classList.add('active'); document.getElementById('lightboxImage').src = src; trapFocus(lb); }
function closeLightbox(){ const lb = document.getElementById('lightbox'); lb.classList.remove('active'); releaseFocusTrap(); }

// Simple focus trap implementation
let _focusTrap = null;
function trapFocus(container){ const focusable = container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'); if (!focusable.length) return; const first = focusable[0]; const last = focusable[focusable.length-1]; first.focus(); _focusTrap = (e)=>{ if (e.key === 'Tab'){
        if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
    if (e.key === 'Escape'){ container.classList.remove('active'); releaseFocusTrap(); }
}; document.addEventListener('keydown', _focusTrap);
}
function releaseFocusTrap(){ if (_focusTrap) document.removeEventListener('keydown', _focusTrap); _focusTrap = null; }

// Utilities
function escapeHtml(s){ return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

// Initialization flow
window.addEventListener('DOMContentLoaded', async ()=>{
    await loadData();
    init();
    // delegate handlers for forms (these exist in markup)
    document.getElementById('bookingForm')?.addEventListener('submit', submitBooking);
    document.getElementById('contactForm')?.addEventListener('submit', submitContact);
    document.querySelector('.newsletter-form')?.addEventListener('submit', subscribeNewsletter);
    document.getElementById('reviewForm')?.addEventListener('submit', submitReview);
});
