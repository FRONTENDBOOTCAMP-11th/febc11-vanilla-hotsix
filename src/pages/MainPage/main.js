'use strict';

import axios from 'axios';

// 환경 변수
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

// 탑 버튼
const topBtnNode = document.querySelector('.btn-top');
// 탑 버튼 클릭 이벤트 (맨 위로 이동)
topBtnNode.addEventListener('click', () => {
  window.scrollTo(0, 0);
});

// (작성된 글 내용에서) HTML 태그 제거하는 함수
const htmlToText = content => {
  content = content.replace(/<[^>]*>/g, '');
  content = content.replace(/&nbsp;/g, ' ');
  return content;
};

// 요즘 뜨는 브런치 화면 렌더링 함수
const renderBrunch = async arr => {
  const brunchContainerNode = document.querySelector('.rank-brunch__container');

  let num = 1;
  for (const e of arr) {
    // 데이터가 입력되지 않은 경우 빈 문자열로 처리
    const title = e.title ? e.title : '';
    const authorName = e.user.name ? e.user.name : '';
    const content = e.content ? e.content : '';
    const brunchCoverImg = e.image ? apiUrl + e.image : '';
    // 화면 렌더링
    brunchContainerNode.innerHTML += `
          <a class="brunch" href="/src/pages/PostDetailPage/index.html?postId=${e._id}">  
            <p class="brunch__num">${num}</p>
            <div class="brunch__description">
              <p class="brunch__description__title">
                ${title}
              </p>
              <p class="brunch__description__author">
                <span class="by-style">by</span>${authorName}
              </p>
              <p class="brunch__description__paragraph">
                ${htmlToText(content)}
              </p>
            </div>
            <div class="brunch__cover">
                <img
                  class="book-info__cover--size"
                  src="${brunchCoverImg}"
                  alt="북커버 이미지"
                />
                <div class="book-info__title book-info__title--size">
                  <p
                    class="book-info__title__txt book-info__title__txt--lineheight"
                  >
                    ${title}
                  </p>
                  <p class="book-info__author book-info__author--size">
                    ${authorName}
                  </p>
                </div>
            </div>
          </a>  
        `;
    num++;
  }
};

// 게시물 받아오기 위한 서버 통신(요즘 뜨는 브런치)
const getRankBrunch = async () => {
  try {
    const response = await axios.get(apiUrl + '/posts?type=info', {
      headers: {
        'client-id': clientId,
      },
    });

    // 서버에서 넘어온 게시물 데이터
    const result = response.data;
    const arr = result.item;

    // 조회수(views) 순으로 정렬
    arr.sort((a, b) => {
      return b.views - a.views;
    });

    // 요즘 뜨는 브런치 화면 렌더링 함수 호출
    renderBrunch(arr);
  } catch (error) {
    console.log(error);
  }
};

// 요즘 뜨는 브런치 함수 호출
getRankBrunch();

// TOP 구독 작가 화면 렌더링
const renderSubscribeAuthor = async authorArr => {
  const topAuthorGridNode = document.getElementById('topAuthor');
  for (const e of authorArr) {
    // 데이터가 입력되지 않은 경우 빈 문자열로 처리
    const userImage = e.user.image ? apiUrl + e.user.image : '';
    const userName = e.user.name ? e.user.name : '';
    const userJob = e.user.extra.job ? e.user.extra.job : '';
    const userBio = e.user.extra.biography ? e.user.extra.biography : '';
    // 화면 렌더링
    topAuthorGridNode.innerHTML += `
      <a class="top-author__info" href="/src/pages/AuthorPage/index.html?userId=${e._id}">
        <div class="top-author__info__cover">
          <img
            class="top-author__info__cover__img"
            src="${userImage}"
            alt="작가 프로필 사진"
          />
        </div>
        <div class="top-author__info__profile">
          <h2 class="top-author__info__profile__name">${userName}</h2>
          <p class="top-author__info__profile__job">${userJob}</p>
        </div>
        <p class="top-author__info__introduce">
          ${userBio}
        </p>
      </a>
    `;
  }
};

// TOP 구독 작가 (회원 조회)
const getSubscribeAuthor = async () => {
  try {
    const response = await axios.get(apiUrl + '/users', {
      headers: {
        'client-id': clientId,
      },
    });

    // 서버에서 넘어온 회원 데이터
    let authorArr = response.data.item;

    // 조회수 순으로 정렬
    authorArr.sort((a, b) => {
      return b.postViews - a.postViews;
    });

    // 상위 4명만 자르기
    authorArr = authorArr.slice(0, 4);

    // TOP 구독 작가 화면 렌더링 함수 호출
    renderSubscribeAuthor(authorArr);
  } catch (error) {
    console.log(error);
  }
};

getSubscribeAuthor();
