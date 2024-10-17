'use strict';

const author = document.querySelector('.author');
const post = document.querySelector('.post');
const post2 = document.querySelector('.post2');

const DUMMY_AUTHOR = {
  list: [
    {
      id: 1,
      name: '장유진',
      profile: '이미지 URL',
    },
    {
      id: 2,
      name: '장유진',
      profile: '이미지 URL',
    },
    {
      id: 3,
      name: '장유진',
      profile: '이미지 URL',
    },
    {
      id: 4,
      name: '장유진',
      profile: '이미지 URL',
    },
    {
      id: 5,
      name: '장유진',
      profile: '이미지 URL',
    },
  ],
};
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
      title: '어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구',
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

author.innerHTML = DUMMY_AUTHOR.list
  .map(a => {
    return `
    <div class="author-profile">
      <div class="author-profile__img">${a.profile}</div>
      <p class="author-profile__name">${a.name}</p>
    </div>
  `;
  })
  .join(' ');

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

  post2.innerHTML = DUMMY_POST.list
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
