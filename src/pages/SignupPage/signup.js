document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const form = document.querySelector('form');
  const nicknameInput = document.getElementById('nickname');
  const emailInput = document.getElementById('email');
  const checkEmailButton = document.getElementById('check-email');
  const emailFeedback = document.getElementById('email-feedback');
  const passwordInput = document.getElementById('password');
  const passwordFeedback = document.getElementById('password-feedback');
  const eyeIconPassword = document.getElementById('toggle-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const eyeIconConfirmPassword = document.getElementById(
    'toggle-confirm-password',
  );
  const signupButton = document.querySelector('.signup-button');

  // 환경변수
  const apiUrl = import.meta.env.VITE_API_URL;
  const clientID = import.meta.env.VITE_CLIENT_ID;

  // 인풋 입력 상태 추적 변수 초기화
  let isNicknameValid = false;
  let isEmailValid = false;
  let isEmailChecked = false;
  let isPasswordValid = false;
  let isPasswordConfirmed = false;

  // 인풋 전체 입력 여부 확인 함수
  function checkFormValidity() {
    if (
      isNicknameValid &&
      isEmailValid &&
      isEmailChecked &&
      isPasswordValid &&
      isPasswordConfirmed
    ) {
      signupButton.disabled = false;
      signupButton.style.backgroundColor = 'var(--mint)'; // 버튼 활성화
    } else {
      signupButton.disabled = true;
      signupButton.style.backgroundColor = 'var(--grey_60)'; // 버튼 비활성화
    }
  }

  // 닉네임 입력 여부 확인
  nicknameInput.addEventListener('input', function () {
    isNicknameValid = nicknameInput.value.trim() !== '';
    checkFormValidity();
  });

  // 이메일 유효성 검사
  emailInput.addEventListener('input', function () {
    const email = emailInput.value;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isEmailValid = re.test(String(email).toLowerCase());

    if (!isEmailValid) {
      emailFeedback.classList.remove('hidden');
      emailFeedback.textContent = '유효하지 않은 이메일 주소입니다.';
      emailFeedback.style.color = '#fc3b75';
    } else {
      emailFeedback.textContent = '';
      isEmailChecked = false; // 중복 확인은 아직 필요함!
    }
  });

  // 이메일 중복 확인
  checkEmailButton.addEventListener('click', function () {
    const email = emailInput.value;

    // API 호출
    fetch(`${apiUrl}/users/email?email=${email}`, {
      method: 'GET',
      headers: {
        'client-id': clientID,
        'Content-type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);

        if (data.ok) {
          emailFeedback.classList.remove('hidden');
          emailFeedback.textContent = '사용할 수 있는 이메일입니다.';
          emailFeedback.style.color = 'var(--mint)';
          isEmailChecked = true;
        } else {
          emailFeedback.textContent = '이미 존재하는 이메일입니다.';
          emailFeedback.style.color = '#fc3b75';
          isEmailChecked = false;
        }
        checkFormValidity();
      })
      .catch(error => {
        console.log('에러 발생: ', error);
        alert('이메일 중복 확인 중 오류가 발생했습니다');
      });
  });

  // 비밀번호 조건 확인
  passwordInput.addEventListener('input', function () {
    const password = passwordInput.value;
    const passwordCriteria = /(?=.*\d)(?=.*[A-Z]).{8,}/;
    isPasswordValid = passwordCriteria.test(password);

    if (isPasswordValid) {
      passwordFeedback.classList.remove('hidden');
      passwordFeedback.textContent = '사용할 수 있는 비밀번호입니다.';
      passwordFeedback.style.color = 'var(--mint)';
    } else {
      passwordFeedback.classList.remove('hidden');
      passwordFeedback.textContent =
        '대소문자, 숫자 조합 8자 이상이어야 합니다.';
      passwordFeedback.style.color = '#fc3b75';
    }
    checkFormValidity();
  });

  // 비밀번호 일치 여부 확인
  confirmPasswordInput.addEventListener('input', function () {
    isPasswordConfirmed = confirmPasswordInput.value === passwordInput.value;

    if (isPasswordConfirmed) {
      passwordFeedback.classList.remove('hidden');
      passwordFeedback.textContent = '비밀번호가 일치합니다.';
      passwordFeedback.style.color = 'var(--mint)';
    } else {
      passwordFeedback.classList.remove('hidden');
      passwordFeedback.textContent = '비밀번호가 일치하지 않습니다.';
      passwordFeedback.style.color = '#fc3b75';
    }
    checkFormValidity();
  });

  // 비밀번호 보이기/숨기기
  eyeIconPassword.addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const currentType = passwordInput.getAttribute('type');

    if (currentType === 'password') {
      passwordInput.setAttribute('type', 'text');
      eyeIconPassword.style.backgroundImage =
        'url(/src/assets/images/IconEyeClosed.svg)';
    } else {
      passwordInput.setAttribute('type', 'password');
      eyeIconPassword.style.backgroundImage =
        'url(/src/assets/images/IconEye.png)';
    }
  });

  eyeIconConfirmPassword.addEventListener('click', function () {
    const confirmPasswordInput = document.getElementById('confirm-password');
    const currentType = confirmPasswordInput.getAttribute('type');

    if (currentType === 'password') {
      confirmPasswordInput.setAttribute('type', 'text');
      eyeIconConfirmPassword.style.backgroundImage =
        'url(/src/assets/images/IconEyeClosed.svg)';
    } else {
      confirmPasswordInput.setAttribute('type', 'password');
      eyeIconConfirmPassword.style.backgroundImage =
        'url(/src/assets/images/IconEye.png)';
    }
  });
  // 회원가입 폼 요청 제출 처리
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const userData = {
      email: emailInput.value,
      password: passwordInput.value,
      name: nicknameInput.value,
      type: 'user',
      image: '',
    };

    // 회원가입 API 요청
    fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-id': clientID,
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          alert('회원가입이 성공적으로 완료되었습니다!');
          window.location.href = '/src/pages/mainPage/index.html'; // 메인 페이지로 리다이렉트
        } else {
          alert('회원가입에 실패했습니다: ' + data.message);
        }
      })
      .catch(error => {
        console.error('에러 발생:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      });
  });

  // 버튼 초기화
  signupButton.disabled = true;
  signupButton.style.backgroundColor = 'var(--grey_60)';

  // 페이지 로드 시, 캐시 무시하고 강제 새로고침
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      this.window.location.reload();
    }
  });
});
