import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: 'src/pages/MainPage/index.html',
        search: 'src/pages/SearchPage/index.html',
        postWrite: 'src/pages/PostPage/writePage.html',
        postDetail: 'src/pages/PostPage/detailPage.html',
        myPage: 'src/pages/MyPage/index.html',
        login: 'src/pages/LoginPage/index.html',
        signUp: `src/pages/SignupPage/index.html`,
        author: 'src/pages/AuthorPage/index.html',
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg'],
  server: {
    host: true,
    port: 5173,
  },
});
