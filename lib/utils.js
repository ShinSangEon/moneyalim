import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * API 데이터에서 기한 정보를 추출하고 가공
 */
export function extractDeadline(text) {
    if (!text) return { display: "상시", dDay: null, isUrgent: false };

    // 상시 패턴
    if (text.includes("상시") || text.includes("연중") || text.includes("수시")) {
        return { display: "상시 접수", dDay: null, isUrgent: false };
    }

    // 날짜 패턴 매칭 (YYYY.MM.DD, YYYY-MM-DD, YYYY년 MM월 DD일)
    const datePatterns = [
        /(\d{4})[.\-년]\s*(\d{1,2})[.\-월]\s*(\d{1,2})일?/g,
        /(\d{4})년\s*(\d{1,2})월/g,
    ];

    const dates = [];
    for (const pattern of datePatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            const day = match[3] ? parseInt(match[3]) : 1;
            dates.push(new Date(year, month, day));
        }
    }

    if (dates.length > 0) {
        // 가장 마지막 날짜를 마감일로 간주
        const endDate = dates[dates.length - 1];
        const today = new Date();
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { display: "마감됨", dDay: null, isUrgent: false, isExpired: true };
        }

        const formatDate = `${endDate.getFullYear()}.${String(endDate.getMonth() + 1).padStart(2, '0')}.${String(endDate.getDate()).padStart(2, '0')}`;

        return {
            display: `~${formatDate}`,
            dDay: diffDays,
            isUrgent: diffDays <= 14,
            isExpired: false
        };
    }

    // 패턴 매칭 실패 시 텍스트 정리해서 반환
    const cleaned = text.substring(0, 30).replace(/\s+/g, ' ').trim();
    return { display: cleaned || "기한 확인 필요", dDay: null, isUrgent: false };
}

/**
 * 지원 대상 텍스트를 간결하게 요약
 */
export function summarizeTarget(text) {
    if (!text) return "전국민";

    // 주요 키워드 추출
    const keywords = [];

    // 나이 관련
    if (text.includes("청년") || text.match(/19.*34세|청년/)) keywords.push("청년");
    if (text.includes("노인") || text.includes("65세") || text.includes("어르신")) keywords.push("어르신");
    if (text.includes("아동") || text.includes("영유아")) keywords.push("아동");
    if (text.includes("중장년")) keywords.push("중장년");

    // 상황 관련
    if (text.includes("저소득") || text.includes("기초생활")) keywords.push("저소득층");
    if (text.includes("장애") || text.includes("장애인")) keywords.push("장애인");
    if (text.includes("임산부") || text.includes("임신")) keywords.push("임산부");
    if (text.includes("다자녀") || text.includes("다문화")) keywords.push("다자녀/다문화");
    if (text.includes("소상공인") || text.includes("자영업")) keywords.push("소상공인");
    if (text.includes("농업인") || text.includes("농민")) keywords.push("농업인");
    if (text.includes("취업") || text.includes("구직")) keywords.push("구직자");
    if (text.includes("한부모")) keywords.push("한부모");

    if (keywords.length > 0) {
        return keywords.slice(0, 2).join(", ");
    }

    // 키워드 없으면 앞부분만 반환
    const cleaned = text
        .replace(/○/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 25);

    return cleaned ? (cleaned.length >= 25 ? cleaned + "..." : cleaned) : "전국민";
}

/**
 * 지원 내용(금액)을 간결하게 요약
 */
export function summarizeAmount(text) {
    if (!text) return "지원금 확인 필요";

    // 금액 패턴 매칭
    const amountPatterns = [
        /최대\s*([\d,]+)\s*(만원|원)/,
        /([\d,]+)\s*(만원|원)\s*(지원|지급)/,
        /월\s*([\d,]+)\s*(만원|원)/,
        /([\d,]+)\s*(만원|원)/,
    ];

    for (const pattern of amountPatterns) {
        const match = text.match(pattern);
        if (match) {
            const amount = match[1];
            const unit = match[2];

            if (text.includes("월")) {
                return `월 ${amount}${unit}`;
            }
            if (text.includes("최대")) {
                return `최대 ${amount}${unit}`;
            }
            return `${amount}${unit}`;
        }
    }

    // 비율 패턴
    const percentMatch = text.match(/(\d+)\s*%/);
    if (percentMatch) {
        return `${percentMatch[1]}% 지원`;
    }

    // 특정 지원 유형
    if (text.includes("무료")) return "무료 지원";
    if (text.includes("전액")) return "전액 지원";
    if (text.includes("바우처")) return "바우처 지원";

    // 텍스트 정리
    const cleaned = text
        .replace(/○/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 30);

    return cleaned ? (cleaned.length >= 30 ? cleaned + "..." : cleaned) : "지원금 확인 필요";
}

