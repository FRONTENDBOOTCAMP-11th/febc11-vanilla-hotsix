document.addEventListener('DOMContentLoaded', function () {
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const rememberLogin = document.querySelector('input[type="checkbox"]');
  const loginButton = document.querySelector('.login-btn');
  const signupButton = document.querySelector('.signup-btn');

  // 페이지 로드 시, 캐시 무시하고 강제 새로고침
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      this.window.location.reload();
    }
  });

  // 페이지 로드 시 인풋 필드 초기화
  emailInput.value = '';
  passwordInput.value = '';
  rememberLogin.checked = false;

  // 다른 페이지에서 로그인 페이지로 진입한 경우, 직전 URL을 저장 (이미 저장된 값이 없는 경우에만)
  if (
    !sessionStorage.getItem('prevPage') &&
    document.referrer !== window.location.href
  ) {
    sessionStorage.setItem('prevPage', document.referrer);
  }

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
    // 환경 변수 사용
    const apiUrl = import.meta.env.VITE_API_URL;
    const clientId = import.meta.env.VITE_CLIENT_ID;

    // API 연결
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: `POST`,
        headers: { 'Content-Type': 'application/json', 'client-id': clientId },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // 로그인 성공
      if (response.ok) {
        const data = await response.json();
        console.log(data); // 응답 데이터가 잘 왔는지 확인

        // 로그인 상태 저장
        if (remember) {
          localStorage.setItem(`accessToken`, data.item.token.accessToken);
          localStorage.setItem(`refreshToken`, data.item.token.refreshToken);
          localStorage.setItem(`name`, data.item.name);
          localStorage.setItem(`email`, email);
          localStorage.setItem(`image`, data.item.image);
        } else {
          sessionStorage.setItem(`accessToken`, data.item.token.accessToken);
          sessionStorage.setItem(`refreshToken`, data.item.token.refreshToken);
          sessionStorage.setItem(`name`, data.item.name);
          sessionStorage.setItem(`email`, email);
          sessionStorage.setItem(`image`, data.item.image);
        }

        // 이전 페이지로 리다이렉트 (저장된 URL로 이동, 기본값은 메인 페이지 url)
        const redirectUrl =
          sessionStorage.getItem('prevPage') ||
          '/src/pages/MainPage/index.html';
        window.location.href = redirectUrl;

        // URL 삭제 (한 번 리다이렉트 후, 다음에는 적용되지 않도록)
        sessionStorage.removeItem('prevPage');

        // 로그인 실패
      } else {
        const errorData = await response.json();
        alert('로그인 실패: ' + errorData.message);
      }

      // 오류 발생 시
    } catch (error) {
      console.log('로그인 중 오류 발생: ', error);
      alert(`로그인 중 오류가 발생했습니다.`);
    }
  });

  // '회원가입' 버튼을 누르면 회원가입 페이지로 이동
  signupButton.addEventListener('click', function () {
    window.location.href = '/src/pages/signupPage/index.html';
  });

  // 로그인 정보 저장 여부에 따라 인풋 필드 설정
  if (localStorage.getItem('email')) {
    emailInput.value = localStorage.getItem('email');
  } else {
    emailInput.value = '';
  }

  // form 유효성 검사 --> 로그인 버튼 비활성화 상태로 초기화
  validateForm();
});
