const mockEvents = [
    {
        id: 1,
        name: "Blues Night Open Mic",
        venue_name: "The Howlin' Wolf",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-20",
        time: "19:00",
        type: "Open Mic",
        genre: "Jazz",
        email: "blues@harmonycafe.com",
        phone: "(615) 555-0123",
        website: "https://harmonycafe.com",
        description: "Weekly blues and jazz open mic night. Bring your instrument and join our house band for an unforgettable evening."
    },
    {
        id: 2,
        name: "Rock Showcase Weekend",
        venue_name: "Preservation Hall",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-22",
        time: "20:00",
        type: "Showcase",
        genre: "Rock",
        email: "bookings@rockhaus.com",
        phone: "(512) 555-0456",
        website: "https://rockhaus.com",
        description: "Three nights of the best local rock bands. Submit your demo for a chance to open for national touring acts."
    },
    {
        id: 3,
        name: "Acoustic Sunday Sessions",
        venue_name: "Coffee Grove",
        city: "Nashville",
        state: "TN",
        date: "2025-10-25",
        time: "14:00",
        type: "Open Mic",
        genre: "Acoustic",
        email: "info@coffeegrove.com",
        phone: "(503) 555-0789",
        website: "https://coffeegrove.com",
        description: "Relaxed afternoon acoustic sessions in our cozy cafe. Perfect for singer-songwriters and solo artists."
    },
    {
        id: 4,
        name: "Hip-Hop Cypher Night",
        venue_name: "Urban Lounge",
        city: "Atlanta",
        state: "GA",
        date: "2025-10-23",
        time: "21:00",
        type: "Jam Session",
        genre: "Hip-Hop",
        email: "beats@urbanlounge.com",
        phone: "(404) 555-0234",
        website: "https://urbanlounge.com",
        description: "Freestyle battles, live beats, and networking for hip-hop artists. DJ and sound engineer on site."
    },
    {
        id: 5,
        name: "Country Nights at The Barn",
        venue_name: "The Barn Venue",
        city: "Nashville",
        state: "TN",
        date: "2025-10-26",
        time: "18:30",
        type: "Gig Night",
        genre: "Country",
        email: "events@thebarnvenue.com",
        phone: "(615) 555-0567",
        website: "https://thebarnvenue.com",
        description: "Looking for country and bluegrass acts. Pay per performance. Full PA system and stage lighting provided."
    },
    {
        id: 6,
        name: "Jazz Jam at Blue Note",
        venue_name: "Blue Note",
        city: "New York",
        state: "NY",
        date: "2025-10-24",
        time: "22:00",
        type: "Jam Session",
        genre: "Jazz",
        email: "info@bluenote.com",
        phone: "(212) 555-0890",
        website: "https://bluenote.com",
        description: "Late night jazz jam with professional musicians. All skill levels welcome. House trio provides backing."
    },
    {
        id: 7,
        name: "Indie Pop Showcase",
        venue_name: "Echo Club",
        city: "Los Angeles",
        state: "CA",
        date: "2025-10-28",
        time: "19:30",
        type: "Showcase",
        genre: "Pop",
        email: "bookings@echoclub.com",
        phone: "(323) 555-0123",
        website: "https://echoclub.com",
        description: "Monthly indie pop showcase featuring emerging artists. Industry professionals in attendance."
    },
    {
        id: 8,
        name: "Open Mic Mondays",
        venue_name: "Green Light Cafe",
        city: "Seattle",
        state: "WA",
        date: "2025-10-27",
        time: "19:00",
        type: "Open Mic",
        genre: "Acoustic",
        email: "openmic@greenlightcafe.com",
        phone: "(206) 555-0345",
        website: "https://greenlightcafe.com",
        description: "All genres welcome. Sign up starts at 6 PM. 15-minute slots available. Full backline provided."
    },
    {
        id: 9,
        name: "Rock Battle of the Bands",
        venue_name: "Metro Club",
        city: "Chicago",
        state: "IL",
        date: "2025-10-29",
        time: "20:00",
        type: "Gig Night",
        genre: "Rock",
        email: "compete@metroclub.com",
        phone: "(312) 555-0678",
        website: "https://metroclub.com",
        description: "Monthly battle competition with cash prizes. Winner gets studio time and promotional package."
    },
    {
        id: 10,
        name: "Songwriter Circle",
        venue_name: "Listener Inc",
        city: "Denver",
        state: "CO",
        date: "2025-10-30",
        time: "18:00",
        type: "Open Mic",
        genre: "Acoustic",
        email: "songs@listenerinc.com",
        phone: "(303) 555-0901",
        website: "https://listenerinc.com",
        description: "Intimate songwriter-focused event. Share your original material in a supportive environment."
    },
    {
        id: 11,
        name: "Electronic Music Night",
        venue_name: "Neon Wave",
        city: "Miami",
        state: "FL",
        date: "2025-10-31",
        time: "22:00",
        type: "Showcase",
        genre: "Pop",
        email: "dj@neonwave.com",
        phone: "(305) 555-0234",
        website: "https://neonwave.com",
        description: "Electronic producers and live performers wanted. Full lighting rig and professional sound system."
    },
    {
        id: 12,
        name: "Thursday Jazz Lounge",
        venue_name: "Jazz Cellar",
        city: "San Francisco",
        state: "CA",
        date: "2025-10-23",
        time: "20:30",
        type: "Gig Night",
        genre: "Jazz",
        email: "booking@jazzcellar.com",
        phone: "(415) 555-0567",
        website: "https://jazzcellar.com",
        description: "Seeking jazz trios and quartets for weekly residency. Paid gigs with potential for return bookings."
    },
    {
        id: 13,
        name: "Folk & Americana Festival",
        venue_name: "Mountain Music Hall",
        city: "Asheville",
        state: "NC",
        date: "2025-11-02",
        time: "12:00",
        type: "Showcase",
        genre: "Country",
        email: "festival@mountainmusic.com",
        phone: "(828) 555-0890",
        website: "https://mountainmusic.com",
        description: "All-day outdoor festival featuring folk, americana, and roots music. Multiple stages and vendors."
    },
    {
        id: 14,
        name: "Hip-Hop Open Stage",
        venue_name: "Underground Philly",
        city: "Philadelphia",
        state: "PA",
        date: "2025-10-26",
        time: "21:00",
        type: "Open Mic",
        genre: "Hip-Hop",
        email: "stage@undergroundphilly.com",
        phone: "(215) 555-0123",
        website: "https://undergroundphilly.com",
        description: "Underground hip-hop venue. Bring your A-game. Live DJ, professional sound, and enthusiastic crowd."
    },
    {
        id: 15,
        name: "Sunday Soul Sessions",
        venue_name: "Motown Live",
        city: "Detroit",
        state: "MI",
        date: "2025-10-26",
        time: "17:00",
        type: "Jam Session",
        genre: "Jazz",
        email: "soul@motown-live.com",
        phone: "(313) 555-0456",
        website: "https://motown-live.com",
        description: "Soul, R&B, and funk jam session. House band backs vocalists and instrumentalists. All welcome."
    }
];

