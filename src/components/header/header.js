'use strict';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.currentURL = window.location.href; // 현재 URL 저장
    this.image = '/assets/images/basic-profile.svg'; // 기본 이미지
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
    const isLoginPage = this.currentURL.includes('LoginPage');
    const isSignupPage = this.currentURL.includes('SignupPage');

    // MainPage에서는 브런치스토리 로고, 그 외에는 뒤로가기 버튼
    // 로그인 미완료시 시작하기 버튼, 그 외에는 알림/프로필 버튼
    // 로그인, 회원가입 페이지는 뒤로가기 버튼만, border-bottom 제거
    this.innerHTML = `
      <div class="header-container ${isAuthorPage ? 'change_container' : ''} ${isLoginPage || isSignupPage ? 'border-delete' : ''}">
        ${isMainPage ? '<a href="/src/pages/MainPage/index.html" class="brunchstory">Brunch Story</a>' : '<button class="back">뒤로가기</button>'}
        ${
          !(isLoginPage || isSignupPage)
            ? `<div class="header-controllers">
          <button class="header-controller search"></button>
          ${
            !this.isLogin()
              ? '<button class="header-controller start">시작하기</button>'
              : `
            <button class="header-controller notification"></button>
            <a href="/src/pages/MyPage/index.html"><img class="header-controller profile" src=${this.image} alt="프로필 사진"/></a>`
          }
        </div>`
            : ''
        }
      </div>
    `;
  }

  // 이벤트 리스너 추가 함수
  addEventListeners() {
    const notification = this.querySelector('.notification');
    const search = this.querySelector('.search');
    const start = this.querySelector('.start');
    const back = this.querySelector('.back');

    // 알림 클릭 시 경고창 및 콘솔 메시지 출력
    notification?.addEventListener('click', () => {
      alert('준비중입니다!');
      console.log('페이지가 없는 것 같아요');
    });

    // 검색 클릭 시 발견 페이지로 이동
    search?.addEventListener('click', () => {
      window.location.href = '/src/pages/SearchPage/index.html';
    });

    // 시작하기 클릭 시 로그인 페이지로 이동
    start?.addEventListener('click', () => {
      window.location.href = '/src/pages/LoginPage/index.html';
    });

    // 뒤로가기 클릭 시 이전 페이지로 이동
    back?.addEventListener('click', () => {
      // 이전 페이지 저장
      const previousPage = document.referrer;
      // 이전 페이지가 글쓰기 페이지인 경우 메인 페이지로 이동
      if (previousPage.includes('writePage')) {
        window.location.href = 'src/pages/MainPage/index.html';
      } else {
        window.history.back();
      }
    });
  }
}

// 커스텀 요소 정의
customElements.define('header-component', HeaderComponent);
