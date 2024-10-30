import axios from 'axios';
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

const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;
// 토큰 획득
const token = sessionStorage.getItem('accessToken')
  ? sessionStorage.getItem('accessToken')
  : localStorage.getItem('accessToken');

let titleInputNode = document.querySelector('#titleInput');
let subtitleInputNode = document.querySelector('#subtitleInput');
let editableDiv = document.querySelector('#editableDiv');
let closeBtn = document.querySelector('#closeBtn');
let checkBtn = document.querySelector('#checkBtn');
let checkBtnImg = document.querySelector('#checkBtnImg');

// 매개변수 (type : 'post'로 고정, title, subtitle, content: string)
class Post {
  constructor(
    title,
    content,
    subtitle = '',
    image = `/files/${clientId}/park.jpg`,
  ) {
    this.type = 'post';
    this.title = title;
    this.content = content;
    this.image = image;
    this.extra = {
      subtitle: subtitle,
    };
  }
}
// 닫기 버튼 클릭시 이전 페이지로 돌아가기
closeBtn.addEventListener('click', () => {
  history.back();
});

// 체크버튼 mouseDown시 체크버튼 색상 변경
checkBtn.addEventListener('mousedown', () => {
  checkBtnImg.setAttribute('src', '/assets/images/icon-check_green.svg');
});

// modal 노드 획득
let pageTitle = document.querySelector('#pageTitle');
let modal = document.querySelector('.modalWindow');
let postBtn = document.querySelector('#modal-post');
let saveBtn = document.querySelector('#modal-save');
let modalQuestion = document.querySelector('#modal-question');

// 포커스 가능한 모든 요소 선택
const focusableElements = Array.from(
  document.querySelectorAll('button, input, a, [tabindex="0"]'),
);

// 모달 창 열기 함수
function openModal() {
  // 모달창 보여주기
  modal.className = 'modalWindow visible';
  // 포커스를 모달창 내부의 첫번째 요소로 설정
  modalQuestion.focus();

  modal.addEventListener('keydown', e => {
    if (e.key === 'Tab' && !e.shiftKey) {
      const modalFocusableElement = Array.from(
        modal.querySelectorAll('button'),
      );
      // 현재 포커스되어 있는 요소 반환
      const activeElement = document.activeElement;
      // activeElement가 현재 페이지의 focusableElements 요소중 마지막 요소이면 true를 반환
      const isLastFocusable =
        activeElement ===
        modalFocusableElement[modalFocusableElement.length - 1];

      if (isLastFocusable) {
        e.preventDefault();
        modalQuestion.focus();
      }
    }
  });
}

// 모달 창 닫기 함수
function closeModal() {
  modal.className = 'modalWindow hidden';
}

// 체크버튼 mouseUp시 (1) 색상 변경 (2) 모달창 오픈
checkBtn.addEventListener('click', () => {
  checkBtnImg.setAttribute('src', '/assets/images/icon-check_black.svg');
  openModal();
});

// 완료 버튼을 기본 탭 순서에서 제외
checkBtn.setAttribute('tabindex', '-1');

// 완료 버튼을 마지막으로 선택되게 하기 위해 tabindex 조정
document.addEventListener('keydown', e => {
  if (e.key === 'Tab' && !e.shiftKey) {
    // 현재 포커스되어 있는 요소 반환
    const activeElement = document.activeElement;
    // activeElement가 현재 페이지의 focusableElements 요소중 마지막 요소이면 true를 반환
    const isLastFocusable =
      activeElement === focusableElements[focusableElements.length - 1];

    if (isLastFocusable) {
      e.preventDefault();
      checkBtn.focus();
    } else if (activeElement === checkBtn) {
      e.preventDefault();
      closeBtn.focus();
    }
  }
});

let cancelBtn = document.querySelector('#modal-cancel');

