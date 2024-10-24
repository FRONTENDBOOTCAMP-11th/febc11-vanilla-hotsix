import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;
// 토큰 획득
const token = sessionStorage.getItem('accessToken');
// 현재 url 획득

let titleInputNode = document.querySelector('#titleInput');
let subtitleInputNode = document.querySelector('#subtitleInput');
let editableDiv = document.querySelector('#editableDiv');
let editableDivContent = editableDiv.innerHTML;
let checkBtn = document.querySelector('#checkBtn');

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

// 체크버튼 mouseDown시 체크버튼 색상 변경
checkBtn.addEventListener('mousedown', () => {
  checkBtn.setAttribute('src', '/assets/images/icon-check_green.svg');
});

// 체크버튼 mouseUp시 (1) 색상 변경 (2) 모달창 오픈
checkBtn.addEventListener('mouseup', () => {
  checkBtn.setAttribute('src', '/assets/images/icon-check_black.svg');
  modal.className = 'modalWindow visible';
});

// modal 노드 획득
let modal = document.querySelector('.modalWindow');
let postBtn = document.querySelector('#modal-post');
let saveBtn = document.querySelector('#modal-save');
// let inspectBtn = document.querySelector('#modal-inspect');
let cancelBtn = document.querySelector('#modal-cancel');

// 발행 버튼 클릭시
postBtn.addEventListener('click', async () => {
  if (titleInputNode.value.trim() === '') {
    alert('제목을 입력하세요');
    modal.className = 'modalWindow hidden';
  } else if (editableDiv.innerHTML.trim() === '') {
    alert('내용을 입력하세요');
    modal.className = 'modalWindow hidden';
  } else {
    let post = new Post(
      titleInputNode.value,
      editableDiv.innerHTML,
      subtitleInputNode.value,
    );

    console.log(post);
    // 생성된 게시글 객체 서버로 전송
    const res = await axios.post(`${apiUrl}/posts`, post, {
      headers: {
        'Content-Type': 'application/json',
        'client-id': clientId,
        Authorization: `Bearer ${token}`,
      },
    });

    // 게시글 작성 완료 후 방금 작성한 게시물 상세 페이지로 이동
    const postId = res.data.item._id;
    window.location.href = `/src/pages/PostPage/detailPage.html?postId=${postId}`;
    // 객체 생성 후 입력칸 초기화
    titleInputNode.value = '';
    subtitleInputNode.value = '';
    editableDiv.innerHTML = '';

    // 모달 창 숨기기
    modal.className = 'modalWindow hidden';
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

    console.log(post);

    const res = await axios.post(`${apiUrl}/posts`, post, {
      headers: {
        'Content-Type': 'application/json',
        'client-id': clientId,
        Authorization: `Bearer ${token}`,
      },
    });
    // 게시글 작성 완료 후 방금 작성한 게시물 상세 페이지로 이동
    const postId = res.data.item._id;
    window.location.href = `/src/pages/PostPage/detailPage.html?postId=${postId}`;

    // 객체 생성 후 입력칸 초기화
    titleInputNode.value = '';
    subtitleInputNode.value = '';
    editableDiv.innerHTML = '';

    // 모달 창 닫기
    modal.className = 'modalWindow hidden';
  } else {
    alert('제목을 입력하세요.');
    modal.className = 'modalWindow hidden';
  }
});

// 취소 버튼을 누르면 닫힘
cancelBtn.addEventListener('click', () => {
  modal.className = 'modalWindow hidden';
});

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
  const filesArray = Array.from(files);

  if (filesArray) {
    for (const file of filesArray) {
      // (1) editableDiv 에 미리보기 추가
      const reader = new FileReader();
      reader.onload = function (e) {
        let img = document.createElement('img');
        img.src = e.target.result;
        img.style.marginBottom = '20px';
        editableDiv.appendChild(img);
      };
      reader.readAsDataURL(file);
      console.log(file);

      // (2) 서버로 파일 전송 : 추후에 발행버튼 눌렀을 때로 변경할 것.
      try {
        const formData = new FormData();
        formData.append('attach', file); // 파일 데이터 추가

        const response = await axios.post(`${apiUrl}/files/`, formData, {
          headers: {
            'client-id': clientId,
          },
        });
        console.log(response);
      } catch (error) {
        console.error('파일 업로드에 실패했습니다. 다시 시도해주세요.', error);
      }
    }
  }
});
