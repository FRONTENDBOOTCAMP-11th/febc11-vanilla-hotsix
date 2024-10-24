'use strict';

import axios from 'axios';
import getImg from '../../api/getImg';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

// 렌더링할 공간
const author = document.querySelector('.author');
const post = document.querySelector('.post');
const post2 = document.querySelector('.post2');

const DUMMY_POST = {
  list: [
    {
      id: 1,
      title: '어쩌구저쩌구',
      author: '작가이름입니다',
      image: '책표지그림~',
    },
    {
      id: 2,
      title:
        '어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구',
      author: '작가이름입니다작가이름입니다작가이름입니다작가이름입니다',
      image: '책표지그림~',
    },
    {
      id: 3,
      title: '어쩌구저쩌구',
      author: '작가이름입니다',
      image: '책표지그림~',
    },
    {
      id: 4,
      title: '어쩌구저쩌구',
      author: '작가이름입니다',
      image: '책표지그림~',
    },
    {
      id: 5,
      title: '어쩌구저쩌구',
      author: '작가이름입니다',
      image: '책표지그림~',
    },
    {
      id: 6,
      title: '어쩌구저쩌구',
      author: '작가이름입니다',
      image: '책표지그림~',
    },
  ],
};

// accessToken 가져오기
const token = localStorage.getItem('accessToken');

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

    if (bookedUser) {
      author.innerHTML = await Promise.all(
        bookedUser.map(async p => {
          const imgSrc = await getImg(
            p.user.image ? p.user.image : '/files/vanilla06/user-neo.webp',
          ); // getImg 함수 호출
          return `
            <div class="author-profile" data-id="${p.user._id}">
              <img class="author-profile__img" src="${imgSrc}" />
              <p class="author-profile__name">${p.user.name}</p>
            </div>
          `;
        }),
      ).then(htmlStrings => htmlStrings.join(''));

      // 유저 프로필 클릭 시 이벤트 추가
      document.querySelectorAll('.author-profile').forEach(item => {
        item.addEventListener('click', () => {
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
post.innerHTML = DUMMY_POST.list
  .map(p => {
    return `
  <div class="author-profile">

    <div class="post-img-container">
      <div class="post-img"></div>
      <div class="post-img-info">
        <p class="post-img-title">${p.title}</p>
        <p class="post-img-author">${p.author}</p>
      </div>
    </div>

    <p class="post-title">${p.title}</p>
    <p class="post-author"><b>by</b> ${p.author}</p>
  </div>
`;
  })
  .join(' ');

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
    console.log(bookedPost);

    if (bookedPost) {
      post2.innerHTML = await Promise.all(
        bookedPost.map(async p => {
          const imgUrl = await getImg(p.post.image);
          console.log(p.post._id);
          return `
            <div class="post-container" data-id="${p.post._id}">
              <div class="post-img-container">
                <img class="post-img" src="${imgUrl}"/>
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
