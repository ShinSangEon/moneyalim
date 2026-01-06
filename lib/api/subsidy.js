import 'dotenv/config';
import axios from 'axios';

const BASE_URL = 'https://api.odcloud.kr/api';
const API_KEY = process.env.SUBSIDY_API_KEY;

if (!API_KEY) {
    console.warn('⚠️  SUBSIDY_API_KEY is not set in .env file');
}

/**
 * 공공서비스 목록 조회
 * @param {number} page - 페이지 번호 (기본값: 1)
 * @param {number} perPage - 페이지당 항목 수 (기본값: 100)
 * @returns {Promise<Object>} API 응답 데이터
 */
export async function fetchServiceList(page = 1, perPage = 100) {
    try {
        const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
            params: {
                page,
                perPage,
                serviceKey: API_KEY,
            },
        });

        return response.data;
    } catch (error) {
        console.error('❌ Error fetching service list:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}

/**
 * 공공서비스 상세 정보 조회
 * @param {string} serviceId - 서비스 ID
 * @returns {Promise<Object>} 서비스 상세 정보
 */
export async function fetchServiceDetail(serviceId) {
    try {
        const response = await axios.get(`${BASE_URL}/gov24/v3/serviceDetail`, {
            params: {
                serviceId,
                serviceKey: API_KEY,
            },
        });

        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching service detail for ${serviceId}:`, error.message);
        throw error;
    }
}

/**
 * 공공서비스 지원 조건 조회
 * @param {string} serviceId - 서비스 ID
 * @returns {Promise<Object>} 지원 조건 정보
 */
export async function fetchSupportConditions(serviceId) {
    try {
        const response = await axios.get(`${BASE_URL}/gov24/v3/supportConditions`, {
            params: {
                serviceId,
                serviceKey: API_KEY,
            },
        });

        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching support conditions for ${serviceId}:`, error.message);
        throw error;
    }
}

/**
 * API 연결 테스트
 */
export async function testConnection() {
    try {
        console.log('🔍 Testing API connection...');
        const data = await fetchServiceList(1, 1);
        console.log('✅ API connection successful!');
        console.log('Sample data:', JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('❌ API connection failed');
        return false;
    }
}