// 발행 버튼 클릭시
postBtn.addEventListener('click', async () => {
  if (titleInputNode.value.trim() === '') {
    alert('제목을 입력하세요');
    closeModal();
  } else if (editableDiv.innerText.trim() === '') {
    alert('내용을 입력하세요');
    closeModal();
  } else {
    // editableDiv.innerHTML의 img 태그들 찾기
    const Images = editableDiv.querySelectorAll('img');
    // 첫 번째 이미지는 경로를 추출하여 대표이미지로 설정
    const fisrtImagePath = Images[0]?.src.match(/\/files\/.+$/);

    // 모든 이미지의 src 속성 수정
    for (const img of Images) {
      const imagePath = img.src;
      console.log(imagePath);
      const newImagePath = imagePath?.match(/\/files\/.+$/);
      console.log(newImagePath[0]);
      img.src = newImagePath[0];
    }

    let post = new Post(
      titleInputNode.value,
      editableDiv.innerHTML,
      subtitleInputNode.value,
    );

    if (fisrtImagePath) {
      post.image = fisrtImagePath;
    }

    console.log(post);

    // 생성된 게시글 객체 서버로 전송
    try {
      const res = await axios.post(`${apiUrl}/posts`, post, {
        headers: {
          'Content-Type': 'application/json',
          'client-id': clientId,
          Authorization: `Bearer ${token}`,
        },
      });

      closeModal();

      // 객체 생성 후 입력칸 초기화
      titleInputNode.value = '';
      subtitleInputNode.value = '';
      editableDiv.innerHTML = '';

      console.log(res);
      // 게시글 작성 완료 후 방금 작성한 게시물 상세 페이지로 이동
      const postId = res.data.item._id;
      window.location.href = `/src/pages/PostPage/detailPage.html?postId=${postId}`;
    } catch (error) {
      console.log(error);
    }
  }
});

// 저장 버튼 클릭시
saveBtn.addEventListener('click', async () => {
  alert('준비중입니다.');
});

// 맞춤법 검사 버튼 클릭
let inspectBtn = document.querySelector('#modal-inspect');
inspectBtn.addEventListener('click', () => {
  alert('준비중입니다.');
});

// 취소 버튼을 누르면 닫힘
cancelBtn.addEventListener('click', closeModal);

// 외부 클릭시 닫힘
window.onclick = function (event) {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
};

const uploadImgNode = document.querySelector('#uploadImg');
const fileInputNode = document.querySelector('#fileInput');

// uploadImg를 클릭하면 fileInputNode를 클릭하게 된다.
uploadImgNode.addEventListener('click', () => {
  fileInputNode.click();
});

// 파일 업로드시 실행될 함수
fileInputNode.addEventListener('change', async e => {
  const files = e.target.files;
  // 이터러블 객체인 files를 배열로 변환
  const filesArray = Array.from(files);
  const formData = new FormData();

  if (filesArray) {
    for (const file of filesArray) {
      // 첨부한 이미지 파일을 formData에 삽입
      formData.append('attach', file);
      // 동일한 이미지 첨부 가능하게 하기 위해 파일 입력 요소 초기화
      fileInputNode.value = '';

      // 이미지 첨부시 서버로 전송
      try {
        const response = await axios.post(`${apiUrl}/files`, formData, {
          headers: {
            'client-id': clientId,
          },
        });

        // 응답값에서 path를 이미지 src 속성으로 지정
        const img = document.createElement('img');
        img.src = `${apiUrl}${response.data.item[0].path}`;
        // 이미지가 독립된 한 줄을 차지하도록 설정
        img.style.display = 'block';
        img.style.margin = '0 auto';

        // 사용자가 선택한 텍스트 또는 커서 위치 정보 가져오기
        const selection = window.getSelection();

        // 커서가 editableDiv 안에 위치해있다면 실행
        if (selection.rangeCount > 0) {
          // 현재 선택된 첫 번째 범위 가져오기.
          // range : 실제로 커서가 있는 위치를 나타내는 범위 객체
          const range = selection.getRangeAt(0);
          range.insertNode(img); // 커서 위치에 이미지 삽입
          range.setStartAfter(img); // 커서를 이미지 뒤로 이동
          // 시작 지점으로 커서를 이동시킨다.
          range.collapse(true);
          // selection 객체의 모든 범위 제거하여 현재 선택 상태 초기화
          selection.removeAllRanges();
          // 앞서 설정한 range를 selection에 추가하여 커서가 이미지 뒤에 위치하도록 함.
          selection.addRange(range);
        }
        editableDiv.focus();

        // 이미지 이후 한줄을 띄워서 커서가 자동으로 아래에 위치하게 함
        const spacer = document.createElement('div');
        spacer.innerHTML = '<br>';
        editableDiv.appendChild(spacer);
      } catch (error) {
        console.log(error);
      }
    }
  }
});

const textAlignBtn = document.querySelector('#text-align-btn');
// 텍스트 정렬 버튼
textAlignBtn.addEventListener('click', () => {
  if (!editableDiv.hasAttribute('class')) {
    editableDiv.classList.add('text-center');
    textAlignBtn.src = '/assets/images/icon-text-alignment_center.svg';
  } else if (editableDiv.classList.contains('text-center')) {
    editableDiv.className = 'text-right';
    textAlignBtn.src = '/assets/images/icon-text-alignment_right.svg';
  } else {
    editableDiv.removeAttribute('class');
    textAlignBtn.src = '/assets/images/icon-text-alignment_left.svg';
  }
});
