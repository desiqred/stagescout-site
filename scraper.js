/**
 * Spotlight Music Events App - Event Scraper
 * Fetches event data and inserts into Supabase
 * ES Modules with mock data support
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// ================================
// CONFIGURATION
// ================================
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ ERROR: Missing required environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================
// MOCK EVENT DATA
// ================================
// In production, replace this with actual API calls or web scraping
const mockEvents = [
    {
        name: "Blues & Soul Open Mic Night",
        venue_name: "The Howlin' Wolf",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-22",
        time: "19:00",
        type: "Open Mic",
        genre: "Blues",
        description: "Weekly open mic featuring blues and soul musicians. Bring your instrument and join the house band!",
        contact_email: "booking@howlinwolfnola.com",
        contact_phone: "(504) 555-0123",
        website: "https://thehowlinwolf.com",
        source: "scraper"
    },
    {
        name: "Jazz Festival Weekend",
        venue_name: "Preservation Hall",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-25",
        time: "20:00",
        type: "Festival",
        genre: "Jazz",
        description: "Three-day celebration of traditional New Orleans jazz featuring local legends and upcoming artists.",
        contact_email: "info@preservationhall.com",
        contact_phone: "(504) 555-0456",
        website: "https://preservationhall.com",
        source: "scraper"
    },
    {
        name: "Rock Night at the Republic",
        venue_name: "Republic NOLA",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-23",
        time: "21:00",
        type: "Gig Night",
        genre: "Rock",
        description: "High-energy rock showcase with three local bands. Full bar and late-night kitchen.",
        contact_email: "events@republicnola.com",
        contact_phone: "(504) 555-0789",
        website: "https://republicnola.com",
        source: "scraper"
    },
    {
        name: "Acoustic Sunday Sessions",
        venue_name: "Cafe Envie",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-27",
        time: "14:00",
        type: "Open Mic",
        genre: "Acoustic",
        description: "Relaxed afternoon acoustic performances in the French Quarter. Coffee and pastries available.",
        contact_email: "music@cafeenvie.com",
        contact_phone: "(504) 555-0234",
        website: "https://cafeenvie.com",
        source: "scraper"
    },
    {
        name: "Hip-Hop Showcase",
        venue_name: "The Dragon's Den",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-24",
        time: "22:00",
        type: "Showcase",
        genre: "Hip-Hop",
        description: "Monthly hip-hop showcase featuring the best local MCs, DJs, and producers.",
        contact_email: "bookings@dragonsden.com",
        contact_phone: "(504) 555-0567",
        website: "https://dragonsden.com",
        source: "scraper"
    },
    {
        name: "Country Night at Tipitina's",
        venue_name: "Tipitina's",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-26",
        time: "20:30",
        type: "Gig Night",
        genre: "Country",
        description: "Country and Americana music night with special guest performers.",
        contact_email: "info@tipitinas.com",
        contact_phone: "(504) 555-0890",
        website: "https://tipitinas.com",
        source: "scraper"
    },
    {
        name: "Latin Jazz Fusion",
        venue_name: "Snug Harbor Jazz Bistro",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-28",
        time: "19:30",
        type: "Showcase",
        genre: "Jazz",
        description: "Experience the fusion of traditional jazz with Latin rhythms. Dinner and show packages available.",
        contact_email: "reservations@snugjazz.com",
        contact_phone: "(504) 555-0123",
        website: "https://snugjazz.com",
        source: "scraper"
    },
    {
        name: "Indie Pop Night",
        venue_name: "Gasa Gasa",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-29",
        time: "21:00",
        type: "Gig Night",
        genre: "Pop",
        description: "Indie pop and alternative bands from across the Gulf Coast.",
        contact_email: "booking@gasagasa.com",
        contact_phone: "(504) 555-0345",
        website: "https://gasagasa.com",
        source: "scraper"
    },
    {
        name: "Songwriter Circle",
        venue_name: "Chickie Wah Wah",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-30",
        time: "18:00",
        type: "Open Mic",
        genre: "Acoustic",
        description: "Intimate songwriter showcase. Share your original songs in a supportive environment.",
        contact_email: "music@chickiewahwah.com",
        contact_phone: "(504) 555-0678",
        website: "https://chickiewahwah.com",
        source: "scraper"
    },
    {
        name: "Electronic Music Festival",
        venue_name: "The Metropolitan",
        city: "New Orleans",
        state: "LA",
        date: "2025-10-31",
        time: "22:00",
        type: "Festival",
        genre: "Electronic",
        description: "Halloween electronic music festival with multiple stages and DJs from around the world.",
        contact_email: "info@themetropolitan.com",
        contact_phone: "(504) 555-0901",
        website: "https://themetropolitan.com",
        source: "scraper"
    },
    {
        name: "Zydeco Dance Night",
        venue_name: "Rock 'n' Bowl",
        city: "New Orleans",
        state: "LA",
        date: "2025-11-01",
        time: "20:00",
        type: "Gig Night",
        genre: "Zydeco",
        description: "Traditional Louisiana zydeco music with dancing. Bowling and live music combined!",
        contact_email: "events@rocknbowl.com",
        contact_phone: "(504) 555-0234",
        website: "https://rocknbowl.com",
        source: "scraper"
    },
    {
        name: "R&B Smooth Sessions",
        venue_name: "One Eyed Jacks",
        city: "New Orleans",
        state: "LA",
        date: "2025-11-02",
        time: "21:30",
        type: "Showcase",
        genre: "R&B",
        description: "Smooth R&B and neo-soul performances in an intimate venue setting.",
        contact_email: "booking@oneeyedjacks.net",
        contact_phone: "(504) 555-0567",
        website: "https://oneeyedjacks.net",
        source: "scraper"
    },
    {
        name: "Cajun Music Festival",
        venue_name: "Mulate's",
        city: "New Orleans",
        state: "LA",
        date: "2025-11-03",
        time: "18:30",
        type: "Festival",
        genre: "Cajun",
        description: "Authentic Cajun music and dancing with traditional Louisiana cuisine.",
        contact_email: "info@mulates.com",
        contact_phone: "(504) 555-0890",
        website: "https://mulates.com",
        source: "scraper"
    },
    {
        name: "Punk Rock Underground",
        venue_name: "Siberia",
        city: "New Orleans",
        state: "LA",
        date: "2025-11-04",
        time: "22:00",
        type: "Gig Night",
        genre: "Rock",
        description: "Underground punk and hardcore show. All ages welcome.",
        contact_email: "shows@siberia-nola.com",
        contact_phone: "(504) 555-0123",
        website: "https://siberia-nola.com",
        source: "scraper"
    },
    {
        name: "Gospel Brunch",
        venue_name: "House of Blues",
        city: "New Orleans",
        state: "LA",
        date: "2025-11-03",
        time: "10:00",
        type: "Showcase",
        genre: "Gospel",
        description: "Traditional New Orleans gospel brunch with live music and Southern buffet.",
        contact_email: "reservations@houseofblues.com",
        contact_phone: "(504) 555-0456",
        website: "https://houseofblues.com",
        source: "scraper"
    }
];

// ================================
// HELPER FUNCTIONS
// ================================

/**
 * Check if event already exists in database
 */
