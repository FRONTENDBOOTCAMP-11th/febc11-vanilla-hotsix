document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const nicknameInput = document.getElementById('nickname');
  const emailInput = document.getElementById('email');
  const emailFeedback = document.getElementById('email-feedback');
  const passwordInput = document.getElementById('password');
  const passwordFeedback = document.getElementById('password-feedback');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const confirmPasswordFeedback = document.getElementById(
    'confirm-password-feedback',
  );
  const checkEmailButton = document.getElementById('check-email');
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
      emailFeedback.textContent = '유효하지 않은 이메일 주소입니다';
      emailFeedback.style.color = 'red';
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
          emailFeedback.textContent = '사용할 수 있는 이메일입니다.';
          emailFeedback.style.color = 'green';
          isEmailChecked = true;
        } else {
          emailFeedback.textContent = '이미 존재하는 이메일입니다.';
          emailFeedback.style.color = 'red';
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
      passwordFeedback.textContent = '사용할 수 있는 비밀번호입니다.';
      passwordFeedback.style.color = 'green';
    } else {
      passwordFeedback.textContent =
        '대소문자, 숫자 조합 8자 이상이어야 합니다.';
      passwordFeedback.style.color = 'red';
    }
    checkFormValidity();
  });

  // 비밀번호 일치 여부 확인
  confirmPasswordInput.addEventListener('input', function () {
    isPasswordConfirmed = confirmPasswordInput.value === passwordInput.value;

    if (isPasswordConfirmed) {
      confirmPasswordFeedback.textContent = '비밀번호가 일치합니다.';
      confirmPasswordFeedback.style.color = 'green';
    } else {
      confirmPasswordFeedback.textContent = '비밀번호가 일치하지 않습니다.';
      confirmPasswordFeedback.style.color = 'red';
    }
    checkFormValidity();
  });

  // 폼 제출 처리
  signupButton.addEventListener('submit', function (e) {
    e.preventDefault();

    const userData = {
      name: nicknameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
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
          this.window.location.href = '/src/pages/mainPage/index.html'; // 메인 페이지로 리다이렉트
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
});
