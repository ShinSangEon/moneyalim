import "./globals.css";
import MobileStickyAd from "@/components/MobileStickyAd";

export const metadata = {
  metadataBase: new URL('https://moneyalim.com'),
  title: {
    default: "MoneyAlim - 숨은 정부지원금 찾기/조회",
    template: "%s | MoneyAlim",
  },
  description: "2026년 최신 정부지원금, AI가 3초 만에 찾아드립니다. 놓치고 있는 복지 혜택과 보조금을 지금 바로 조회해보세요.",
  keywords: ["정부지원금", "보조금", "청년수당", "내일배움카드", "국가장학금", "복지혜택", "머니알림", "MoneyAlim", "지원금조회"],
  openGraph: {
    title: "MoneyAlim - 숨은 정부지원금 찾기/조회",
    description: "2026년 최신 정부지원금, AI가 3초 만에 찾아드립니다.",
    url: 'https://moneyalim.com',
    siteName: 'MoneyAlim',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css"
        />
      </head>
      <body className="antialiased font-pretendard">
        {/* Google AdSense Script - 승인 전까지 비활성화
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
        */}

        {/* Kakao SDK */}
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2txfYR9bGr4uwcUK87e72n"
          crossOrigin="anonymous"
        ></script>

        {/* Google Analytics (GA4) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}

        {children}
        <MobileStickyAd />
      </body>
    </html>
  );
}
