"use strict"

// 구독 상태 확인 (더미데이터)
let dummy_issub = false;

// DOMContentLoaded 이벤트를 사용해 DOM이 완전히 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  const subscribeBtn = document.querySelector('.author-info__subscribe-button');

  // 구독 여부에 따라 다른 디자인
  function updateSubscribe() {
    if (dummy_issub) {
      subscribeBtn.innerHTML = `
        <img src="/src/assets/images/ico-check.svg" alt="구독중 아이콘"/>
        구독중
      `;
      subscribeBtn.classList.add('sub_now');
      subscribeBtn.classList.remove('sub_not');
    } else {
      subscribeBtn.innerHTML = `
        <img src="/src/assets/images/ico-plus.svg" alt="구독 아이콘"/>
        구독
      `;
      subscribeBtn.classList.add('sub_not');
      subscribeBtn.classList.remove('sub_now');
    }
  }

  // 구독 버튼 클릭 시 구독 상태를 토글
  subscribeBtn.addEventListener("click", () => {
    dummy_issub = !dummy_issub;  // 상태를 반대로 변경 (true <-> false)
    updateSubscribe();           // 상태에 따라 버튼 디자인 업데이트
  });

  // 페이지 로드 시 초기 상태 업데이트
  updateSubscribe();
});
