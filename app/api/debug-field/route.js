import axios from 'axios';

export async function GET() {
    const BASE_URL = 'https://api.odcloud.kr/api';
    const API_KEY = process.env.SUBSIDY_API_KEY;

    try {
        const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
            params: {
                page: 1,
                perPage: 20,
                serviceKey: API_KEY,
            },
        });

        const services = response.data?.data || [];
        const stats = services.map(s => ({
            title: s.서비스명,
            has_신청기한내용: !!s.신청기한내용,
            val_신청기한내용: s.신청기한내용,
            has_신청기한: !!s.신청기한,
            val_신청기한: s.신청기한
        }));
        return Response.json({ count: services.length, stats });
    } catch (error) {
        return Response.json({ error: error.message, details: error.response?.data });
    }
}
