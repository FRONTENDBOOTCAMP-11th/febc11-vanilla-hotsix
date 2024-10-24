import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

let titleInputNode = document.querySelector('#titleInput');
let subtitleInputNode = document.querySelector('#subtitleInput');
let editableDiv = document.querySelector('#editableDiv');
let editableDivContent = editableDiv.innerHTML;
let checkBtn = document.querySelector('#checkBtn');

// 매개변수 (type : 'post'로 고정, title, subtitle, content: string)
class Post {
  constructor(type, title, content, subtitle) {
    this.type = type;
    this.title = title;
    this.content = content;
    this.extra = {
      subtitle: subtitle,
    };
  }
}

// 체크버튼 mouseDown시 체크버튼 색상 변경
checkBtn.addEventListener('mousedown', () => {
  checkBtn.setAttribute('src', '../../assets/images/icon-check_green.svg');
});

// 체크버튼 mouseUp시 (1) 색상 변경 (2) 모달창 오픈
checkBtn.addEventListener('mouseup', () => {
  checkBtn.setAttribute('src', '../../assets/images/icon-check_black.svg');
  modal.className = 'modalWindow visible';
});

// modal 노드 획득
let modal = document.querySelector('.modalWindow');
let postBtn = document.querySelector('#modal-post');
let saveBtn = document.querySelector('#modal-save');
// let inspectBtn = document.querySelector('#modal-inspect');
let cancelBtn = document.querySelector('#modal-cancel');

// 발행 버튼 클릭시
postBtn.addEventListener('click', () => {
  if (titleInputNode.value.trim() === '') {
    alert('제목을 입력하세요');
    modal.className = 'modalWindow hidden';
  } else if (editableDiv.innerHTML.trim() === '') {
    alert('내용을 입력하세요');
    modal.className = 'modalWindow hidden';
  } else {
    let post = new Post(
      'post',
      titleInputNode.value,
      editableDiv.innerHTML,
      subtitleInputNode.value,
    );
    console.log(post);
    // 객체 생성 후 입력칸 초기화
    titleInputNode.value = '';
    subtitleInputNode.value = '';
    editableDiv.innerHTML = '';

    // 모달 창 숨기기
    modal.className = 'modalWindow hidden';
  }
});

// 저장 버튼 클릭시
saveBtn.addEventListener('click', () => {
  if (titleInputNode.value.trim() || editableDiv.innerHTML) {
    let post = new Post(
      'post',
      titleInputNode.value,
      editableDiv.innerHTML,
      subtitleInputNode.value,
    );
    console.log(post);
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

// 파일이 업로드 되면 contents 영역에 추가하는 함수
fileInputNode.addEventListener('change', e => {
  const files = e.target.files;
  if (files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function (e) {
        let img = document.createElement('img');
        img.src = e.target.result;
        img.marginBottom = '20px';
        editableDiv.appendChild(img);
      };
      reader.readAsDataURL(file);
      console.log(file);
    });
  }
});
