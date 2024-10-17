const titleInputNode = document.querySelector('#titleInput');
const subtitleInputNode = document.querySelector('#subtitleInput');
const contentsTextAreaNode = document.querySelector('#contentsTextArea');
let checkBtn = document.querySelector('#checkBtn');

function checkInput() {
  if (
    titleInputNode.value.trim() &&
    subtitleInputNode.value.trim() &&
    contentsTextAreaNode.value.trim()
  ) {
    checkBtn.setAttribute('src', '../../assets/images/icon-check_green.svg');
  } else {
    checkBtn.setAttribute('src', '../../assets/images/icon-check_black.svg');
  }
}

titleInputNode.addEventListener('input', checkInput);
subtitleInputNode.addEventListener('input', checkInput);
contentsTextAreaNode.addEventListener('input', checkInput);
