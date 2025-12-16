require('dotenv/config');
const axios = require('axios');

const BASE_URL = 'https://api.odcloud.kr/api';
const API_KEY = process.env.SUBSIDY_API_KEY;

async function testAPI() {
    try {
        console.log('🔍 Fetching sample data from API...\n');

        const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
            params: {
                page: 1,
                perPage: 2,
                serviceKey: API_KEY,
            },
        });

        console.log('✅ API Response Structure:\n');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testAPI();