async function eventExists(event) {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('id')
            .eq('name', event.name)
            .eq('venue_name', event.venue_name)
            .eq('date', event.date);
        
        if (error) throw error;
        
        return data && data.length > 0;
    } catch (error) {
        console.error('Error checking event existence:', error);
        return false;
    }
}

/**
 * Insert event into Supabase
 */
async function insertEvent(event) {
    try {
        // Check if event already exists
        const exists = await eventExists(event);
        if (exists) {
            console.log(`⏭️  Skipping duplicate: ${event.name} at ${event.venue_name}`);
            return { success: false, reason: 'duplicate' };
        }
        
        // Insert event
        const { data, error } = await supabase
            .from('events')
            .insert([event])
            .select();
        
        if (error) {
            console.error(`❌ Failed to insert event: ${event.name}`, error.message);
            return { success: false, error: error.message };
        }
        
        console.log(`✅ Inserted: ${event.name} at ${event.venue_name} on ${event.date}`);
        return { success: true, data: data[0] };
        
    } catch (error) {
        console.error('Error inserting event:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetch events from external API (placeholder)
 * Replace this with actual API calls or web scraping
 */
async function fetchEventsFromSource() {
    console.log('📡 Fetching events from source...\n');
    
    // In production, replace with actual API calls:
    // const response = await fetch('https://api.eventbrite.com/v3/events/...');
    // const data = await response.json();
    // return data.events;
    
    // For now, return mock data
    return mockEvents;
}

/**
 * Normalize and validate event data
 */
function normalizeEvent(event) {
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
        source: event.source || 'scraper',
    };
}

// ================================
// MAIN SCRAPER FUNCTION
// ================================

async function runScraper() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🎵 Spotlight Event Scraper         ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    try {
        // Test Supabase connection
        console.log('🔌 Testing Supabase connection...');
        const { error: connectionError } = await supabase
            .from('events')
            .select('id', { count: 'exact', head: true });
        
        if (connectionError) {
            console.error('❌ Supabase connection failed:', connectionError.message);
            process.exit(1);
        }
        console.log('✅ Supabase connected successfully\n');
        
        // Fetch events from source
        const events = await fetchEventsFromSource();
        console.log(`📊 Found ${events.length} events to process\n`);
        
        // Track results
        let inserted = 0;
        let skipped = 0;
        let failed = 0;
        
        // Process each event
        for (const event of events) {
            const normalizedEvent = normalizeEvent(event);
            const result = await insertEvent(normalizedEvent);
            
            if (result.success) {
                inserted++;
            } else if (result.reason === 'duplicate') {
                skipped++;
            } else {
                failed++;
            }
            
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Print summary
        console.log('\n╔════════════════════════════════════════╗');
        console.log('║          Scraper Summary             ║');
        console.log('╚════════════════════════════════════════╝');
        console.log(`\n✅ Successfully inserted: ${inserted}`);
        console.log(`⏭️  Skipped (duplicates):  ${skipped}`);
        console.log(`❌ Failed:                ${failed}`);
        console.log(`📊 Total processed:       ${events.length}\n`);
        
        if (inserted > 0) {
            console.log('🎉 Scraper completed successfully!');
        } else if (skipped === events.length) {
            console.log('ℹ️  All events already exist in database');
        } else {
            console.log('⚠️  Scraper completed with some failures');
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Scraper failed with error:', error);
        process.exit(1);
    }
}

// ================================
// COMMAND LINE ARGUMENTS
// ================================

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Spotlight Event Scraper
Usage: node scraper.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Fetch events but don't insert into database
  --clear        Clear all events before scraping (use with caution!)

Examples:
  node scraper.js              # Run normal scrape
  node scraper.js --dry-run    # Test without inserting
  node scraper.js --clear      # Clear and re-scrape
    `);
    process.exit(0);
}

if (args.includes('--clear')) {
    console.log('⚠️  WARNING: This will delete all events from the database!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    setTimeout(async () => {
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
            
            if (error) {
                console.error('Failed to clear events:', error);
                process.exit(1);
            }
            
            console.log('✅ All events cleared\n');
            runScraper();
        } catch (error) {
            console.error('Error clearing events:', error);
            process.exit(1);
        }
    }, 5000);
} else if (args.includes('--dry-run')) {
    console.log('🔍 DRY RUN MODE - No data will be inserted\n');
    
    (async () => {
        const events = await fetchEventsFromSource();
        console.log(`\n📊 Would process ${events.length} events:`);
        events.forEach((event, i) => {
            console.log(`  ${i + 1}. ${event.name} - ${event.venue_name} (${event.date})`);
        });
        console.log('\n✅ Dry run completed\n');
    })();
} else {
    // Run normal scraper
    runScraper();
}