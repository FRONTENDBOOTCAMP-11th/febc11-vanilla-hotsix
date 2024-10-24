'use strict';
import axios from 'axios';
import getImg from '../../api/getImg';

const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;
// 토큰 획득
const token = sessionStorage.getItem('accessToken');

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
let curruntPost = await getPost();

// 게시글을 쓴 작가 정보를 가져오는 함수
const getAuthorInfo = async () => {
  try {
    const authorId = curruntPost.user._id;
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
const loginUser = await getLoginUser();

const titleDivNode = document.querySelector('.header__title');
const subTitleSpanNode = document.querySelector('.header__subtitle');
const authorSpanNode = document.querySelector('.info__author');
const timeSpanNode = document.querySelector('.info__time');
const articleNode = document.querySelector('.main__article');
const tagsSectionNode = document.querySelector('.main__tags');
const commentsNode = document.querySelector('.comments');

// header 부분 출력하는 함수
async function printHeader() {
  const [date, time] = curruntPost.createdAt.split(' ');
  const [year, month, day] = date.split('.');
  const dateObj = new Date(year, month, day);

  titleDivNode.innerHTML = curruntPost.title;
  subTitleSpanNode.innerHTML = curruntPost.extra.subTitle;
  authorSpanNode.innerHTML = curruntPost.user.name;
  timeSpanNode.innerHTML = `${monthNames[dateObj.getMonth() - 1]} ${day}. ${year}`;
}
printHeader();

// 게시글 본문 출력하는 함수
async function printArticle() {
  // 포맷을 유지하면서 어떻게 출력할지 고민 필요!
  articleNode.innerHTML = curruntPost.content;
}

// 태그를 출력하는 함수
async function printTags() {
  curruntPost.tag?.forEach(tag => {
    let span = document.createElement('span');
    span.className = 'tag';
    span.innerHTML = tag;
    tagsSectionNode.appendChild(span);
  });
}
printTags();

// 댓글은 추가될 때마다 태그를 생성해야 하기에 createElement로 작성
async function printComments() {
  const replies = curruntPost.replies;

  let commentCount = document.querySelector('.count-num');
  commentCount.innerHTML = curruntPost.replies.length;

  for (let comment of replies) {
    const [date, time] = curruntPost.createdAt.split(' ');
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
printComments();

// 댓글 추가란 렌더링하는 함수
async function printAddReply() {
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
printAddReply();

// 북마크 목록 가져오기
async function getBookmarks() {
  try {
    const response = await axios.get(`${apiUrl}/bookmarks/post/`, {
      headers: {
        'client-id': clientId,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.item;
  } catch (error) {
    console.log(error);
  }
}
let myBookmarkList = await getBookmarks();
console.log(myBookmarkList);

// 북마크 추가하는 이벤트 리스너
let bookmarkBtn = document.querySelector('#bookmarkBtn');
const likeIcon = document.querySelector('#icon-like');

bookmarkBtn.addEventListener('click', async () => {
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
      likeIcon.src = '../../assets/images/icon-like.svg';
      myBookmarkList = await getBookmarks();
      curruntPost = await getPost();
      likeCountSpan.innerHTML = curruntPost.bookmarks;
      console.log(myBookmarkList);
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
      likeIcon.src = '../../assets/images/icon-like_empty.svg';
      myBookmarkList = await getBookmarks();
      curruntPost = await getPost();
      likeCountSpan.innerHTML = curruntPost.bookmarks;
      console.log(myBookmarkList);
    }
  } catch (error) {
    console.log(error);
  }
});

// 북마크 상태에 따라 좋아요 버튼 스타일 변경
async function printBookmark() {
  if (myBookmarkList.some(item => item.post._id == curruntPost._id)) {
    likeIcon.src = '../../assets/images/icon-like.svg';
  } else {
    likeIcon.src = '../../assets/images/icon-like_empty.svg';
  }
}
printBookmark();

// 작가란 화면을 출력하는 함수
async function printAuthor() {
  const imgSrc = await getImg(author.image);

  let authorNickname = document.querySelector('.nickname');
  let authorJob = document.querySelector('.job');
  let authorInfo = document.querySelector('.author-info__contents');
  let authorSubs = document.querySelector('#subscriber');
  let authorImg = document.querySelector('.author__photo');

  authorNickname.innerHTML = curruntPost.user.name;
  authorJob.innerHTML = author.extra.job;
  authorInfo.innerHTML = author.extra.biography;
  authorSubs.innerHTML = author.bookmarkedBy.users;
  authorImg.src = imgSrc;
}
printAuthor();

async function printFooter() {
  let likeCount = document.querySelector('.like-count');
  let commentCount = document.querySelector('.comment-count');
  likeCount.innerHTML = curruntPost.bookmarks;
  commentCount.innerHTML = curruntPost.replies.length;
}
printFooter();