// Make mockEvents available globally for Firebase integration
window.mockEvents = mockEvents;

// ================================
// GLOBAL STATE
// ================================
let allEvents = [];
let filteredEvents = [];

// ================================
// INITIALIZATION
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    performInitialSearch();
});

function initializeApp() {
    // Start with mock data, Firebase will merge its data when loaded
    allEvents = [...mockEvents];
    filteredEvents = [...allEvents];
}

// ================================
// EVENT LISTENERS
// ================================
function setupEventListeners() {
    // Navigation
    setupNavigation();
    
    // Hero search (main search)
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    const heroSearchInput = document.getElementById('heroSearchInput');
    
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', () => {
            const searchTerm = heroSearchInput.value;
            showResultsPage(searchTerm);
        });
    }
    
    if (heroSearchInput) {
        heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = heroSearchInput.value;
                showResultsPage(searchTerm);
            }
        });
    }
    
    // Quick filter buttons
    const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
    quickFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const searchTerm = btn.getAttribute('data-search');
            heroSearchInput.value = searchTerm;
            showResultsPage(searchTerm);
        });
    });
    
    // Filter changes trigger search
    const typeFilter = document.getElementById('typeFilter');
    const genreFilter = document.getElementById('genreFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    typeFilter.addEventListener('change', performSearch);
    genreFilter.addEventListener('change', performSearch);
    sortFilter.addEventListener('change', performSearch);
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFiltersOnly);
    }
    
    // Form submission - now with Firebase
    const submitForm = document.getElementById('submitForm');
    submitForm.addEventListener('submit', handleFormSubmit);
    
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

