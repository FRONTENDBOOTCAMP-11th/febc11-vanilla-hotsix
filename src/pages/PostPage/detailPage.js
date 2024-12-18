'use strict';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;
// 토큰 획득
const token = sessionStorage.getItem('accessToken')
  ? sessionStorage.getItem('accessToken')
  : localStorage.getItem('accessToken');

// URL에서 postId 추출하기
const params = new URLSearchParams(window.location.search);
const postId = params.get('postId');

// 로그인한 유저 정보 가져오기
let userName = sessionStorage.getItem('name')
  ? sessionStorage.getItem('name')
  : localStorage.getItem('name');
let userImage = sessionStorage.getItem('image')
  ? sessionStorage.getItem('image')
  : localStorage.getItem('image');
let userId = sessionStorage.getItem('id')
  ? sessionStorage.getItem('id')
  : localStorage.getItem('id');

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const subscribeContainer = document.getElementById('subscribe-container');

// 게시글 정보를 가져오는 함수
const getPost = async () => {
  try {
    const response = await axios.get(`${apiUrl}/posts/${postId}`, {
      headers: {
        'client-id': clientId,
      },
    });

    // 최근 본 게시글 저장하기
    // 기존 게시글 배열을 불러오기 (없으면 빈 배열 생성)
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // 중복 여부 확인: 동일한 ID가 있는지 확인
    const isDuplicate = posts.some(post => post._id === response.data.item._id);

    // 이미 존재하는 글이 아니라면,
    if (!isDuplicate) {
      // 스프레드 문법으로 새로운 게시글을 추가하여 배열 업데이트
      posts = [...posts, response.data.item];

      // 업데이트된 배열을 다시 localStorage에 저장
      localStorage.setItem('posts', JSON.stringify(posts));
    }

    // 구독 버튼 렌더링을 위한 작가 정보 비교/저장
    const authorId = response.data.item.user._id;
    localStorage.setItem('authorId', authorId);
    let userId = localStorage.getItem('id');
    if (Number(userId) === authorId) {
      subscribeContainer.style.display = 'none';
    } else {
      subscribeContainer.style.display = 'block'; // 요소를 다시 표시
    }
    return response.data.item;
  } catch (error) {
    console.log(error);
  }
};
let curruntPost = await getPost();
console.log(curruntPost);

