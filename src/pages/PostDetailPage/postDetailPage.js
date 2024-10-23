'use strict';
import axios from 'axios';
import getImg from '../../api/getImg';

const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

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
    const response = await axios.get(`${apiUrl}/posts/1`, {
      headers: {
        'client-id': clientId,
      },
    });
    return response.data.item;
  } catch (error) {
    console.log(error);
  }
};
getPost();

// 게시글을 쓴 작가 정보를 가져오는 함수
const getAuthorInfo = async () => {
  try {
    const POST = await getPost();
    const authorId = POST.user._id;
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
getAuthorInfo();

// 로그인한 유저 정보를 가져오는 함수
const getLoginUser = async () => {
  try {
    // 세션 스토리지에 저장된 이메일 주소 얻어오기
    const userEmail = sessionStorage.getItem('email');

    // 회원 가입된 전체 유저 객체 얻어오기
    const response = await axios.get(`${apiUrl}/users`, {
      headers: {
        'client-id': clientId,
      },
    });
    const users = response.data.item;

    // 세션 스토리지에 저장된 이메일 주소와 같은 이메일을 가진 유저를 users 객체에서 찾기
    const index = users.findIndex(user => user.email === userEmail);
    const loginUser = users[index];

    return loginUser;
  } catch (error) {
    console.log(error);
  }
};
getLoginUser();

const titleDivNode = document.querySelector('.header__title');
const subTitleSpanNode = document.querySelector('.header__subtitle');
const authorSpanNode = document.querySelector('.info__author');
const timeSpanNode = document.querySelector('.info__time');
const articleNode = document.querySelector('.main__article');
const tagsSectionNode = document.querySelector('.main__tags');
const commentsNode = document.querySelector('.comments');

// header 부분 출력하는 함수
async function printHeader() {
  const POST = await getPost();
  const [date, time] = POST.createdAt.split(' ');
  const [year, month, day] = date.split('.');
  const dateObj = new Date(year, month, day);

  titleDivNode.innerHTML = POST.title;
  subTitleSpanNode.innerHTML = POST.extra.subTitle;
  authorSpanNode.innerHTML = POST.user.name;
  timeSpanNode.innerHTML = `${monthNames[dateObj.getMonth() - 1]} ${day}. ${year}`;
}

// 게시글 본문 출력하는 함수
async function printArticle() {
  const POST = await getPost();
  // 포맷을 유지하면서 어떻게 출력할지 고민 필요!
  articleNode.innerHTML = POST.content;
}

// 태그를 출력하는 함수
async function printTags() {
  const POST = await getPost();
  POST.tag?.forEach(tag => {
    let span = document.createElement('span');
    span.className = 'tag';
    span.innerHTML = tag;
    tagsSectionNode.appendChild(span);
  });
}

// 댓글은 추가될 때마다 태그를 생성해야 하기에 createElement로 작성
async function printComments() {
  const POST = await getPost();
  const replies = POST.replies;

  let commentCount = document.querySelector('.count-num');
  commentCount.innerHTML = POST.replies.length;

  for (let comment of replies) {
    const [date, time] = POST.createdAt.split(' ');
    const [year, month, day] = date.split('.');
    const dateObj = new Date(year, month, day);
    // 유저가 프사를 안 해 놨을 때 지정해놓을 기본 이미지 필요
    const userImage = comment.user.image
      ? comment.user.image
      : `/files/${clientId}/user-muzi.webp`;
    const imgSrc = await getImg(userImage);

    let span = document.createElement('span');
    span.innerText = comment.user.name;
    let kebabMenu = document.createElement('img');
    kebabMenu.src = '../../assets/images/button-kebab-menu.svg';
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
    commentNode.appendChild(commentProfile);
    commentNode.appendChild(commentContents);

    commentsNode.appendChild(commentNode);
  }
}

// 댓글 추가란 렌더링하는 함수
async function printAddReply() {
  const loginUser = await getLoginUser();
  const imgSrc = loginUser.image
    ? loginUser.image
    : `/files/${clientId}/user-muzi.webp`;
  const userImg = await getImg(imgSrc);

  // 출력을 위한 DOM 노드 획득
  let commentInputNode = document.querySelector('.comments__comment-input');

  // innerHTML로 HTML 출력
  commentInputNode.innerHTML = `
    <div class="input-area">
      <div class="input-area__profile">
        <img class="img" src="${userImg}" />
        ${loginUser.name}
      </div>
      <textarea
        name=""
        id="commentInput"
        placeholder="댓글을 입력하세요."
      ></textarea>
    </div>
    <div class="submit-area">
      <button>등록</button>
    </div>
  `;
}

// 토근 획득
const token = sessionStorage.getItem('accessToken');

// 해당글을 북마크 했는지 가져오는 함수
async function getBookmarks() {
  try {
    const response = await axios.get(`${apiUrl}/bookmarks/post/`, {
      headers: {
        'client-id': clientId,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data.item);
    return response.data.item;
  } catch (error) {
    console.log(error);
  }
}

// 북마크 추가하는 이벤트 리스너
let bookmarkBtn = document.querySelector('#bookmarkBtn');
bookmarkBtn.addEventListener('click', async () => {
  // 현재 포스트의 아이디와 내 북마크 리스트 아이템의 아이디를 비교
  try {
    const curruntPost = await getPost();
    const myBookmarList = await getBookmarks();

    // 내 북마크 리스트에 현재 포스트가 북마크되어 있지 않다면 : 북마크 추가
    if (myBookmarList.every(item => item.post._id !== curruntPost._id)) {
      const response = await axios.post(
        `${apiUrl}/bookmarks/post`,
        {
          target_id: `${curruntPost._id}`,
          memo: '',
        },
        {
          headers: {
            'client-id': clientId,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
      console.log(myBookmarList);
      console.log('북마크 추가');
    } else {
      // 북마크 되어 있다면 : 북마크 제거
      const response = await axios.delete(
        `${apiUrl}/bookmarks/${curruntPost._id}`,
        {
          headers: {
            'client-id': clientId,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('북마크 제거');
    }
    console.log(myBookmarList, curruntPost._id);
  } catch (error) {
    console.log(error);
  }
});

// 북마크 상태에 따라 좋아요 버튼 src 변경하는 함수
async function printBookmark() {
  const bookmarkList = await getBookmarks();
  const curruntPost = await getPost();
  const likeIcon = document.querySelector('#icon-like');

  if (bookmarkList.some(item => item.post._id == curruntPost._id)) {
    likeIcon.src = '../../assets/images/icon-like.svg';
  } else {
    likeIcon.src = '../../assets/images/icon-like_empty.svg';
  }
}

// 작가란 화면을 출력하는 함수
async function printAuthor() {
  const POST = await getPost();
  const AUTHOR = await getAuthorInfo();
  const imgSrc = await getImg(AUTHOR.image);

  let authorNickname = document.querySelector('.nickname');
  let authorJob = document.querySelector('.job');
  let authorInfo = document.querySelector('.author-info__contents');
  let authorSubs = document.querySelector('#subscriber');
  let authorImg = document.querySelector('.author__photo');

  authorNickname.innerHTML = POST.user.name;
  authorJob.innerHTML = AUTHOR.extra.job;
  authorInfo.innerHTML = AUTHOR.extra.biography;
  authorSubs.innerHTML = AUTHOR.bookmarkedBy.users;
  authorImg.src = imgSrc;
}

async function printFooter() {
  const POST = await getPost();
  const AUTHOR = await getAuthorInfo();

  let likeCount = document.querySelector('.like-count');
  let commentCount = document.querySelector('.comment-count');
  likeCount.innerHTML = POST.bookmarks;
  commentCount.innerHTML = POST.replies.length;
}

// 게시글이 추가될 때마다 element를 생성해야 하는 게 아니니까, createElement로 하지 않고, innerHTML로 구현
window.onload = function () {
  printHeader();
  // printArticle();
  printTags();
  printComments();
  printAddReply();
  printAuthor();
  printBookmark();
  printFooter();
};
