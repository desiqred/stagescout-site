/**
 * Spotlight Music Events App - Backend Server
 * Node.js + Express + Supabase
 * ES Modules with full error handling
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// ================================
// CONFIGURATION & VALIDATION
// ================================
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ ERROR: Missing required environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Initialize Express
const app = express();

// ================================
// MIDDLEWARE
// ================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ================================
// HELPER FUNCTIONS
// ================================

/**
 * Validate event data
 */
function validateEvent(event) {
    const errors = [];
    
    if (!event.name || typeof event.name !== 'string' || event.name.trim().length === 0) {
        errors.push('Event name is required');
    }
    
    if (!event.venue_name || typeof event.venue_name !== 'string') {
        errors.push('Venue name is required');
    }
    
    if (!event.city || typeof event.city !== 'string') {
        errors.push('City is required');
    }
    
    if (!event.state || typeof event.state !== 'string') {
        errors.push('State is required');
    }
    
    if (!event.date || isNaN(Date.parse(event.date))) {
        errors.push('Valid date is required');
    }
    
    if (!event.type || typeof event.type !== 'string') {
        errors.push('Event type is required');
    }
    
    if (!event.genre || typeof event.genre !== 'string') {
        errors.push('Genre is required');
    }
    
    return errors;
}

/**
 * Sanitize and normalize event data
 */
function sanitizeEvent(event) {
    return {
        name: event.name?.trim(),
        venue_name: event.venue_name?.trim(),
        city: event.city?.trim(),
        state: event.state?.trim(),
        date: event.date,
        time: event.time?.trim() || null,
        type: event.type?.trim(),
        genre: event.genre?.trim(),
        description: event.description?.trim() || null,
        contact_email: event.contact_email?.trim() || null,
        contact_phone: event.contact_phone?.trim() || null,
        website: event.website?.trim() || null,
        source: event.source?.trim() || 'manual',
    };
}

// ================================
// API ROUTES
// ================================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'spotlight-api',
    });
});

/**
 * GET /api/events
 * Fetch all events with optional filtering
 * Query params: city, state, type, genre, date_from, date_to, search
 */
app.get('/api/events', async (req, res) => {
    try {
        const { city, state, type, genre, date_from, date_to, search } = req.query;
        
        let query = supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });
        
        // Apply filters
        if (city) {
            query = query.ilike('city', `%${city}%`);
        }
        
        if (state) {
            query = query.ilike('state', `%${state}%`);
        }
        
        if (type) {
            query = query.eq('type', type);
        }
        
        if (genre) {
            query = query.ilike('genre', `%${genre}%`);
        }
        
        if (date_from) {
            query = query.gte('date', date_from);
        }
        
        if (date_to) {
            query = query.lte('date', date_to);
        }
        
        // Search across name, venue, and description
        if (search) {
            query = query.or(`name.ilike.%${search}%,venue_name.ilike.%${search}%,description.ilike.%${search}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error('Supabase query error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch events',
                details: error.message,
            });
        }
        
        res.json({
            success: true,
            count: data.length,
            events: data,
        });
        
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message,
        });
    }
});

/**
 * GET /api/events/:id
 * Fetch a single event by ID
 */
app.get('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    error: 'Event not found',
                });
            }
            
            console.error('Supabase query error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch event',
                details: error.message,
            });
        }
        
        res.json({
            success: true,
            event: data,
        });
        
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message,
        });
    }
});

/**
 * POST /api/events
 * Create a new event
 */
app.post('/api/events', async (req, res) => {
    try {
        const eventData = req.body;
        
        // Validate event data
        const validationErrors = validateEvent(eventData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                errors: validationErrors,
            });
        }
        
        // Sanitize data
        const sanitizedEvent = sanitizeEvent(eventData);
        
        // Insert into Supabase
        const { data, error } = await supabase
            .from('events')
            .insert([sanitizedEvent])
            .select();
        
        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to create event',
                details: error.message,
            });
        }
        
        console.log('✅ Event created:', data[0].id);
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: data[0],
        });
        
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message,
        });
    }
});

/**
 * PUT /api/events/:id
 * Update an existing event
 */
app.put('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const eventData = req.body;
        
        // Validate event data
        const validationErrors = validateEvent(eventData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                errors: validationErrors,
            });
        }
        
        // Sanitize data
        const sanitizedEvent = sanitizeEvent(eventData);
        sanitizedEvent.updated_at = new Date().toISOString();
        
        // Update in Supabase
        const { data, error } = await supabase
            .from('events')
            .update(sanitizedEvent)
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('Supabase update error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to update event',
                details: error.message,
            });
        }
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Event not found',
            });
        }
        
        console.log('✅ Event updated:', id);
        
        res.json({
            success: true,
            message: 'Event updated successfully',
            event: data[0],
        });
        
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message,
        });
    }
});

/**
 * DELETE /api/events/:id
 * Delete an event
 */
app.delete('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('Supabase delete error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to delete event',
                details: error.message,
            });
        }
        
        console.log('✅ Event deleted:', id);
        
        res.json({
            success: true,
            message: 'Event deleted successfully',
        });
        
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message,
        });
    }
});

/**
 * GET /api/stats
 * Get event statistics
 */
app.get('/api/stats', async (req, res) => {
    try {
        // Total events count
        const { count: totalEvents, error: countError } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        
        // Events by type
        const { data: typeData, error: typeError } = await supabase
            .from('events')
            .select('type');
        
        if (typeError) throw typeError;
        
        const eventsByType = typeData.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {});
        
        // Events by city
        const { data: cityData, error: cityError } = await supabase
            .from('events')
            .select('city');
        
        if (cityError) throw cityError;
        
        const eventsByCity = cityData.reduce((acc, event) => {
            acc[event.city] = (acc[event.city] || 0) + 1;
            return acc;
        }, {});
        
        res.json({
            success: true,
            stats: {
                totalEvents,
                eventsByType,
                topCities: Object.entries(eventsByCity)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([city, count]) => ({ city, count })),
            },
        });
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics',
            message: error.message,
        });
    }
});

// ================================
// FRONTEND ROUTES
// ================================

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
    });
});

// ================================
// SERVER STARTUP
// ================================
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🎵 Spotlight Music Events Server   ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Supabase connected: ${SUPABASE_URL}`);
    console.log(`\n📡 API Endpoints:`);
    console.log(`   GET    /api/health`);
    console.log(`   GET    /api/events`);
    console.log(`   GET    /api/events/:id`);
    console.log(`   POST   /api/events`);
    console.log(`   PUT    /api/events/:id`);
    console.log(`   DELETE /api/events/:id`);
    console.log(`   GET    /api/stats`);
    console.log(`\n🌐 Frontend: http://localhost:${PORT}`);
    console.log(`\nPress Ctrl+C to stop\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});