"use strict"

const subscribeBtn = document.querySelector('.author-info__subscribe-button');

subscribeBtn.addEventListener("click", () => {
  subscribeBtn.classList.toggle('subscribed');

  if(subscribeBtn.classList.contains('subscribed')) {
    subscribeBtn.textContent = '구독중';
  } else {
    subscribeBtn.textContent = '구독하기';
  }
});