function setupNavigation() {
    const navLinksElements = document.querySelectorAll('.nav-link');
    const navLinksContainer = document.getElementById('navLinks');
    
    // Smooth scroll and active state
    navLinksElements.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); // Remove #
            
            // Handle dashboard special case
            if (targetId === 'dashboard') {
                if (!window.currentUser) {
                    window.showToast('Please login to view dashboard', 'error');
                    window.showAuthModal();
                    return;
                }
                // Show dashboard and load data
                showDashboardPage();
                return;
            }
            
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Hide all sections
                document.querySelectorAll('section').forEach(section => {
                    section.style.display = 'none';
                });
                
                // Show target section
                if (targetId === 'home') {
                    targetSection.style.display = 'flex';
                    // Also show other main sections
                    document.getElementById('submit').style.display = 'block';
                    document.getElementById('about').style.display = 'block';
                    document.getElementById('contact').style.display = 'block';
                } else {
                    targetSection.style.display = 'block';
                }
                
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update active state
                navLinksElements.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                navLinksContainer.classList.remove('active');
                document.getElementById('hamburger').classList.remove('active');
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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
// DASHBOARD PAGE
// ================================
function showDashboardPage() {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show dashboard
    const dashboardSection = document.getElementById('dashboard');
    dashboardSection.style.display = 'block';
    
    // Load dashboard data
    if (window.loadUserDashboard) {
        window.loadUserDashboard();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================
// PAGE NAVIGATION
// ================================
function showResultsPage(searchTerm) {
    // Store search term
    document.getElementById('searchInput').value = searchTerm;
    
    // Hide home sections
    document.getElementById('home').style.display = 'none';
    document.getElementById('submit').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    
    // Show results page
    const searchPage = document.getElementById('search');
    searchPage.style.display = 'block';
    
    // Update search summary
    updateSearchSummary(searchTerm);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Perform search
    setTimeout(() => performSearch(), 100);
}

window.backToHome = function() {
    // Show home sections
    document.getElementById('home').style.display = 'flex';
    document.getElementById('submit').style.display = 'block';
    document.getElementById('about').style.display = 'block';
    document.getElementById('contact').style.display = 'block';
    
    // Hide other sections
    document.getElementById('search').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    
    // Clear search
    document.getElementById('heroSearchInput').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('genreFilter').value = '';
    document.getElementById('sortFilter').value = 'date';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function updateSearchSummary(searchTerm) {
    const summaryText = document.getElementById('searchSummaryText');
    const termDisplay = document.getElementById('searchTermDisplay');
    
    if (searchTerm && searchTerm.trim() !== '') {
        summaryText.textContent = 'Search Results';
        termDisplay.textContent = `Showing results for "${searchTerm}"`;
    } else {
        summaryText.textContent = 'All Events';
        termDisplay.textContent = 'Browse all available events';
    }
}

// ================================
// SEARCH & FILTER FUNCTIONS
// ================================
function performInitialSearch() {
    // Don't show events on load - wait for user to search
    hideLoading();
}

window.performSearch = function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const genreFilter = document.getElementById('genreFilter').value;
    const sortOption = document.getElementById('sortFilter').value;
    
    // Hide empty state
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.classList.remove('active');
    }
    
    // Show loading animation
    showLoading();
    
    // Simulate search delay for better UX
    setTimeout(() => {
        // Filter events
        filteredEvents = allEvents.filter(event => {
            const matchesSearch = 
                event.name.toLowerCase().includes(searchTerm) ||
                event.city.toLowerCase().includes(searchTerm) ||
                event.state.toLowerCase().includes(searchTerm) ||
                event.genre.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm);
            
            const matchesType = !typeFilter || event.type === typeFilter;
            const matchesGenre = !genreFilter || event.genre === genreFilter;
            
            return matchesSearch && matchesType && matchesGenre;
        });
        
        // Sort events
        sortEvents(filteredEvents, sortOption);
        
        // Update results header
        updateResultsHeader(filteredEvents.length, searchTerm, typeFilter, genreFilter);
        
        // Render results
        hideLoading();
        renderEvents(filteredEvents);
    }, 800);
};

function updateResultsHeader(count, searchTerm, typeFilter, genreFilter) {
    const resultsHeader = document.getElementById('resultsHeader');
