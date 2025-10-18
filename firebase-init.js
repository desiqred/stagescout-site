// Firebase Initialization and Authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where,
    deleteDoc,
    doc,
    serverTimestamp,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDnsYjuR2O1_D5QPMEzZo76x5z5cT8ry0",
    authDomain: "stages-82385.firebaseapp.com",
    projectId: "stages-82385",
    storageBucket: "stages-82385.firebasestorage.app",
    messagingSenderId: "509183781557",
    appId: "1:509183781557:web:2db29c4a0528a9cfb12cfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Make available globally
window.firebaseAuth = auth;
window.firebaseDb = db;
window.currentUser = null;

// ================================
// AUTH STATE OBSERVER
// ================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.currentUser = user;
        showUserNav(user);
        loadAllEvents(); // Reload events when user logs in
    } else {
        window.currentUser = null;
        showGuestNav();
    }
});

function showUserNav(user) {
    document.getElementById('guestNav').style.display = 'none';
    document.getElementById('userNav').classList.add('active');
    document.getElementById('userName').textContent = user.displayName || user.email.split('@')[0];
    document.getElementById('dashboardLink').style.display = 'block';
    document.getElementById('authModal').classList.remove('active');
}

function showGuestNav() {
    document.getElementById('guestNav').style.display = 'block';
    document.getElementById('userNav').classList.remove('active');
    document.getElementById('dashboardLink').style.display = 'none';
}

// ================================
// AUTH MODAL FUNCTIONS
// ================================
window.showAuthModal = function() {
    document.getElementById('authModal').classList.add('active');
};

window.showAuthTab = function(tab) {
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // Update forms
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(tab + 'Form').classList.add('active');
};

// ================================
// REGISTER FUNCTION
// ================================
window.handleRegister = async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('registerUserType').value;

    const btn = document.getElementById('registerBtn');
    btn.disabled = true;
    document.getElementById('registerBtnText').innerHTML = '<span class="loading-spinner-inline"></span>';

    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with display name
        await updateProfile(userCredential.user, {
            displayName: name
        });

        // Store additional user data in Firestore
        await addDoc(collection(db, 'users'), {
            uid: userCredential.user.uid,
            name: name,
            email: email,
            userType: userType,
            createdAt: serverTimestamp()
        });

        showToast('Account created successfully! 🎉', 'success');
        document.getElementById('registerForm').reset();
        
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        
        showToast(errorMessage, 'error');
    } finally {
        btn.disabled = false;
        document.getElementById('registerBtnText').textContent = 'Create Account';
    }
};

// ================================
// LOGIN FUNCTION
// ================================
window.handleLogin = async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    document.getElementById('loginBtnText').innerHTML = '<span class="loading-spinner-inline"></span>';

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Welcome back! 🎸', 'success');
        document.getElementById('loginForm').reset();
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later.';
        }
        
        showToast(errorMessage, 'error');
    } finally {
        btn.disabled = false;
        document.getElementById('loginBtnText').textContent = 'Login';
    }
};

// ================================
// LOGOUT FUNCTION
// ================================
window.handleLogout = async function() {
    try {
        await signOut(auth);
        showToast('Logged out successfully', 'success');
        
        // Hide dashboard if we're on it
        const dashboardSection = document.getElementById('dashboard');
        if (dashboardSection.style.display !== 'none') {
            // Go back to home
            window.location.hash = 'home';
            location.reload();
        }
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Logout failed. Please try again.', 'error');
    }
};

// ================================
// LOAD ALL EVENTS FROM FIREBASE
// ================================
window.loadAllEvents = async function() {
    try {
        const eventsSnapshot = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc')));
        const firebaseEvents = [];
        
        eventsSnapshot.forEach((doc) => {
            firebaseEvents.push({
                id: doc.id,
                ...doc.data(),
                isFirebase: true // Mark as Firebase event
            });
        });

        // Merge with mock events from script.js
        if (window.mockEvents) {
            window.allEvents = [...window.mockEvents, ...firebaseEvents];
        } else {
            window.allEvents = firebaseEvents;
        }
        
        window.filteredEvents = [...window.allEvents];
        
        // Refresh display if we're viewing events
        const resultsGrid = document.getElementById('resultsGrid');
        if (resultsGrid && resultsGrid.innerHTML !== '') {
            if (window.performSearch) {
                window.performSearch();
            }
        }
        
    } catch (error) {
        console.error('Error loading events from Firebase:', error);
    }
};

