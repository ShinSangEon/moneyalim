import "./globals.css";
import MobileStickyAd from "@/components/MobileStickyAd";
import Script from "next/script";

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
    images: [
      {
        url: 'https://moneyalim.com/logo.png',
        width: 800,
        height: 600,
        alt: 'MoneyAlim - 정부지원금 찾기',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "MoneyAlim - 숨은 정부지원금 찾기/조회",
    description: "2026년 최신 정부지원금, AI가 3초 만에 찾아드립니다.",
    images: ['https://moneyalim.com/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* Naver Site Verification */}
        <meta name="naver-site-verification" content="d9cf38a30347d50150f52de5a1677d148cecfaa7" />
        
        {/* JSON-LD 구조화된 데이터 - 웹사이트 정보 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MoneyAlim",
              "alternateName": "머니알림",
              "url": "https://moneyalim.com",
              "description": "2026년 최신 정부지원금, AI가 3초 만에 찾아드립니다.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://moneyalim.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MoneyAlim",
              "url": "https://moneyalim.com",
              "logo": "https://moneyalim.com/logo.png",
              "sameAs": []
            })
          }}
        />
        
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css"
        />
      </head>
      <body className="antialiased font-pretendard">
        {/* Google Tag Manager (noscript) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {/* Google AdSense Script */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Kakao SDK */}
        {/* Kakao SDK */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

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
