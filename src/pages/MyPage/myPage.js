'use strict';

import axios from 'axios';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

// 렌더링할 공간
const author = document.querySelector('.author');
const post = document.querySelector('.post');
const post2 = document.querySelector('.post2');

// accessToken 가져오기
let token = '';
if (sessionStorage.getItem('accessToken')) {
  token = sessionStorage.getItem('accessToken');
} else {
  token = localStorage.getItem('accessToken');
}

// 관심 작가 렌더링
const getBookedUser = async () => {
  try {
    const res = await axios.get(`${apiUrl}/bookmarks/user`, {
      headers: {
        'Content-Type': 'application/json',
        'client-id': clientId,
        Authorization: `Bearer ${token}`,
      },
    });

    const bookedUser = res.data.item;
    console.log(bookedUser);

    // 관심작가가 있을 경우
    if (bookedUser) {
      author.innerHTML = await Promise.all(
        bookedUser.map(async p => {
          // 프로필 사진 변환하기
          const imgSrc = `${apiUrl}${p.user.image}`;

          // 렌더링
          return `
            <div class="author-profile" data-id="${p.user._id}">
              <img class="author-profile__img" src="${imgSrc}" />
              <p class="author-profile__name">${p.user.name}</p>
            </div>
          `;
        }),
      ).then(htmlStrings => htmlStrings.join(''));

      // 유저 프로필 클릭 시 이벤트 추가
      // .author-profile에 각각의 id를 추출해서 클릭이벤트 추가
      document.querySelectorAll('.author-profile').forEach(item => {
        item.addEventListener('click', () => {
          // id 추출하기
          const postId = item.getAttribute('data-id');
          // 게시글 ID를 URL로 전달하여 PostDetailPage로 이동
          window.location.href = `/src/pages/AuthorPage/index.html?userId=${postId}`;
        });
      });
    }
  } catch (err) {
    console.error(err);
  }
};
getBookedUser();

// 최근 본 게시글 정보 렌더링
const getRecentPost = async () => {
  // localStorage에서 최근 본 게시글 정보 가져오기
  const recentPost = JSON.parse(localStorage.getItem('posts')) || [];

  // 최근 본 게시글 렌더링하기
  post.innerHTML = await Promise.all(
    recentPost.map(async p => {
      // 이미지 변환하기
      const imgSrc = `${apiUrl}${p.image}`;

      // 렌더링하기
      return `
        <div class="post-recent-container" data-id="${p._id}">
          <div class="post-img-container">
            <img class="post-img" src="${imgSrc}"/>
            <div class="post-img-info">
              <p class="post-img-title">${p.title}</p>
              <p class="post-img-author">${p.user.name}</p>
            </div>
          </div>

          <p class="post-title">${p.title}</p>
          <p class="post-author"><b>by</b> ${p.user.name}</p>
      </div>
      `;
    }),
  ).then(htmlStrings => htmlStrings.join(''));

  // 게시글 클릭 시 이벤트 추가
  document.querySelectorAll('.post-recent-container').forEach(item => {
    item.addEventListener('click', () => {
      const postId = item.getAttribute('data-id');
      // 게시글 ID를 URL로 전달하여 PostDetailPage로 이동
      window.location.href = `/src/pages/PostDetailPage/index.html?postId=${postId}`;
    });
  });
};
getRecentPost();

// 관심 글 렌더링
const getBookedPost = async () => {
  try {
    const res = await axios.get(`${apiUrl}/bookmarks/post`, {
      headers: {
        'Content-Type': 'application/json',
        'client-id': clientId,
        Authorization: `Bearer ${token}`,
      },
    });

    const bookedPost = res.data.item;
    //console.log(bookedPost);

    if (bookedPost) {
      post2.innerHTML = await Promise.all(
        bookedPost.map(async p => {
          // 이미지 변환하기
          const imgSrc = `${apiUrl}${p.post.image}`;
          return `
            <div class="post-container" data-id="${p.post._id}">
              <div class="post-img-container">
                <img class="post-img" src="${imgSrc}"/>
                <div class="post-img-info">
                  <p class="post-img-title">${p.post.title}</p>
                  <p class="post-img-author">${p.post.user.name}</p> 
                </div>
              </div>
    
              <p class="post-title">${p.post.title}</p>
              <p class="post-author"><b>by</b> ${p.post.user.name}</p>
            </div>
          `;
        }),
      ).then(htmlStrings => htmlStrings.join(''));

      // 게시글 클릭 시 이벤트 추가
      document.querySelectorAll('.post-container').forEach(item => {
        item.addEventListener('click', () => {
          const postId = item.getAttribute('data-id');
          // 게시글 ID를 URL로 전달하여 PostDetailPage로 이동
          window.location.href = `/src/pages/PostDetailPage/index.html?postId=${postId}`;
        });
      });
    }
  } catch (err) {
    console.error(err);
  }
};
getBookedPost();
