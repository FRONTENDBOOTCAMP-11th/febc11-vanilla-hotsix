'use strict';

import axios from 'axios';
import isLogin from '../../api/isLogin';

// 페이지 진입 시 즉시 로그인 상태 확인
(async () => {
  const loginStatus = await isLogin();

  if (loginStatus) {
    console.log('로그인 상태입니다.');
  } else {
    console.log('로그인이 필요합니다.');
    // 로그인 필요 시 로그인 페이지 이동
    //window.location.href = '/src/pages/LoginPage/index.html';
  }
})();

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

// 렌더링할 공간
const author = document.querySelector('.author');
const post = document.querySelector('.post');
const post2 = document.querySelector('.post2');
const post3 = document.querySelector('.mybox-my-contents');

const change = document.querySelector('.change-button');
change.addEventListener("click", () => {
  window.location.href='/src/pages/MyPage/userInfo.html'
})

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
            <div class="author-profile" data-id="${p.user._id}" tabindex="0">
              <img class="author-profile__img" src="${imgSrc}" />
              <p class="author-profile__name" alt="${p.user.name}의 프로필 이미지">${p.user.name}</p>
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
        <div class="post-recent-container" data-id="${p._id}"  tabindex="0">
          <div class="post-img-container">
            <img class="post-img" src="${imgSrc}" alt="${p.title}의 이미지"/>
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
      window.location.href = `/src/pages/PostPage/detailPage.html?postId=${postId}`;
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
            <div class="post-container" data-id="${p.post._id}" tabindex="0">
              <div class="post-img-container">
                <img class="post-img" src="${imgSrc}" alt="${p.post.title}의 이미지" />
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
          window.location.href = `/src/pages/PostPage/detailPage.html?postId=${postId}`;
        });
      });
    }
  } catch (err) {
    console.error(err);
  }
};
getBookedPost();

// 내 게시글 불러오기
const getMyPost = async () => {
  try {
    const res = await axios.get(`${apiUrl}/posts/users`, {
      headers: {
        'Content-Type': 'application/json',
        'client-id': clientId,
        Authorization: `Bearer ${token}`,
      },
    });
    const myPost = res.data.item;
    console.log(res.data.item);

    if (myPost) {
      post3.innerHTML = await Promise.all(
        myPost.map(async p => {
          return `
            <li class="mybox-my-contents-list" data-id="${p._id}" tabindex="0">
              <h3 class="mybox-my-contents-title">${p.title}</h3>
              <p class="mybox-my-contents-subtitle">${p.extra.subTitle}</p>
              <p class="mybox-my-contents-date">${p.updatedAt}</p>
            </li>
          `;
        }),
      ).then(htmlStrings => htmlStrings.join(''));

      // 게시글 클릭 시 이벤트 추가
      document.querySelectorAll('.mybox-my-contents-list').forEach(item => {
        item.addEventListener('click', () => {
          const postId = item.getAttribute('data-id');
          // 게시글 ID를 URL로 전달하여 PostDetailPage로 이동
          window.location.href = `/src/pages/PostPage/detailPage.html?postId=${postId}`;
        });
      });
    }
  } catch (err) {
    console.error(err);
  }
};
getMyPost();

// 로그아웃
const logoutBtn = document.querySelector('.logout-button');
logoutBtn.addEventListener('click', () => {
  if (confirm('정말 로그아웃 하시겠습니까?')) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('image');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    localStorage.removeItem('posts');

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('image');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('name');

    alert('로그아웃 되었습니다.');
    window.location.href = '/src/pages/MainPage/index.html';
  }
});
