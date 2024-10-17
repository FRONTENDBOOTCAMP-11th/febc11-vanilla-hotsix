"use strict"

const navbar = document.querySelector('.navbar-container');
navbar.innerHTML = `
  <a class="navbar-controller">
    <img id="nav-home" src="../../assets/images/nav_home.svg"/>
    홈
  </a>
  <a class="navbar-controller">
    <img id="nav-search" src="../../assets/images/nav_search.svg"/>
    발견
  </a>
  <a class="navbar-controller">
    <img id="nav-write" src="../../assets/images/nav_write.svg"/>
    글쓰기
  </a>
  <a class="navbar-controller">
    <img id="nav-mybox" src="../../assets/images/nav_mybox.svg"/>
    내 서랍
  </a>
`;

const home = document.getElementById('nav-home');
const search = document.getElementById('nav-search');
const write = document.getElementById('nav-write');
const mybox = document.getElementById('nav-mybox');

// 현재 나의 위치
const currentURL = window.location.href;

// 현재 url에 따른 nav바 icon 이미지 변경
if (currentURL.includes('MainPage')) {
  home.src = '/src/assets/images/nav_home_now.svg';
  home.alt = '메인 페이지로 갈 수 있는 버튼'
} else if (currentURL.includes('SearchPage')) {
  search.src = '/src/assets/images/nav_search_now.svg';
  search.alt = '검색 페이지로 갈 수 있는 버튼'
} else if (currentURL.includes('PostWirtePage')) {
  write.src = '/src/assets/images/nav_write_now.svg';
  write.alt = '글쓰기 페이지로 갈 수 있는 버튼' 
} else if (currentURL.includes('MyPage')) {
  mybox.src = '/src/assets/images/nav_mybox_now.svg';
  mybox.alt = '내 서랍 페이지로 갈 수 있는 버튼'
}

// 클릭 이벤트
home.addEventListener("click", () => {
  window.location.href = '/src/pages/MainPage/index.html';
});
search.addEventListener("click", () => {
  window.location.href = '/src/pages/SearchPage/index.html';
});
write.addEventListener("click", () => {
  window.location.href = '/src/pages/PostWritePage/index.html';
});
mybox.addEventListener("click", () => {
  window.location.href = '/src/pages/MyPage/index.html';
});