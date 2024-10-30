'use strict';

import axios from 'axios';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

// 유저 id 가져오기
// URL에서 userId 추출하기
const params = new URLSearchParams(window.location.search);
const userId = params.get('userId');

// 받아올 유저정보
const userName = document.querySelector('.author-info__name');
const userRole = document.querySelector('.author-info__role');
const userImg = document.querySelector('.author-info__avatar');
const bookmarkedBy = document.querySelector('.bookmarkedBy'); // 구독자
const bookmarked = document.querySelector('.bookmarked'); // 관심작가

// 유저 정보 받아오기 통신
const getUserInfo = async () => {
  try {
    const res = await axios.get(`${apiUrl}/users/${userId}`, {
      headers: {
        'client-id': clientId,
        'Content-Type': 'application/json',
      },
    });
    console.log(res);

    // 유저정보 넣기
    userName.innerHTML = res.data.item.name;
    userRole.innerHTML = res.data.item.extra.job;
    bookmarkedBy.innerHTML = res.data.item.bookmarkedBy.users;
    bookmarked.innerHTML = res.data.item.bookmark.users;

    // 이미지 src 가져오기 (비동기 처리 대기)
    userImg.src = `${apiUrl}${res.data.item.image}`;
  } catch (err) {
    console.error(err);
  }
};
getUserInfo();

// 게시물 리스트 공간
const postList = document.querySelector('.post-list--container');

// 월 글자로 표시하기
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

// 해당 유저의 게시물 목록 가져오기
const getUserPost = async () => {
  try {
    const res = await axios.get(apiUrl + `/posts/users/${userId}`, {
      headers: {
        'client-id': clientId,
        'Content-Type': 'application/json',
      },
    });

    // 게시글 렌더링 하기
    // 게시글이 없으면 undefined (옵셔널 체이닝)
    const posts = res.data?.item;
    console.log(posts);

    if (posts) {
      postList.innerHTML = posts
        .map(post => {
          // 날짜 형식 변경하기 (2024.01.01 -> Jan 01. 2024)
          const [datePart, timePart] = post.updatedAt.split(' ');
          const [year, month, day] = datePart.split('.');
          const dateObj = new Date(`${year}-${month}-${day}`);
          const formattedDate = `${monthNames[dateObj.getMonth()]} ${day}. ${year}`;

          return `
            <li class="post" data-id="${post._id}" tabindex="0">
              <p class="post-category">${post.type}</p>
              <h3 class="post-title">${post.title}</h3>
              <span class="post-content">${post.content}</span>
              <div class="post-status-container">
                <p class="post-status">댓글${post.repliesCount}</p>
                <p class="post-status">${formattedDate}</p>
              </div>
            </li>
          `;
        })
        .join('');

      // HTML로 오는 게시글 텍스트로 전환
      const postContents = document.querySelectorAll('.post-content');
      postContents.forEach((contentElement, index) => {
        // 태그 사이의 텍스트만 추출
        const textOnly = contentElement.textContent.trim();

        // post.extra.subTitle 가져오기
        if (posts[index].extra && posts[index].extra.subTitle) {
          contentElement.textContent = `${posts[index].extra.subTitle} | ${textOnly}`;
        } else {
          contentElement.textContent = textOnly;
        }
      });

      // 게시글 클릭 이벤트
      postList.addEventListener('click', event => {
        const target = event.target.closest('.post');
        if (target) {
          const postId = target.getAttribute('data-id');
          // 게시글 ID를 URL로 전달하여 PostDetailPage로 이동
          window.location.href = `/src/pages/PostPage/detailPage.html?postId=${postId}`;
        }
      });
    } else {
      console.error('게시글을 불러오는 데 실패했습니다.');
      postList.innerHTML = '<p>게시글을 불러오는 데 실패했습니다.</p>';
    }
  } catch (err) {
    console.log(err);
  }
};
getUserPost();
