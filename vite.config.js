import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'src/pages/MainPage/index.html'), // 메인 페이지
      search: resolve(__dirname, 'src/pages/SearchPage/index.html'), // 검색 페이지
      postWrite: resolve(__dirname, 'src/pages/PostWritePage/index.html'), // 글쓰기 페이지
      myPage: resolve(__dirname, 'src/pages/MyPage/index.html'), // 마이 페이지
      login: resolve(__dirname, 'src/pages/LoginPage/index.html'), // 로그인 페이지
      author: resolve(__dirname, 'src/pages/AuthorPage/index.html'), // 작가 홈 페이지
    },
  },
});
