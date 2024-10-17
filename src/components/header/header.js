'use strict';

// 현재 url 가져와서, 헤더 스타일 변경
const currentURL = window.location.href;

// 메인페이지면, 시작하기 버튼 생성
if (currentURL.includes('MainPage')) {
  // 헤더 컴포넌트
  const header = document.querySelector('.header-container');
  header.innerHTML = `
    <h1 class="brunchstory">Brunch Story</h1>
    <div class="header-controllers">
      <button class="header-controller search"></button>
      <button class="header-controller start">시작하기</button>
    </div>
  `;
} else {
  // 헤더 컴포넌트
  const header = document.querySelector('.header-container');
  header.innerHTML = `
    <h1 class="brunchstory">Brunch Story</h1>
    <div class="header-controllers">
      <button class="header-controller notification"></button>
      <button class="header-controller search"></button>
      <button class="header-controller profile"></button>
    </div>
  `;
}


const brunchstory = document.querySelector('.brunchstory');
const notification = document.querySelector('.notification');
const search = document.querySelector('.search');
const profile = document.querySelector('.profile');

// 로고를 클릭하면 메인 페이지로 이동
brunchstory.addEventListener('click', () => {
  window.location.href = '/src/pages/MainPage/index.html';
});

// 알림을 클릭하면 아직 기능이 없는 것 같아 콘솔로 대체
notification.addEventListener('click', () => {
  alert('준비중입니다!');
  console.log('페이지가 없는 것 같아요');
});

// 검색 클릭시, 발견 페이지 이동
search.addEventListener('click', () => {
  window.location.href = '/src/pages/SearchPage/index.html';
});

// 프로필 클릭 시, 내 서랍 이동
profile.addEventListener('click', () => {
  window.location.href = '/src/pages/MyPage/index.html';
});

const container = document.querySelector('.header-container');
// 작가 홈 url이면 클래스 추가(배경색 변경)
if (currentURL.includes('AuthorPage')) {
  container.classList.add('change_container');
} else {
  container.classList.remove('change_container');
}
