'use strict';

import axios from 'axios';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

// accessToken 가져오기
let token = '';
if (sessionStorage.getItem('accessToken')) {
  token = sessionStorage.getItem('accessToken');
} else {
  token = localStorage.getItem('accessToken');
}

// 북마크 삭제 할 id
let target_id;

export class Subscribe extends HTMLElement {
  constructor() {
    super();
    // 현재 구독 상태
    this.dummy_issub = false;

    // URL에서 userId 추출하기
    const params = new URLSearchParams(window.location.search);
    let userIdFromUrl = params.get('userId');
    this.userId = Number(localStorage.getItem('userId')) || Number(userIdFromUrl);

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
    // userId가 설정되어 있을 때만 구독 상태를 확인
    if (this.userId) {
      this.updateSubscribe();
    }

    // 클릭 이벤트 처리
    this.querySelector('.author-info__subscribe-button').addEventListener(
      'click',
      () => {
        this.toggleSubscribe(); // 상태 토글
      },
    );
  }

  // 구독 상태를 변경하는 메서드
  async toggleSubscribe() {
    await this.checkSubscribeStatus();
    console.log('now', this.dummy_issub);
    try {
      if (this.dummy_issub) {
        // 구독이 되어있는 상태라면,
        console.log('북마크 해제');
        const res = await axios.delete(`${apiUrl}/bookmarks/${target_id}`, {
          headers: {
            'client-id': clientId,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res);
        this.dummy_issub = false;
        target_id = null;
      } else {
        // 구독이 안되어있는 상태라면,
        console.log('북마크 하기');
        const res = await axios.post(
          `${apiUrl}/bookmarks/user`,
          {
            target_id: Number(this.userId),
            memo: '',
          },
          {
            headers: {
              'client-id': clientId,
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log(res);
        this.dummy_issub = true;
        target_id = res.data.item._id;
      }

      // 상태 변경 후 UI 업데이트
      this.updateSubscribeUI(this.dummy_issub);
    } catch (err) {
      console.error('구독 상태 변경 중 오류 발생:', err);
    }
  }

  // 구독 상태를 서버에서 확인하는 함수
  async checkSubscribeStatus() {
    console.log('userId:', this.userId);
    try {
      const res = await axios.get(`${apiUrl}/bookmarks/user/${this.userId}`, {
        headers: {
          'client-id': clientId,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('상태업데이트', res);
      target_id = res.data.item._id;
      this.dummy_issub = true;

      // 북마크가 존재하면 구독 중인 상태로 처리
      return true;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // 404 에러인 경우, 북마크가 없다고 간주하여 구독 상태를 false로 반환
        console.log('북마크가 존재하지 않음 오류 -> 북마크 안함 처리');
        return false;
      } else {
        console.error(err);
        return false;
      }
    }
  }

  // UI를 업데이트하는 함수
  updateSubscribeUI(isSubscribed) {
    const subscribeBtn = this.querySelector('.author-info__subscribe-button');
    const buttonIcon = this.querySelector('.subscribe-icon');
    const buttonText = this.querySelector('.subscribe-text');

    if (isSubscribed) {
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

  // 구독 상태 확인 후 UI 업데이트
  async updateSubscribe() {
    const isSubscribed = await this.checkSubscribeStatus();
    this.updateSubscribeUI(isSubscribed);
  }
}

// 커스텀 요소 정의
customElements.define('subscribe-component', Subscribe);