// ================================
// SUBMIT EVENT TO FIREBASE
// ================================
window.submitEventToFirebase = async function(eventData) {
    if (!window.currentUser) {
        showToast('Please login to submit events', 'error');
        showAuthModal();
        return false;
    }

    try {
        const eventWithUser = {
            ...eventData,
            createdBy: window.currentUser.uid,
            createdByName: window.currentUser.displayName || window.currentUser.email,
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, 'events'), eventWithUser);
        showToast('Event submitted successfully! 🎉', 'success');
        
        // Reload events
        await loadAllEvents();
        return true;
        
    } catch (error) {
        console.error('Error submitting event:', error);
        showToast('Failed to submit event. Please try again.', 'error');
        return false;
    }
};

// ================================
// LOAD USER'S EVENTS FOR DASHBOARD
// ================================
window.loadUserDashboard = async function() {
    if (!window.currentUser) {
        showToast('Please login to view dashboard', 'error');
        showAuthModal();
        return;
    }

    try {
        const q = query(
            collection(db, 'events'), 
            where('createdBy', '==', window.currentUser.uid),
            orderBy('date', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const userEvents = [];
        
        querySnapshot.forEach((doc) => {
            userEvents.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Update dashboard stats
        const today = new Date().toISOString().split('T')[0];
        const upcoming = userEvents.filter(e => e.date >= today).length;

        document.getElementById('dashTotalEvents').textContent = userEvents.length;
        document.getElementById('dashUpcomingEvents').textContent = upcoming;

        // Render user events
        renderDashboardEvents(userEvents);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Failed to load dashboard', 'error');
    }
};

function renderDashboardEvents(events) {
    const grid = document.getElementById('dashboardEventsGrid');
    
    if (events.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-dim); padding: 2rem;">You haven\'t created any events yet. <a href="#submit" style="color: var(--primary-color);">Submit your first event!</a></p>';
        return;
    }

    grid.innerHTML = events.map(event => `
        <div style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(147, 51, 234, 0.2); margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="color: var(--text-light); margin-bottom: 0.5rem;">${escapeHtml(event.name)}</h4>
                    <p style="color: var(--text-dim); font-size: 0.9rem;">📍 ${escapeHtml(event.city)}, ${escapeHtml(event.state)}</p>
                    <p style="color: var(--text-dim); font-size: 0.9rem;">📅 ${formatDate(event.date)} at ${formatTime(event.time)}</p>
                </div>
                <button 
                    onclick="deleteUserEvent('${event.id}')" 
                    style="padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 8px; color: #ef4444; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.3s ease;"
                    onmouseover="this.style.background='#ef4444'; this.style.color='white';"
                    onmouseout="this.style.background='rgba(239, 68, 68, 0.2)'; this.style.color='#ef4444';"
                >
                    🗑️ Delete
                </button>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="padding: 0.25rem 0.75rem; background: rgba(147, 51, 234, 0.2); border-radius: 15px; color: var(--primary-color); font-size: 0.85rem;">${escapeHtml(event.type)}</span>
                <span style="padding: 0.25rem 0.75rem; background: rgba(245, 158, 11, 0.2); border-radius: 15px; color: var(--secondary-color); font-size: 0.85rem;">${escapeHtml(event.genre)}</span>
            </div>
            <p style="color: var(--text-dim); font-size: 0.9rem; margin-top: 1rem;">${escapeHtml(event.description)}</p>
        </div>
    `).join('');
}

// ================================
// DELETE USER EVENT
// ================================
window.deleteUserEvent = async function(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        await deleteDoc(doc(db, 'events', eventId));
        showToast('Event deleted successfully', 'success');
        loadUserDashboard(); // Reload dashboard
        loadAllEvents(); // Reload all events
    } catch (error) {
        console.error('Error deleting event:', error);
        showToast('Failed to delete event', 'error');
    }
};

// ================================
// TOAST NOTIFICATION
// ================================
window.showToast = function(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// ================================
// UTILITY FUNCTIONS
// ================================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// ================================
// INITIALIZE
// ================================
// Load events when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadAllEvents();
});

console.log('🔥 Firebase initialized successfully!');