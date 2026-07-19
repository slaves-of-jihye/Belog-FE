import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 새 버전 배포 시 자동으로 갱신 (사용자가 옛 버전에 갇히지 않도록)
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      // 개발 중에는 서비스 워커 비활성화 → npm run dev 동작은 기존과 완전히 동일
      devOptions: { enabled: false },

      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],

      manifest: {
        name: 'Belog - 정보 공유 플랫폼',
        short_name: 'Belog',
        description:
          'Belog - 정보 공유 및 과제 기한 관리 플랫폼. 마크다운 에디터, 게시판, 캘린더를 활용한 학습 관리 서비스.',
        lang: 'ko',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#FFFFFF',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // 빌드된 정적 자산만 프리캐시 (API 응답은 여기 포함되지 않음)
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],

        // SPA 라우팅용 fallback. /api 요청은 fallback에서 제외
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],

        cleanupOutdatedCaches: true,
        clientsClaim: true,

        // Toast UI 에디터 등 큰 청크도 프리캐시되도록 한도 상향
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,

        runtimeCaching: [
          // ⚠️ 반드시 첫 번째: API는 절대 캐시하지 않는다.
          // 캐시하면 로그인 상태/게시글 목록이 옛 데이터로 고정되는 버그가 생김.
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly',
          },
          // Google Fonts 스타일시트
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          // Google Fonts 폰트 파일
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
