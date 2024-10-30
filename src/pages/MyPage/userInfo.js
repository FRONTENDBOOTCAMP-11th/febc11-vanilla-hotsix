'use strict';

import axios from 'axios';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

const userId = localStorage.getItem('id');
// 받아올 유저정보
const userNick = document.querySelector('.author-info__name');
const userRole = document.querySelector('.author-info__role');
const userDescription = document.querySelector('.author-info__description');
const userImg = document.querySelector('.author-info__avatar');

const checkBtn = document.querySelector('.check-button');
const submitBtn = document.querySelector('.change-info');
const nickFeedback = document.getElementById('nickname-feedback');

// 유저 정보 받아오기 통신
const getUserInfo = async () => {
  try {
    const res = await axios.get(`${apiUrl}/users/${userId}`, {
      headers: {
        'client-id': clientId,
        'Content-Type': 'application/json',
      },
    });
    console.log(res);

    // 유저정보 넣기
    userNick.value = res.data.item.name;
    userRole.value = res.data.item.extra.job;
    userDescription.value = res.data.item.extra.biography;

    // 이미지 src 가져오기 (비동기 처리 대기)
    userImg.src = `${apiUrl}${res.data.item.image}`;
  } catch (err) {
    console.error(err);
  }
};
getUserInfo();

// 닉네임 입력 여부 확인
userNick.addEventListener('input', function () {
  const nickname = userNick.value;
  let userName = nickname.trim() !== '';

  if (userName) {
    checkBtn.disabled = false;
    checkBtn.style.color = 'var(--mint)';
    checkBtn.style.cursor = 'pointer';
  } else {
    checkBtn.disabled = true;
    checkBtn.style.color = 'var(--grey_60)';
    checkBtn.style.cursor = 'unset';
  }
  //checkFormValidity();
});

// 닉네임 중복 확인
checkBtn.addEventListener('click', function () {
  const nickname = userNick.value;

  // API 호출
  fetch(`${apiUrl}/users/name?name=${nickname}`, {
    headers: {
      'client-id': clientId,
      'Content-type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log('API response: ', data);

      if (data.ok) {
        nickFeedback.classList.remove('hidden');
        nickFeedback.textContent = '사용할 수 있는 별명입니다.';
        nickFeedback.style.color = 'var(--mint)';
      } else if (data.message === '이미 등록된 이름입니다.') {
        nickFeedback.classList.remove('hidden');
        nickFeedback.textContent = '이미 등록된 별명입니다.';
        nickFeedback.style.color = '#fc3b75';
      }

    })
    .catch(error => {
      console.error('에러 발생: ', error);
      alert('별명 중복 확인 중 오류가 발생했습니다.');
    });
});
