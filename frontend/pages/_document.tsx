// frontend/pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* Google Fonts: Gowun Dodum */}
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased font-gowun bg-[#fffbea] text-gray-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}