import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: 'src/pages/MainPage/index.html', // 메인 페이지
        search: 'src/pages/SearchPage/index.html', // 검색 페이지
        postWrite: 'src/pages/PostWritePage/index.html', // 글쓰기 페이지
        postDetail: 'src/pages/PostDetailPage/index.html', // 작가 홈 페이지
        myPage: 'src/pages/MyPage/index.html', // 마이 페이지
        login: 'src/pages/LoginPage/index.html', // 로그인 페이지
        author: 'src/pages/AuthorPage/index.html', // 작가 홈 페이지
      },
    },
  },
  server: {
    host: true, // 또는 '0.0.0.0'으로 설정
    port: 5173, // 포트 설정 (필요한 경우)
  },
});
