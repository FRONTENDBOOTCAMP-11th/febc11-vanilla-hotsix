const titleInputNode = document.querySelector('#titleInput');
const subtitleInputNode = document.querySelector('#subtitleInput');
const editableDiv = document.querySelector('#editableDiv');
let checkBtn = document.querySelector('#checkBtn');

// 제목, 부제목, 내용이 채워졌을 때 체크박스 활성화
function checkInput() {
  if (
    titleInputNode.value.trim() &&
    subtitleInputNode.value.trim() &&
    editableDiv.textContent.trim()
  ) {
    checkBtn.setAttribute('src', '../../assets/images/icon-check_green.svg');
  } else {
    checkBtn.setAttribute('src', '../../assets/images/icon-check_black.svg');
  }
}

// 각각의 노드에 이벤트리스너 등록
titleInputNode.addEventListener('input', checkInput);
subtitleInputNode.addEventListener('input', checkInput);
editableDiv.addEventListener('input', checkInput);

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
