'use strict';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.currentURL = window.location.href; // 현재 URL 저장
    this.image = '/files/vanilla06/white_dog.jpg'; // 기본 이미지
    this.renderHeader(); // 헤더 렌더링
  }

  connectedCallback() {
    // localStorage 또는 sessionStorage 이미지를 가져온 후 렌더링
    const storedImage =
      localStorage.getItem('image') || sessionStorage.getItem('image');
    if (storedImage) {
      this.image = storedImage;
      this.updateImage();
    }

    this.addEventListeners();
  }

  // 이미지를 업데이트하는 함수
  updateImage() {
    const profileImg = this.querySelector('.profile');
    if (profileImg) {
      profileImg.src = `${apiUrl}${this.image}`;
    }
  }

  // 로그인 여부 확인 함수
  isLogin() {
    const local = localStorage.getItem('accessToken');
    const session = sessionStorage.getItem('accessToken');
    if (local || session) {
      return true;
    } else {
      return false;
    }
  }

  // 헤더 렌더링 함수
  renderHeader() {
    const isMainPage = this.currentURL.includes('MainPage');
    const isAuthorPage = this.currentURL.includes('AuthorPage');

    // MainPage에서는 '시작하기' 버튼 추가, 그 외에는 알림/프로필 버튼
    this.innerHTML = `
      <div class="header-container ${isAuthorPage ? 'change_container' : ''}">
        <a href="/src/pages/MainPage/index.html" class="brunchstory">Brunch Story</a>
        <div class="header-controllers">
          <button class="header-controller search"></button>
          ${
            isMainPage && !this.isLogin()
              ? '<button class="header-controller start">시작하기</button>'
              : `
            <button class="header-controller notification"></button>
            <img class="header-controller profile" src=${apiUrl}${this.image} alt="프로필 사진"/>`
          }
        </div>
      </div>
    `;
  }

  // 이벤트 리스너 추가 함수
  addEventListeners() {
    const notification = this.querySelector('.notification');
    const search = this.querySelector('.search');
    const profile = this.querySelector('.profile');
    const start = this.querySelector('.start');

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

    // 시작하기 클릭 시 로그인 페이지로 이동
    start?.addEventListener('click', () => {
      window.location.href = '/src/pages/LoginPage/index.html';
    });
  }
}

// 커스텀 요소 정의
customElements.define('header-component', HeaderComponent);
