'use strict';

import isLogin from '../../api/isLogin';

// 페이지 진입 시 즉시 로그인 상태 확인
(async () => {
  const loginStatus = await isLogin();

  if (loginStatus) {
    console.log('로그인 상태입니다.');
  } else {
    console.log('로그인이 필요합니다.');
    // 로그인 필요 시 로그인 페이지 이동
    window.location.href = '/src/pages/LoginPage/index.html';
  }
})();

import axios from 'axios';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

// 유저 id
const userId = localStorage.getItem('id') || sessionStorage.getItem('id');
const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

// form
const form = document.querySelector('.author-info');

// 유저 정보 요소
const userNick = document.querySelector('.author-info__name');
const userRole = document.querySelector('.author-info__role');
const userDescription = document.querySelector('.author-info__description');
const userImg = document.querySelector('.author-info__avatar');
const fileInputNode = document.getElementById('fileInputNode');

// 중복확인 버튼 및 피드백
const checkBtn = document.querySelector('.check-button');
const nickFeedback = document.getElementById('nickname-feedback');
const submitBtn = document.querySelector('.change-info');

// 초기 상태에서 제출 버튼 비활성화
submitBtn.disabled = true;
submitBtn.classList.add('disable');

// 원래 유저 정보 저장 및 중복 상태 변수
let originalUserData = {};
let filePath;
let isNicknameValid = true; // 초기 상태에서는 true로 설정

// 유저 정보 받아오기
const getUserInfo = async () => {
  try {
    const res = await axios.get(`${apiUrl}/users/${userId}`, {
      headers: {
        'client-id': clientId,
        'Content-Type': 'application/json',
      },
    });
    const data = res.data.item;

    // 초기 유저 정보 설정
    originalUserData = {
      name: data.name,
      job: data.extra.job,
      biography: data.extra.biography,
      image: data.image,
    };

    // 유저 정보 렌더링
    userNick.value = data.name;
    userRole.value = data.extra.job;
    userDescription.value = data.extra.biography;
    userImg.src = `${apiUrl}${data.image}`;
    filePath = data.image;

  } catch (err) {
    console.error(err);
  }
};
getUserInfo();

// 변경 여부 확인 함수
function checkForChanges() {
  const hasChanges =
    userNick.value !== originalUserData.name ||
    userRole.value !== originalUserData.job ||
    userDescription.value !== originalUserData.biography ||
    filePath !== originalUserData.image;

  updateSubmitButtonState(hasChanges);
}

// 버튼 활성화/비활성화 업데이트 함수
function updateSubmitButtonState(enable) {
  submitBtn.disabled = !enable;
  if (enable) {
    submitBtn.classList.remove('disable');
  } else {
    submitBtn.classList.add('disable');
  }
}

// 닉네임 입력 이벤트
userNick.addEventListener('input', function () {
  checkBtn.disabled = !userNick.value.trim();
  checkBtn.style.color = checkBtn.disabled ? 'var(--grey_60)' : 'var(--mint)';
  checkBtn.style.cursor = checkBtn.disabled ? 'unset' : 'pointer';
  checkForChanges(); // 변경 여부 확인
});

// 역할과 설명 필드 변경 이벤트
userRole.addEventListener('input', checkForChanges);
userDescription.addEventListener('input', checkForChanges);

// 닉네임 중복 확인
checkBtn.addEventListener('click', async function () {
  const nickname = userNick.value;
  try {
    const response = await axios.get(`${apiUrl}/users/name?name=${nickname}`, {
      headers: {
        'client-id': clientId,
        'Content-type': 'application/json',
      },
    });
  
    // 200 응답이 성공하면 사용 가능한 닉네임으로 간주
    nickFeedback.textContent = '사용할 수 있는 별명입니다.';
    nickFeedback.style.color = 'var(--mint)';
    isNicknameValid = true; // 닉네임 중복 검사 통과
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // 409 Conflict 오류가 발생하면 닉네임이 중복된 것으로 처리
      nickFeedback.textContent = originalUserData.name === nickname
        ? '원본과 같은 별명입니다.'
        : '이미 등록된 별명입니다.';
      nickFeedback.style.color = '#fc3b75';
      isNicknameValid = false;
    } else {
      // 그 외의 오류 처리
      console.error('에러 발생: ', error);
      alert('별명 중복 확인 중 오류가 발생했습니다.');
    }
  }
  
  nickFeedback.classList.remove('hidden');
  
});

// 이미지 업로드 버튼
userImg.addEventListener('click', () => {
  fileInputNode.click();
});

// 파일 업로드 시
fileInputNode.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('attach', file);

    try {
      const response = await axios.post(`${apiUrl}/files`, formData, {
        headers: {
          'client-id': clientId,
        },
      });
      filePath = response.data.item[0].path;
      userImg.src = `${apiUrl}${filePath}`;
      checkForChanges(); // 이미지 변경 후 버튼 활성화 확인
    } catch (error) {
      console.error(error);
    }
  }
});

// 변경된 정보만 업데이트
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // 닉네임 중복인 경우 경고 표시 후 제출 중단
  if (!isNicknameValid && userNick.value !== originalUserData.name) {
    alert('이미 등록된 별명입니다. 다른 별명을 입력해 주세요.');
    return;
  }

  if (
    userNick.value === originalUserData.name &&
    userRole.value === originalUserData.job &&
    userDescription.value === originalUserData.biography &&
    filePath === originalUserData.image
  ) {
    alert('변경된 정보가 없습니다.');
    return;
  }

  // 변경된 정보만 userData에 추가
  const userData = {};
  if (userNick.value !== originalUserData.name) userData.name = userNick.value;
  if (userRole.value !== originalUserData.job) {
    userData.extra = { ...userData.extra, job: userRole.value };
  } else if (originalUserData.job !== undefined) {
    userData.extra = { ...userData.extra, job: originalUserData.job };
  }
  if (userDescription.value !== originalUserData.biography) {
    userData.extra = { ...userData.extra, biography: userDescription.value };
  } else if (originalUserData.biography !== undefined) {
    userData.extra = { ...userData.extra, biography: originalUserData.biography };
  }
  if (filePath !== originalUserData.image) userData.image = filePath;

  try {
    await axios.patch(`${apiUrl}/users/${userId}`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'client-id': clientId,
        'Authorization': `Bearer ${token}`,
      },
    });
    alert('회원 정보 수정에 성공했습니다.');
    window.location.href = '/src/pages/MyPage/index.html';
  } catch (err) {
    console.error('회원 정보 수정에 실패했습니다.', err);
    alert('회원 정보 수정에 실패했습니다.');
  }
});