/**
 * 설명 텍스트를 간결하게 정리
 */
export function cleanDescription(text) {
    if (!text) return "";

    return text
        .replace(/○/g, '')
        .replace(/·/g, '')
        .replace(/-\s+/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\([^)]*\)/g, '') // 괄호 내용 제거
        .trim()
        .substring(0, 100);
}

/**
 * 분야별 카테고리 매핑 - 실제 데이터 기반
 */
export function mapCategory(category) {
    if (!category) return "기타";

    // 부처별 테마 매핑
    const categoryMap = {
        // 일자리/창업
        "고용노동부": "일자리/창업",
        "중소벤처기업부": "일자리/창업",
        "산업통상": "일자리/창업",

        // 복지/보건
        "보건복지부": "복지/보건",
        "국가보훈부": "복지/보건",
        "질병관리청": "복지/보건",

        // 농림/수산
        "농림축산식품부": "농림/수산",
        "해양수산부": "농림/수산",
        "산림청": "농림/수산",

        // 교육
        "교육부": "교육",

        // 가족/여성
        "성평등가족부": "가족/여성",
        "여성가족부": "가족/여성",

        // 환경/에너지
        "기후에너지환경부": "환경/에너지",
        "환경부": "환경/에너지",

        // 문화/체육
        "문화체육관광부": "문화/체육",
        "국가유산청": "문화/체육",

        // 주거/국토
        "국토교통부": "주거/국토",
        "한국주택금융공사": "주거/국토",

        // 행정/안전
        "행정안전부": "행정/안전",
        "경찰청": "행정/안전",
        "법무부": "행정/안전",
        "대검찰청": "행정/안전",

        // 국방/보훈
        "국방부": "국방/보훈",
    };

    // 부처명 매칭
    for (const [key, value] of Object.entries(categoryMap)) {
        if (category.includes(key)) return value;
    }

    // 지자체인 경우 - 지역 생활 지원
    if (category.includes("시") || category.includes("군") || category.includes("구")) {
        return "지역생활";
    }

    return "기타";
}

/**
 * 카테고리(분야)에 해당하는 검색 키워드 반환
 * - 중앙부처 + 지자체 관련 기관 + 관련 키워드 포함
 */
export function getKeywordsForCategory(category) {
    if (!category || category === "전체") return [];

    // 분야별 확장된 키워드 매핑
    const categoryKeywords = {
        // 일자리/창업 - 고용, 취업, 창업, 기업 관련
        "일자리/창업": [
            "고용노동부", "고용센터", "고용",
            "중소벤처기업부", "중소기업", "소상공인", "창업",
            "산업통상", "일자리", "취업", "직업",
            "인력개발원", "경제진흥", "일자리센터"
        ],

        // 복지/보건 - 복지, 보건, 의료 관련
        "복지/보건": [
            "보건복지부", "복지", "보건소", "보건",
            "국가보훈부", "보훈", "유공자",
            "질병관리청", "의료", "건강",
            "사회복지", "복지관", "복지센터",
            "국민연금", "건강보험", "요양"
        ],

        // 농림/수산 - 농업, 어업, 축산, 산림 관련
        "농림/수산": [
            "농림축산식품부", "농림", "농업", "축산",
            "해양수산부", "수산", "해양", "어업",
            "산림청", "산림", "임업",
            "농촌", "귀농", "귀촌", "영농",
            "농업기술센터", "농업기술원"
        ],

        // 교육 - 교육, 학교, 장학 관련
        "교육": [
            "교육부", "교육청", "교육",
            "장학", "학교", "대학",
            "평생교육", "직업훈련", "훈련원",
            "학생", "청소년", "유아교육"
        ],

        // 가족/여성 - 가족, 여성, 아동 관련
        "가족/여성": [
            "성평등가족부", "여성가족부", "가족",
            "여성", "아동", "양육", "보육",
            "어린이집", "유치원", "다문화",
            "한부모", "가정", "출산", "임신"
        ],

        // 환경/에너지 - 환경, 에너지, 기후 관련
        "환경/에너지": [
            "기후에너지환경부", "환경부", "환경",
            "에너지", "기후", "녹색",
            "신재생", "태양광", "전기차",
            "탄소", "친환경", "재활용"
        ],

        // 문화/체육 - 문화, 예술, 체육, 관광 관련
        "문화/체육": [
            "문화체육관광부", "문화", "예술",
            "국가유산청", "문화재", "유산",
            "체육", "스포츠", "관광",
            "도서관", "박물관", "미술관"
        ],

        // 주거/국토 - 주거, 주택, 교통 관련
        "주거/국토": [
            "국토교통부", "주거", "주택",
            "한국주택금융공사", "LH", "임대",
            "전세", "월세", "청약",
            "교통", "도로", "건축"
        ],

        // 행정/안전 - 행정, 안전, 법률 관련
        "행정/안전": [
            "행정안전부", "행정", "안전",
            "경찰청", "법무부", "대검찰청",
            "소방", "재난", "민방위",
            "자치", "법률", "권익"
        ],

        // 국방/보훈 - 국방, 군인, 보훈 관련
        "국방/보훈": [
            "국방부", "방위사업청", "국방",
            "군인", "제대군인", "병역",
            "보훈", "참전", "유공자"
        ],

        // 과학/기술 - 과학, 기술, 연구 관련
        "과학/기술": [
            "과학기술정보통신부", "과학", "기술",
            "지식재산처", "연구", "개발",
            "정보통신", "ICT", "AI", "디지털",
            "특허", "발명"
        ],

        // 지역생활 - 지자체 관련 (시/군/구 포함하되 특정 단어 매칭)
        "지역생활": [
            "시청", "군청", "구청",
            "주민센터", "동사무소", "읍면동",
            "지역", "마을", "생활"
        ],

        // 기타 - 그 외 분류되지 않은 항목
        "기타": []
    };

    return categoryKeywords[category] || [];
}

