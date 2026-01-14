// CORS Test Script for Supabase
// Run with: node test-cors.js

const SUPABASE_URL = 'https://ukrwqmaiddvmvkmeqzcv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcndxbWFpZGR2bXZrbWVxemN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTI3MDQsImV4cCI6MjA4MTQ4ODcwNH0.uYsPfhSY3Ib2lIpPu8nj8E8Zr4tz1Cgq0Xaom3I4bWU';

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

async function testCORS() {
    log('\n=== TEST 1: CORS Preflight (OPTIONS) ===', 'blue');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/prompts`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'apikey,authorization'
            }
        });

        const corsHeaders = {
            'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
            'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
            'access-control-allow-headers': response.headers.get('access-control-allow-headers')
        };

        logInfo(`Status: ${response.status}`);
        logInfo(`CORS Headers: ${JSON.stringify(corsHeaders, null, 2)}`);

        if (response.ok && corsHeaders['access-control-allow-origin']) {
            logSuccess('CORS preflight request successful');
            return true;
        } else {
            logWarning('CORS preflight may have issues');
            return false;
        }
    } catch (error) {
        logError(`CORS preflight failed: ${error.message}`);
        return false;
    }
}

async function testDatabaseConnection() {
    log('\n=== TEST 2: Database Connection (GET) ===', 'blue');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/prompts?select=id&limit=1`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Origin': 'http://localhost'
            }
        });

        logInfo(`Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            logError(`HTTP Error: ${errorText}`);
            
            if (response.status === 401 || response.status === 403) {
                logWarning('Authentication/Authorization issue - check RLS policies');
            }
            return false;
        }

        const data = await response.json();
        logSuccess(`Database connection successful! Retrieved ${data.length} record(s)`);
        
        if (data.length > 0) {
            logInfo(`Sample data: ${JSON.stringify(data[0], null, 2)}`);
        }
        
        return true;
    } catch (error) {
        logError(`Database connection failed: ${error.message}`);
        
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
            logWarning('This might be a CORS issue, but Supabase should handle CORS automatically');
            logWarning('Check RLS policies instead - they are the most common cause of access issues');
        }
        
        return false;
    }
}

async function testCORSHeaders() {
    log('\n=== TEST 3: CORS Headers Inspection ===', 'blue');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost'
            }
        });

        const corsHeaders = {};
        for (const [key, value] of response.headers.entries()) {
            if (key.toLowerCase().includes('access-control') || key.toLowerCase().includes('cors')) {
                corsHeaders[key] = value;
            }
        }

        logInfo(`Found ${Object.keys(corsHeaders).length} CORS-related headers:`);
        console.log(JSON.stringify(corsHeaders, null, 2));

        if (Object.keys(corsHeaders).length > 0) {
            logSuccess('CORS headers are present');
            return true;
        } else {
            logWarning('No CORS headers found (but Supabase may handle CORS automatically)');
            return false;
        }
    } catch (error) {
        logError(`CORS headers inspection failed: ${error.message}`);
        return false;
    }
}

async function runAllTests() {
    log('\n' + '='.repeat(60), 'blue');
    log('🔍 SUPABASE CORS & CONNECTION TEST', 'blue');
    log('='.repeat(60), 'blue');
    
    logInfo(`Supabase URL: ${SUPABASE_URL}`);
    logInfo(`Testing from: Node.js environment`);
    logInfo(`Timestamp: ${new Date().toISOString()}`);
    
    const results = {
        corsPreflight: false,
        databaseConnection: false,
        corsHeaders: false
    };

    results.corsPreflight = await testCORS();
    results.databaseConnection = await testDatabaseConnection();
    results.corsHeaders = await testCORSHeaders();

    // Summary
    log('\n' + '='.repeat(60), 'blue');
    log('📊 TEST SUMMARY', 'blue');
    log('='.repeat(60), 'blue');
    
    log(`CORS Preflight: ${results.corsPreflight ? '✅ PASS' : '❌ FAIL'}`, results.corsPreflight ? 'green' : 'red');
    log(`Database Connection: ${results.databaseConnection ? '✅ PASS' : '❌ FAIL'}`, results.databaseConnection ? 'green' : 'red');
    log(`CORS Headers: ${results.corsHeaders ? '✅ PASS' : '❌ FAIL'}`, results.corsHeaders ? 'green' : 'red');
    
    const allPassed = Object.values(results).every(r => r === true);
    
    log('\n' + '='.repeat(60), 'blue');
    if (allPassed) {
        logSuccess('ALL TESTS PASSED! Supabase connection is working correctly.');
    } else {
        logWarning('SOME TESTS FAILED');
        logInfo('\n💡 Troubleshooting tips:');
        logInfo('1. Check RLS (Row Level Security) policies in Supabase Dashboard');
        logInfo('2. Verify that table "prompts" exists and has proper permissions');
        logInfo('3. Ensure Supabase project is active and running');
        logInfo('4. Check if there are any firewall or network restrictions');
        logInfo('5. Try running setup-cors.html in a browser for more detailed diagnostics');
    }
    log('='.repeat(60), 'blue');
    
    return allPassed;
}

// Run tests
if (typeof fetch === 'undefined') {
    // Node.js environment - need to use node-fetch or similar
    logError('This script requires fetch API. Please use Node.js 18+ or install node-fetch');
    logInfo('Alternatively, open setup-cors.html in a browser for testing');
    process.exit(1);
} else {
    runAllTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            logError(`Test execution failed: ${error.message}`);
            process.exit(1);
        });
}
