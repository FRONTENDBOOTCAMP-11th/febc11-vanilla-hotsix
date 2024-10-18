'use strict';

class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.currentURL = window.location.href; // 현재 URL 저장
    this.renderHeader(); // 헤더 렌더링
  }

  connectedCallback() {
    this.addEventListeners(); // 이벤트 리스너 추가
  }

  // 헤더 렌더링 함수
  renderHeader() {
    const isMainPage = this.currentURL.includes('MainPage');
    const isAuthorPage = this.currentURL.includes('AuthorPage');

    // MainPage에서는 '시작하기' 버튼 추가, 그 외에는 알림/프로필 버튼
    this.innerHTML = `
      <div class="header-container ${isAuthorPage ? 'change_container' : ''}">
        <h1 class="brunchstory">Brunch Story</h1>
        <div class="header-controllers">
          <button class="header-controller search"></button>
          ${
            isMainPage
              ? '<button class="header-controller start">시작하기</button>'
              : `
            <button class="header-controller notification"></button>
            <button class="header-controller profile"></button>`
          }
        </div>
      </div>
    `;
  }

  // 이벤트 리스너 추가 함수
  addEventListeners() {
    const brunchstory = this.querySelector('.brunchstory');
    const notification = this.querySelector('.notification');
    const search = this.querySelector('.search');
    const profile = this.querySelector('.profile');

    // 로고 클릭 시 메인 페이지로 이동
    brunchstory?.addEventListener('click', () => {
      window.location.href = '/src/pages/MainPage/index.html';
    });

    // 알림 클릭 시 경고창 및 콘솔 메시지 출력
    notification?.addEventListener('click', () => {
      alert('준비중입니다!');
      console.log('페이지가 없는 것 같아요');
    });

    // 검색 클릭 시 발견 페이지로 이동
    search?.addEventListener('click', () => {
      window.location.href = '/src/pages/SearchPage/index.html';
    });

    // 프로필 클릭 시 내 서랍 페이지로 이동
    profile?.addEventListener('click', () => {
      window.location.href = '/src/pages/MyPage/index.html';
    });
  }
}

// 커스텀 요소 정의
customElements.define('header-component', HeaderComponent);
