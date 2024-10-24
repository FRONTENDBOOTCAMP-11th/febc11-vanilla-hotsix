'use strict';
import homeIcon from '/src/assets/images/nav_home.svg';

export class Navbar extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <nav class="navbar-container">
        <a class="navbar-controller">
          <img id="nav-home" src='${homeIcon}'/>
          홈
        </a>
        <a class="navbar-controller">
          <img id="nav-search" src="/src/assets/images/nav_search.svg"/>
          발견
        </a>
        <a class="navbar-controller">
          <img id="nav-write" src="/src/assets/images/nav_write.svg"/>
          글쓰기
        </a>
        <a class="navbar-controller">
          <img id="nav-mybox" src="/src/assets/images/nav_mybox.svg"/>
          내 서랍
        </a>
      </nav>
    `;
  }

  connectedCallback() {
    this.updateIcons();
    this.addEventListeners();
  }

  updateIcons() {
    // 현재 나의 위치
    const currentURL = window.location.href;
    const home = this.querySelector('#nav-home');
    const search = this.querySelector('#nav-search');
    const write = this.querySelector('#nav-write');
    const mybox = this.querySelector('#nav-mybox');

    // 현재 url에 따른 nav바 icon 이미지 변경
    if (currentURL.includes('MainPage')) {
      home.src = '/src/assets/images/nav_home_now.svg';
      home.alt = '메인 페이지로 갈 수 있는 버튼';
    } else if (currentURL.includes('SearchPage')) {
      search.src = '/src/assets/images/nav_search_now.svg';
      search.alt = '검색 페이지로 갈 수 있는 버튼';
    } else if (currentURL.includes('PostWritePage')) {
      write.src = '/src/assets/images/nav_write_now.svg';
      write.alt = '글쓰기 페이지로 갈 수 있는 버튼';
    } else if (currentURL.includes('MyPage')) {
      mybox.src = '/src/assets/images/nav_mybox_now.svg';
      mybox.alt = '내 서랍 페이지로 갈 수 있는 버튼';
    }
  }

  // 클릭 이벤트 핸들러 추가 메서드
  addEventListeners() {
    const home = this.querySelector('#nav-home');
    const search = this.querySelector('#nav-search');
    const write = this.querySelector('#nav-write');
    const mybox = this.querySelector('#nav-mybox');

    home.addEventListener('click', () => {
      window.location.href = '/src/pages/MainPage/index.html';
    });
    search.addEventListener('click', () => {
      window.location.href = '/src/pages/SearchPage/index.html';
    });
    write.addEventListener('click', () => {
      window.location.href = '/src/pages/PostWritePage/index.html';
    });
    mybox.addEventListener('click', () => {
      window.location.href = '/src/pages/MyPage/index.html';
    });
  }
}

customElements.define('navbar-component', Navbar);
