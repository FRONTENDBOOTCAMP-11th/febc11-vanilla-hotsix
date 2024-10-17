'use strict';

const subscribeBtn = document.querySelector('.author-info__subscribe-button');

// 구독 버튼을 누르면 버튼 텍스트와 배경색이 바뀌는 함수
subscribeBtn.addEventListener('click', () => {
  subscribeBtn.classList.toggle('subscribed');

  if (subscribeBtn.classList.contains('subscribed')) {
    subscribeBtn.textContent = 'v 구독중';
  } else {
    subscribeBtn.textContent = '+ 구독';
  }
});
