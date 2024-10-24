'use strict';
export class Subscribe extends HTMLElement {
  constructor() {
    super();
    // 현재 구독 상태 - 일단 더미 데이터
    this.dummy_issub = false;

    // 컴포넌트 구조 설정
    this.innerHTML = `
      <button class="author-info__subscribe-button sub_not">
        <img class="subscribe-icon" src="/assets/images/ico-plus.svg" alt="구독 아이콘"/>
        <span class="subscribe-text">구독</span>
      </button>
    `;
  }

  // 연결 후, 콜백함수
  connectedCallback() {
    // 페이지 로드 시 구독 상태 업데이트
    this.updateSubscribe();

    // 클릭 이벤트 처리
    this.querySelector('.author-info__subscribe-button').addEventListener('click', () => {
      this.toggleSubscribe(); // 상태 토글
    });
  }

  // 구독 상태를 변경하는 메서드
  toggleSubscribe() {
    this.dummy_issub = !this.dummy_issub;
    this.updateSubscribe();
  }

  // 구독 상태에 따라 UI를 업데이트 하는 메서드
  updateSubscribe() {
    const subscribeBtn = this.querySelector('.author-info__subscribe-button');
    const buttonIcon = this.querySelector('.subscribe-icon');
    const buttonText = this.querySelector('.subscribe-text');

    if (this.dummy_issub) {
      // 구독 중인 경우
      buttonIcon.src = '/assets/images/ico-check.svg';
      buttonIcon.alt = '구독중 아이콘';
      buttonText.textContent = '구독중';
      subscribeBtn.classList.add('sub_now');
      subscribeBtn.classList.remove('sub_not');
    } else {
      // 구독하지 않은 경우
      buttonIcon.src = '/assets/images/ico-plus.svg';
      buttonIcon.alt = '구독 아이콘';
      buttonText.textContent = '구독';
      subscribeBtn.classList.add('sub_not');
      subscribeBtn.classList.remove('sub_now');
    }
  }
}

// 커스텀 요소 정의
customElements.define('subscribe-component', Subscribe);