// 게시글을 쓴 작가 정보를 가져오는 함수
const authorId = localStorage.getItem('authorId');
const getAuthorInfo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users/${authorId}`, {
      headers: {
        'client-id': clientId,
      },
    });
    return response.data.item;
  } catch (error) {
    console.log(error);
  }
};
const author = await getAuthorInfo();

const pageTitleNode = document.querySelector('title');
const titleDivNode = document.querySelector('.header__title');
const subTitleSpanNode = document.querySelector('.header__subtitle');
const authorSpanNode = document.querySelector('.info__author');
const timeSpanNode = document.querySelector('.info__time');
const articleNode = document.querySelector('.main__article');
const tagsSectionNode = document.querySelector('.main__tags');
const commentsNode = document.querySelector('.comments');

// 페이지 탭 제목 동적 출력
pageTitleNode.innerText = curruntPost.title;
// header 부분 출력하는 함수
async function printHeader() {
  const [date, time] = curruntPost.createdAt.split(' ');
  const [year, month, day] = date.split('.');
  const dateObj = new Date(year, month, day);

  titleDivNode.innerHTML = curruntPost.title;
  if (curruntPost.extra) {
    subTitleSpanNode.innerHTML = curruntPost.extra.subTitle
      ? curruntPost.extra.subTitle
      : '';
  }
  authorSpanNode.innerHTML = curruntPost.user.name;
  timeSpanNode.innerHTML = `${monthNames[dateObj.getMonth() - 1]} ${day}. ${year}`;
}
printHeader();

// 게시글 본문 출력하는 함수
async function printArticle() {
  // 1차적으로 가져온 content를 HTML로 변환하여 삽입
  articleNode.innerHTML = curruntPost.content;

  // content 안에 .wrap_img_float 클래스 찾기(이 div 때문에 이미지에 고정너비가 부여되어 오른쪽으로 overflow)
  const imgWrappers = articleNode.querySelectorAll('.wrap_img_float');

  if (imgWrappers) {
    // image 감싸고 있는 div의 고정 너비값 없애기
    for (const item of imgWrappers) {
      item.removeAttribute('style');
    }
  }
  // 이미지 태그 모두 찾아서 경로 수정
  const images = articleNode.querySelectorAll('img');
  for (const img of images) {
    const src = img.getAttribute('src');
    const newSrc = `${apiUrl}${src}`;
    img.src = newSrc;
  }

  articleNode.classList.add(curruntPost.extra.textAlign);

  // 자동으로 생성되는 span 태그의 인라인 속성 지우기
  const spans = articleNode.querySelectorAll('span');
  for (const span of spans) {
    span.removeAttribute('style');
  }
}
await printArticle();

// 태그를 출력하는 함수
async function printTags() {
  if (curruntPost.tag) {
    curruntPost.tag?.forEach(tag => {
      let span = document.createElement('span');
      span.className = 'tag';
      span.innerHTML = tag;
      tagsSectionNode.appendChild(span);
    });
  }
}
printTags();

// 현재 댓글 개수 출력해주는 DOM 노드 획득
const commentCount = document.querySelector('.count-num');
let footerCommentCount = document.querySelector('.comment-count');

// 현재 게시글 댓글 목록 불러오기 + 렌더링
async function printComments() {
  try {
    // 현재 게시물 댓글 불러오기
    const response = await axios.get(`${apiUrl}/posts/${postId}/replies`, {
      headers: {
        'client-id': clientId,
      },
    });
    const comments = response.data.item;
    commentCount.innerHTML = comments.length;
    // 댓글 출력하기
    if (comments) {
      // 기존에 달려 있는 댓글 전체 렌더링
      comments.forEach(comment => addComment(comment));
    }

    return response.data.item;
  } catch (error) {
    console.log(error);
  }
}
printComments();

// 댓글 추가하는 함수
function addComment(comment) {
  const [date, time] = curruntPost.createdAt.split(' ');
  const [year, month, day] = date.split('.');
  const dateObj = new Date(year, month, day);

  let span = document.createElement('span');
  span.innerText = comment.user.name;
  let kebabMenu = document.createElement('img');
  kebabMenu.src = '/assets/images/button-kebab-menu.svg';
  kebabMenu.setAttribute('class', 'kebab-menu-img');
  let menuBtn = document.createElement('button');
  menuBtn.setAttribute('class', 'kebab-menu');
  menuBtn.appendChild(kebabMenu);
  let nameDiv = document.createElement('div');
  nameDiv.setAttribute('class', 'name');
  nameDiv.appendChild(span);
  nameDiv.appendChild(menuBtn);

  let timeSpan = document.createElement('span');
  timeSpan.setAttribute('class', 'time');
  timeSpan.innerText = `${monthNames[dateObj.getMonth() - 1]} ${day}. ${year}`;
  let commentHeader = document.createElement('div');
  commentHeader.setAttribute('class', 'comment__header');
  commentHeader.appendChild(nameDiv);
  commentHeader.appendChild(timeSpan);

  let commentTxt = document.createElement('p');
  commentTxt.setAttribute('class', 'comment__text');
  commentTxt.innerText = comment.content;

  let commentFooter = document.createElement('div');
  commentFooter.setAttribute('class', 'comment__footer');

  let commentContents = document.createElement('section');
  commentContents.setAttribute('class', 'comment__contents');
  commentContents.appendChild(commentHeader);
  commentContents.appendChild(commentTxt);
  commentContents.appendChild(commentFooter);

  let profileImg = document.createElement('img');
  profileImg.setAttribute('class', 'profile-img');
  profileImg.src = `${apiUrl}${comment.user.image}`;
  let commentProfile = document.createElement('section');
  commentProfile.setAttribute('class', 'comment__profile');
  commentProfile.appendChild(profileImg);

  let commentNode = document.createElement('div');
  commentNode.setAttribute('class', 'comment');
  commentNode.setAttribute('tabindex', '0');
  commentNode.setAttribute('data-id', comment._id);
  commentNode.setAttribute('data-userId', comment.user._id);
  commentNode.appendChild(commentProfile);
  commentNode.appendChild(commentContents);

  commentsNode.appendChild(commentNode);
}

// 댓글을 삭제하는 함수 (이벤트 위임)
commentsNode.addEventListener('click', async e => {
  if (e.target.classList.contains('kebab-menu-img')) {
    const closestComment = e.target.closest('.comment');
    const commentId = parseInt(closestComment.getAttribute('data-id'));
    const commentAuthorId = parseInt(
      closestComment.getAttribute('data-userid'),
    );
    if (userId == commentAuthorId) {
      if (confirm('정말 이 댓글을 삭제하시겠습니까?')) {
        try {
          const response = await axios.delete(
            `${apiUrl}/posts/${postId}/replies/${commentId}`,
            {
              headers: {
                'client-id': clientId,
                Authorization: `Bearer ${token}`,
              },
            },
          );
          console.log(response);
          closestComment.remove();
          commentCount.innerHTML = parseInt(commentCount.innerHTML) - 1;
          footerCommentCount.innerHTML =
            parseInt(footerCommentCount.innerHTML) - 1;
          alert('댓글이 삭제되었습니다.');
        } catch (error) {
          alert('댓글 삭제에 실패했습니다.');
          console.log(error);
        }
      }
    } else {
      alert('자신이 작성한 댓글만 삭제할 수 있습니다.');
    }
  }
});

// 댓글 추가란 렌더링하는 함수
async function printAddReply() {
  // 출력을 위한 DOM 노드 획득
  const myCommentProfile = document.querySelector('.input-area__profile');
  const commentInputArea = document.querySelector('.comments__comment-input');
  // 로그인 되어 있을 때만 댓글 등록 가능
  if (token) {
    myCommentProfile.innerHTML = `<img class="img" src="${apiUrl}${userImage}" />
      ${userName}`;
  } else {
    commentInputArea.innerHTML = `
    <div class="login-require">
      브런치에 로그인하고 댓글을 입력해보세요!
    </div>
    `;
    const loginRequire = document.querySelector('.login-require');
    loginRequire?.addEventListener('click', () => {
      window.location.href = '/src/pages/LoginPage/index.html';
    });
  }
}
printAddReply();

// 댓글 등록 버튼 click 이벤트리스너 (댓글 등록)
const commentSubmitBtn = document.querySelector('#commentSubmitBtn');
commentSubmitBtn?.addEventListener('click', async () => {
  const commentInput = document.querySelector('#commentInput');
  if (commentInput.value) {
    try {
      const response = await axios.post(
        `${apiUrl}/posts/${postId}/replies`,
        {
          content: commentInput.value,
        },
        {
          headers: {
            'client-id': clientId,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
      // 새 댓글만 추가
      addComment(response.data.item);
      commentCount.innerHTML = parseInt(commentCount.innerHTML) + 1;
      footerCommentCount.innerHTML = parseInt(footerCommentCount.innerHTML) + 1;
      commentInput.value = '';
    } catch (error) {
      console.log(error);
    }
  } else {
    alert('댓글을 입력하세요.');
  }
});

// 댓글 등록 버튼 클릭할 때 색상 변경
commentSubmitBtn?.addEventListener('mousedown', () => {
  let btnImg = commentSubmitBtn.querySelector('img');
  btnImg.src = '/assets/images/button-comment-submit_clicked.svg';
});
commentSubmitBtn?.addEventListener('mouseup', () => {
  let btnImg = commentSubmitBtn.querySelector('img');
  btnImg.src = '/assets/images/button-comment-submit_default.svg';
});

// 북마크 목록 가져오기
async function getBookmarks() {
  try {
    // 로그인 되어 있을 때만 북마크 목록 가져오기 함수 실행
    if (token) {
      const response = await axios.get(`${apiUrl}/bookmarks/post/`, {
        headers: {
          'client-id': clientId,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.item;
    }
  } catch (error) {
    console.log(error);
  }
}
let myBookmarkList = await getBookmarks();

// 북마크 추가하는 이벤트 리스너
let bookmarkBtn = document.querySelector('#bookmarkBtn');
const likeIcon = document.querySelector('#icon-like');

bookmarkBtn.addEventListener('click', async () => {
  if (myBookmarkList) {
    const myBookmarkId = myBookmarkList.find(
      item => item.post._id === curruntPost._id,
    );
    const likeCountSpan = document.querySelector('.like-count');
    try {
      // 내 북마크 목록에 현재 게시물의 id와 같은 id를 가진애가 없다면 : 북마크 추가
      if (!myBookmarkId) {
        // 하트 아이콘 획득
        const response = await axios.post(
          `${apiUrl}/bookmarks/post`,
          {
            target_id: curruntPost._id,
            memo: '',
          },
          {
            headers: {
              'client-id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        likeIcon.src = '/assets/images/icon-like.svg';
        myBookmarkList = await getBookmarks();
        curruntPost = await getPost();
        likeCountSpan.innerHTML = curruntPost.bookmarks;
      } else {
        // 북마크 되어 있다면 : 북마크 제거
        const response = await axios.delete(
          `${apiUrl}/bookmarks/${myBookmarkId._id}`,
          {
            headers: {
              'client-id': clientId,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        likeIcon.src = '/assets/images/icon-like_empty.svg';
        myBookmarkList = await getBookmarks();
        curruntPost = await getPost();
        likeCountSpan.innerHTML = curruntPost.bookmarks;
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    likeIcon.addEventListener('click', () => {
      window.location.href = '/src/pages/LoginPage/index.html';
    });
  }
});

// 북마크 상태에 따라 좋아요 버튼 스타일 변경
async function printBookmark() {
  if (myBookmarkList?.some(item => item.post._id == curruntPost._id)) {
    likeIcon.src = '/assets/images/icon-like.svg';
  } else {
    likeIcon.src = '/assets/images/icon-like_empty.svg';
  }
}
printBookmark();

// 작가 정보 출력을 위한 노드 획득 (함수 2개에서 사용예정)
let authorNickname = document.querySelector('.nickname');
let authorImg = document.querySelector('.author__photo');
let authorSubs = document.querySelector('#subscriber');

// 작가란 화면을 출력하는 함수
async function printAuthor() {
  let authorJob = document.querySelector('.job');
  let authorInfo = document.querySelector('.author-info__contents');

  authorNickname.innerHTML = curruntPost.user.name;
  if (author) {
    authorJob.innerHTML = author.extra.job;
    authorInfo.innerHTML = author.extra.biography;
    authorSubs.innerHTML = author.bookmarkedBy.users;
    authorImg.src = `${apiUrl}${author.image}`;
  }
}
printAuthor();

// 작가 홈으로 이동하는 함수
function goToAuthorPage() {
  window.location.href = `/src/pages/AuthorPage/index.html?userId=${authorId}`;
}
// 작가 닉네임과 프로필사진을 누르면 해당 작가 홈으로 이동
authorSpanNode.addEventListener('click', goToAuthorPage);
authorNickname.addEventListener('click', goToAuthorPage);
authorImg.addEventListener('click', goToAuthorPage);

async function printFooter() {
  let likeCount = document.querySelector('.like-count');
  likeCount.innerHTML = curruntPost.bookmarks;
  if (curruntPost.replies) {
    footerCommentCount.innerHTML = curruntPost.replies.length;
  }
}
printFooter();

// SNS 공유 아이콘 클릭
let snsShagerIcon = document.querySelector('#shareIcon');
snsShagerIcon.addEventListener('click', () => {
  alert('준비중입니다.');
});

// 댓글 버튼을 눌렀을 때 댓글 목록 보이기/안보이기
const commentIcon = document.querySelector('#commentIcon');
// 댓글 보이기 상태관리 변수
let isShowComments = true;
commentIcon.addEventListener('click', () => {
  if (isShowComments) {
    commentsNode.style.display = 'none';
    isShowComments = false;
  } else {
    commentsNode.style.display = 'block';
    isShowComments = true;
  }
});