/**
 * 지역 추출 - 카테고리(소관기관명)에서 광역시/도 추출
 */
export function extractRegion(category) {
    if (!category) return "전국";

    // 광역시/도 매핑
    const regionMap = {
        "서울": "서울",
        "부산": "부산",
        "대구": "대구",
        "인천": "인천",
        "광주": "광주",
        "대전": "대전",
        "울산": "울산",
        "세종": "세종",
        "경기": "경기",
        "강원": "강원",
        "충북": "충북", "충청북": "충북",
        "충남": "충남", "충청남": "충남",
        "전북": "전북", "전라북": "전북",
        "전남": "전남", "전라남": "전남",
        "경북": "경북", "경상북": "경북",
        "경남": "경남", "경상남": "경남",
        "제주": "제주",
    };

    for (const [key, value] of Object.entries(regionMap)) {
        if (category.includes(key)) return value;
    }

    // 중앙부처는 전국
    return "전국";
}

/**
 * 필터용 분야 목록
 */
export const FILTER_CATEGORIES = [
    { value: "전체", label: "전체" },
    { value: "일자리/창업", label: "💼 일자리/창업" },
    { value: "복지/보건", label: "🏥 복지/보건" },
    { value: "농림/수산", label: "🌾 농림/수산" },
    { value: "교육", label: "📚 교육" },
    { value: "가족/여성", label: "👨‍👩‍👧 가족/여성" },
    { value: "환경/에너지", label: "🌱 환경/에너지" },
    { value: "문화/체육", label: "🎭 문화/체육" },
    { value: "주거/국토", label: "🏠 주거/국토" },
    { value: "행정/안전", label: "🛡️ 행정/안전" },
    { value: "지역생활", label: "🏘️ 지역생활" },
    { value: "기타", label: "📋 기타" },
];

/**
 * 필터용 지역 목록
 */
export const FILTER_REGIONS = [
    { value: "전체", label: "전체" },
    { value: "전국", label: "전국 (중앙부처)" },
    { value: "서울", label: "서울" },
    { value: "부산", label: "부산" },
    { value: "대구", label: "대구" },
    { value: "인천", label: "인천" },
    { value: "광주", label: "광주" },
    { value: "대전", label: "대전" },
    { value: "울산", label: "울산" },
    { value: "세종", label: "세종" },
    { value: "경기", label: "경기" },
    { value: "강원", label: "강원" },
    { value: "충북", label: "충북" },
    { value: "충남", label: "충남" },
    { value: "전북", label: "전북" },
    { value: "전남", label: "전남" },
    { value: "경북", label: "경북" },
    { value: "경남", label: "경남" },
    { value: "제주", label: "제주" },
];

/**
 * 전체 보조금 데이터 가공
 */
export function processSubsidyData(rawData) {
    return {
        ...rawData,
        processedCategory: mapCategory(rawData.category),
        processedTarget: summarizeTarget(rawData.target),
        processedAmount: summarizeAmount(rawData.amount),
        processedDescription: cleanDescription(rawData.description),
        deadline: extractDeadline(rawData.period),
    };
}