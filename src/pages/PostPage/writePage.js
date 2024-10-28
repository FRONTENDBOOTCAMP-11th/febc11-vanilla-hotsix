import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;
// 토큰 획득
const token = sessionStorage.getItem('accessToken');

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
    image = `${apiUrl}/files/${clientId}/park.jpg`,
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

// let inspectBtn = document.querySelector('#modal-inspect');
let cancelBtn = document.querySelector('#modal-cancel');

// post.content의 내용을 DOM으로 변경하기 위한 DOMParser 생성
const parser = new DOMParser();

// 발행 버튼 클릭시
postBtn.addEventListener('click', async () => {
  if (titleInputNode.value.trim() === '') {
    alert('제목을 입력하세요');
    closeModal();
  } else if (editableDiv.innerHTML.trim() === '') {
    alert('내용을 입력하세요');
    closeModal();
  } else {
    let post = new Post(
      titleInputNode.value,
      editableDiv.innerHTML,
      subtitleInputNode.value,
    );

    // post.content 내용을 DOM으로 변환
    const doc = parser.parseFromString(post.content, 'text/html');
    // 생성된 post.content의 첫번째 img 태그 찾기
    const firstImg = doc.querySelector('img');

    if (firstImg) {
      post.image = firstImg.src;
    }

    // 생성된 게시글 객체 서버로 전송
    try {
      const res = await axios.post(`${apiUrl}/posts`, post, {
        headers: {
          'Content-Type': 'application/json',
          'client-id': clientId,
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res, post);

      // 객체 생성 후 입력칸 초기화
      titleInputNode.value = '';
      subtitleInputNode.value = '';
      editableDiv.innerHTML = '';

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
  if (titleInputNode.value.trim() || editableDiv.innerHTML) {
    let post = new Post(
      titleInputNode.value,
      editableDiv.innerHTML,
      subtitleInputNode.value,
    );
    post.private = true; // post 객체에 private 속성 추가

    // post.content 내용을 DOM으로 변환
    const doc = parser.parseFromString(post.content, 'text/html');
    // 생성된 post.content의 첫번째 img 태그 찾기
    const firstImg = doc.querySelector('img');

    if (firstImg) {
      post.image = firstImg.src;
    }

    // 생성된 게시글 객체 서버로 전송
    try {
      const res = await axios.post(`${apiUrl}/posts`, post, {
        headers: {
          'Content-Type': 'application/json',
          'client-id': clientId,
          Authorization: `Bearer ${token}`,
        },
      });
      // 객체 생성 후 입력칸 초기화
      titleInputNode.value = '';
      subtitleInputNode.value = '';
      editableDiv.innerHTML = '';

      // 게시글 작성 완료 후 방금 작성한 게시물 상세 페이지로 이동
      const postId = res.data.item._id;
      window.location.href = `/src/pages/PostPage/detailPage.html?postId=${postId}`;
    } catch (error) {
      console.log(error);
    }
  } else {
    alert('제목을 입력하세요.');
    closeModal();
  }
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

      // 이미지 첨부시 서버로 전송
      try {
        const response = await axios.post(`${apiUrl}/files`, formData, {
          headers: {
            'client-id': clientId,
          },
        });
        console.log(response);
        // 응답값에서 path를 이미지 src 속성으로 지정
        const img = document.createElement('img');
        img.src = `${apiUrl}${response.data.item[0].path}`;
        img.style.margin = '10px 0';

        // 이미지 미리보기를 위해 editableDiv에 삽입
        editableDiv.appendChild(img);
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
