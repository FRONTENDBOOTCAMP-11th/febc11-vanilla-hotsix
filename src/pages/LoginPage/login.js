document.addEventListener('DOMContentLoaded', function () {
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const rememberLogin = document.querySelector('input[type="checkbox"]');
  const loginButton = document.querySelector('.login-btn');
  const signupButton = document.querySelector('.signup-btn');

  // 이메일 주소 유효성 검사
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // 폼 전체 (이메일 주소, 비밀번호) 유효성 검사
  function validateForm() {
    const isEmailValid = validateEmail(emailInput.value);
    const isPasswordValid = passwordInput.value.length > 0;

    if (isEmailValid && isPasswordValid) {
      loginButton.disabled = false; // 로그인 버튼 활성화
      loginButton.style.backgroundColor = 'var(--mint)';
    } else {
      loginButton.disabled = true; // 로그인 버튼 비활성화
      loginButton.style.backgroundColor = 'var(--grey_60)';
    }
  }

  // 입력값이 변경될 때마다 유효성 검사 실행
  emailInput.addEventListener('input', validateForm);
  passwordInput.addEventListener('input', validateForm);

  // 로그인 폼 제출 시 처리
  document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    const remember = rememberLogin.checked;
    const apiUrl = import.meta.env.VITE_API_HOST; // 환경 변수 차용

    // API 연결
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: `POST`,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // 로그인 성공
      if (response.ok) {
        const data = await response.json();
        window.location.href =
          'http://192.168.45.139:5173/src/pages/MainPage/index.html'; // 메인화면으로 이동

        if (remember) {
          // '로그인 정보 저장' 체크 시 localStorage에 저장
          localStorage.setItem(`accessToken`, data.token.accessToken);
          localStorage.setItem(`refreshToken`, data.token.refreshToken);
          localStorage.setItem(`email`, email);
        } else {
          // '로그인 정보 저장' 체크 해제 시 sessionStorage에 저장
          sessionStorage.setItem(`accessToken`, data.token.accessToken);
          sessionStorage.setItem(`refreshToken`, data.token.refreshToken);
          sessionStorage.setItem(`email`, email);
        }

        // 로그인 실패
      } else {
        const errorData = await response.json();
        alert('로그인 실패: ' + errorData.message);
      }

      // 오류 발생
    } catch (error) {
      console.log('로그인 중 오류 발생: ', error);
      alert(`로그인 중 오류가 발생했습니다.`);
    }
  });

  // '회원가입' 버튼을 누르면 회원가입 페이지로 이동
  signupButton.addEventListener('click', function () {
    window.location.href =
      'http://192.168.45.139:5173/src/pages/signupPage/index.html';
  });

  // 페이지 로드 시 바로 form 유효성 검사 --> 로그인 버튼 비활성화 상태로 초기화
  validateForm();

  // 페이지 로드 시 저장된 이메일 값이 있으면 불러오기
  const savedEmail =
    localStorage.getItem('email') || sessionStorage.getItem('email');
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberLogin.checked = !!localStorage.getItem('email');
  }
});
