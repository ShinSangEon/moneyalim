const axios = require('axios');
const fs = require('fs');
const path = require('path');

function getEnvValue(key) {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

async function triggerSync() {
    const SYNC_SECRET_KEY = getEnvValue('SYNC_SECRET_KEY') || process.env.SYNC_SECRET_KEY || 'sync-secret-123';
    console.log(`Using key: ${SYNC_SECRET_KEY ? SYNC_SECRET_KEY.substring(0, 5) + '...' : 'None'}`);

    console.log('Triggering FULL sync...');
    try {
        // Timeout set to 5 minutes for long sync
        const response = await axios.post('http://localhost:3000/api/sync-subsidies', {}, {
            headers: {
                'Authorization': `Bearer ${SYNC_SECRET_KEY}`
            },
            timeout: 300000
        });
        console.log('Sync Response:', response.data);
    } catch (error) {
        console.error('Sync Failed:', error.message);
        if (error.code === 'ECONNABORTED') {
            console.log('Sync is taking longer than 5 minutes, but it might still be running in background.');
        } else if (error.response) {
            console.error('Details:', error.response.data);
        }
    }
}

triggerSync();
