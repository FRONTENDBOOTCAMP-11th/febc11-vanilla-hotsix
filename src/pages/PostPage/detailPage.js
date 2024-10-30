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

    localStorage.setItem('userId', response.data.item.user._id);
    return response.data.item;
  } catch (error) {
    console.log(error);
  }
};
let curruntPost = await getPost();
console.log(curruntPost);

// 게시글을 쓴 작가 정보를 가져오는 함수
const getAuthorInfo = async () => {
  try {
    const authorId = localStorage.getItem('userId');
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
  // 유저가 프사를 안 해 놨을 때 지정해놓을 기본 이미지 필요
  let userImage = '';
  if (comment.user.image) {
    userImage = `${apiUrl}${comment.user.image}`;
  } else {
    userImage = `${apiUrl}/files/${clientId}/user-muzi.webp`;
  }
  const imgSrc = userImage;

  let span = document.createElement('span');
  span.innerText = comment.user.name;
  let kebabMenu = document.createElement('img');
  kebabMenu.src = '/assets/images/button-kebab-menu.svg';
  let menuBtn = document.createElement('button');
  menuBtn.setAttribute('class', 'kebab-menu');
  menuBtn.addEventListener('click', () => {
    alert('준비중입니다.');
  });
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

  let replyBtn = document.createElement('button');
  replyBtn.innerText = '답글달기';
  let commentFooter = document.createElement('div');
  commentFooter.setAttribute('class', 'comment__footer');
  commentFooter.appendChild(replyBtn);

  let commentContents = document.createElement('section');
  commentContents.setAttribute('class', 'comment__contents');
  commentContents.appendChild(commentHeader);
  commentContents.appendChild(commentTxt);
  commentContents.appendChild(commentFooter);

  let profileImg = document.createElement('img');
  profileImg.setAttribute('class', 'profile-img');
  profileImg.src = imgSrc ? imgSrc : '';
  let commentProfile = document.createElement('section');
  commentProfile.setAttribute('class', 'comment__profile');
  commentProfile.appendChild(profileImg);

  let commentNode = document.createElement('div');
  commentNode.setAttribute('class', 'comment');
  commentNode.setAttribute('tabindex', '0');
  commentNode.appendChild(commentProfile);
  commentNode.appendChild(commentContents);

  commentsNode.appendChild(commentNode);
}

// 댓글 추가란 렌더링하는 함수
async function printAddReply() {
  let userName = '';
  let userImage = '';
  // 세션 혹은 로컬스토리지에서 로그인 유저 name, image 가져오기
  userName = sessionStorage.getItem('name')
    ? sessionStorage.getItem('name')
    : localStorage.getItem('name');
  userImage = sessionStorage.getItem('image')
    ? sessionStorage.getItem('image')
    : localStorage.getItem('image');

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

// 댓글 삭제하기

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

// 작가란 화면을 출력하는 함수
async function printAuthor() {
  let authorNickname = document.querySelector('.nickname');
  let authorJob = document.querySelector('.job');
  let authorInfo = document.querySelector('.author-info__contents');
  let authorSubs = document.querySelector('#subscriber');
  let authorImg = document.querySelector('.author__photo');

  authorNickname.innerHTML = curruntPost.user.name;
  if (author) {
    authorJob.innerHTML = author.extra.job;
    authorInfo.innerHTML = author.extra.biography;
    authorSubs.innerHTML = author.bookmarkedBy.users;
    authorImg.src = `${apiUrl}${author.image}`;
  }
}
printAuthor();

async function printFooter() {
  let likeCount = document.querySelector('.like-count');
  let commentCount = document.querySelector('.comment-count');
  likeCount.innerHTML = curruntPost.bookmarks;
  if (curruntPost.replies) {
    commentCount.innerHTML = curruntPost.replies.length;
  }
}
printFooter();
