/**
 * Spotlight Music Events App - Frontend JavaScript
 * Connects to backend API (server.js)
 */

// ================================
// CONFIGURATION
// ================================
const API_URL = window.location.origin; // Uses same origin as frontend
const API_ENDPOINTS = {
    events: `${API_URL}/api/events`,
    stats: `${API_URL}/api/stats`,
    health: `${API_URL}/api/health`,
};

// ================================
// GLOBAL STATE
// ================================
let allEvents = [];
let filteredEvents = [];
let isLoading = false;

// ================================
// INITIALIZATION
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎵 Spotlight initializing...');
    setupEventListeners();
    loadEvents();
    checkAPIHealth();
});

// ================================
// API HEALTH CHECK
// ================================
async function checkAPIHealth() {
    try {
        const response = await fetch(API_ENDPOINTS.health);
        const data = await response.json();
        console.log('✅ API Health:', data.status);
    } catch (error) {
        console.error('❌ API Health Check Failed:', error);
        showToast('Warning: Could not connect to backend API', 'warning');
    }
}

// ================================
// API FUNCTIONS
// ================================

/**
 * Fetch all events from API with optional filters
 */
async function loadEvents(filters = {}) {
    if (isLoading) return;
    
    try {
        isLoading = true;
        showLoading();
        
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.state) queryParams.append('state', filters.state);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.genre) queryParams.append('genre', filters.genre);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.date_from) queryParams.append('date_from', filters.date_from);
        if (filters.date_to) queryParams.append('date_to', filters.date_to);
        
        const url = `${API_ENDPOINTS.events}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            allEvents = data.events || [];
            filteredEvents = [...allEvents];
            console.log(`✅ Loaded ${allEvents.length} events from API`);
            renderEvents(filteredEvents);
        } else {
            throw new Error(data.error || 'Failed to load events');
        }
        
    } catch (error) {
        console.error('Error loading events:', error);
        showToast('Failed to load events. Please try again.', 'error');
        hideLoading();
        showNoResults();
    } finally {
        isLoading = false;
    }
}

/**
 * Create a new event via API
 */
async function createEvent(eventData) {
    try {
        const response = await fetch(API_ENDPOINTS.events, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to create event');
        }
        
        console.log('✅ Event created:', data.event);
        return data.event;
        
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
}

/**
 * Get event statistics from API
 */
async function loadStats() {
    try {
        const response = await fetch(API_ENDPOINTS.stats);
        const data = await response.json();
        
        if (data.success) {
            console.log('📊 Stats:', data.stats);
            return data.stats;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ================================
// EVENT LISTENERS
// ================================
function setupEventListeners() {
    // Navigation
    setupNavigation();
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const genreFilter = document.getElementById('genreFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', performSearch);
    }
    
    if (genreFilter) {
        genreFilter.addEventListener('change', performSearch);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', () => {
            sortEvents(filteredEvents, sortFilter.value);
            renderEvents(filteredEvents);
        });
    }
    
    // Form submission
    const submitForm = document.getElementById('submitForm');
    if (submitForm) {
        submitForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

function setupNavigation() {
    const navLinksElements = document.querySelectorAll('.nav-link');
    const navLinksContainer = document.getElementById('navLinks');
    
    navLinksElements.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                navLinksElements.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                if (navLinksContainer) {
                    navLinksContainer.classList.remove('active');
                }
                const hamburger = document.getElementById('hamburger');
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksElements.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ================================
// SEARCH & FILTER
// ================================
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const genreFilter = document.getElementById('genreFilter');
    
    // Build filters object
    const filters = {
        search: searchInput ? searchInput.value.trim() : '',
        type: typeFilter ? typeFilter.value : '',
        genre: genreFilter ? genreFilter.value : '',
    };
    
    // Remove empty filters
    Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
    });
    
    console.log('🔍 Searching with filters:', filters);
    
    // Reload events with filters from API
    loadEvents(filters);
}

function sortEvents(events, sortOption) {
    switch(sortOption) {
        case 'name':
            events.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'city':
            events.sort((a, b) => a.city.localeCompare(b.city));
            break;
        case 'date':
        default:
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
    }
}

// ================================
// EVENT RENDERING
// ================================
function renderEvents(events) {
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!resultsGrid) return;
    
    resultsGrid.innerHTML = '';
    hideLoading();
    
    if (events.length === 0) {
        resultsGrid.style.display = 'none';
        if (noResults) {
            noResults.classList.add('active');
        }
        return;
    }
    
    if (noResults) {
        noResults.classList.remove('active');
    }
    resultsGrid.style.display = 'grid';
    
    events.forEach(event => {
        const card = createEventCard(event);
        resultsGrid.appendChild(card);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const formattedDate = formatDate(event.date);
    const formattedTime = event.time ? formatTime(event.time) : 'Time TBA';
    
    card.innerHTML = `
        <div class="event-header">
            <h3 class="event-name">${escapeHtml(event.name)}</h3>
            <p class="event-location">📍 ${escapeHtml(event.city)}, ${escapeHtml(event.state)}</p>
        </div>
        
        <div class="event-meta">
            <span class="tag tag-type">${escapeHtml(event.type)}</span>
            <span class="tag tag-genre">${escapeHtml(event.genre)}</span>
        </div>
        
        <p class="event-date">🗓 ${formattedDate} at ${formattedTime}</p>
        
        ${event.description ? `<p class="event-description">${escapeHtml(event.description)}</p>` : ''}
        
        <div class="event-contact">
            ${event.contact_email ? `<div>📧 <a href="mailto:${escapeHtml(event.contact_email)}">${escapeHtml(event.contact_email)}</a></div>` : ''}
            ${event.contact_phone ? `<div>📞 ${escapeHtml(event.contact_phone)}</div>` : ''}
        </div>
        
        <div class="event-actions">
            ${event.contact_email ? `
                <button class="btn btn-secondary btn-small" onclick="contactVenue('${escapeHtml(event.contact_email)}')">
                    Contact Venue
                </button>
            ` : ''}
            ${event.website ? `
                <button class="btn btn-primary btn-small" onclick="visitWebsite('${escapeHtml(event.website)}')">
                    Visit Website
                </button>
            ` : ''}
        </div>
    `;
    
    return card;
}

// ================================
// FORM HANDLING
// ================================
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('eventName').value,
        venue_name: document.getElementById('city').value, // Using venue field
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        type: document.getElementById('eventType').value,
        genre: document.getElementById('eventGenre').value,
        contact_email: document.getElementById('email').value,
        contact_phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        description: document.getElementById('description').value,
    };
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Create event via API
        const newEvent = await createEvent(formData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('submitForm').reset();
        
        // Reload events to show new event
        await loadEvents();
        
        // Scroll to search section
        document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
    } catch (error) {
        console.error('Error submitting event:', error);
        showToast('Failed to submit event: ' + error.message, 'error');
        
        // Re-enable button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Event';
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('active');
        
        setTimeout(() => {
            successMessage.classList.remove('active');
        }, 5000);
    }
}

// ================================
// UI HELPER FUNCTIONS
// ================================
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('active');
    }
    
    const resultsGrid = document.getElementById('resultsGrid');
    if (resultsGrid) {
        resultsGrid.style.display = 'none';
    }
    
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.classList.remove('active');
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('active');
    }
}

function showNoResults() {
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.classList.add('active');
    }
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#22c55e'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ================================
// UTILITY FUNCTIONS
// ================================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function contactVenue(email) {
    window.location.href = `mailto:${email}`;
}

function visitWebsite(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

// ================================
// CSS ANIMATIONS (Add to style.css)
// ================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ================================
// EXPORT FOR TESTING
// ================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadEvents,
        createEvent,
        formatDate,
        formatTime,
        escapeHtml,
    };
}