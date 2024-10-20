'use strict';

import axios from 'axios';
import getImg from '../../api/getImg'

// 받아올 유저정보
const userName = document.querySelector('.author-info__name');
const userRole = document.querySelector('.author-info__role');
const userImg = document.querySelector('.author-info__avatar');

// 유저 정보 받아오기 통신
const getUserInfo = async () => {
  try {
    const res = await axios.get('https://11.fesp.shop/users/2', {
      headers: {
        'client-id': '00-sample',
      },
    });

    console.log(res.data);
    
    // 유저정보 넣기
    userName.innerHTML = res.data.item.name;
    userRole.innerHTML = res.data.item.extra.job;

    // 이미지 src 가져오기 (비동기 처리 대기)
    const ImgSrc = await getImg(res.data.item.image);
    userImg.src = ImgSrc;

  } catch (err) {
    console.error(err);
  }
};
getUserInfo();

// 게시물 리스트 공간
const postList = document.querySelector('.post-list--container');
// 게시글 더미 데이터
const DUMMY_POST = {
  list: [
    {
      category: '취준은 처음이라',
      title: '[취업특강] 노션 포트폴리오 만들기',
      content:
        'with 노슈니, 슈크림 마을, 마포청년나루 | 취업 준비를 위해 반드시 필요한 것 세 가지. 자기소개서, 이력서, 포트폴리오. 그중에서 최고로 중요한 것은 나! 그중에서 최고로 중요한 것은 나! 그중에서 최고로 중요한 것은 나!',
      commentCount: 0,
      date: new Date(2024, 7, 2),
    },
    {
      category: '취준은 처음이라',
      title: '[취업특강] 노션 포트폴리오 만들기',
      content:
        'with 노슈니, 슈크림 마을, 마포청년나루 | 취업 준비를 위해 반드시 필요한 것 세 가지. 자기소개서, 이력서, 포트폴리오. 그중에서 최고로 중요한 것은 나! 그중에서 최고로 중요한 것은 나! 그중에서 최고로 중요한 것은 나!',
      commentCount: 0,
      date: new Date(2024, 7, 2),
    },
    {
      category: '취준은 처음이라',
      title: '[취업특강] 노션 포트폴리오 만들기',
      content:
        'with 노슈니, 슈크림 마을, 마포청년나루 | 취업 준비를 위해 반드시 필요한 것 세 가지. 자기소개서, 이력서, 포트폴리오. 그중에서 최고로 중요한 것은 나! 그중에서 최고로 중요한 것은 나! 그중에서 최고로 중요한 것은 나!',
      commentCount: 0,
      date: new Date(2024, 7, 2),
    },
    {
      category: '취준은 처음이라',
      title: '[취업특강] 노션 포트폴리오 만들기',
      content:
        'with 노슈니, 슈크림 마을, 마포청년나루 | 취업 준비를 위해 반드시 필요한 것 세 가지. 자기소개서, 이력서, 포트폴리오. 그중에서 최고로 중요한 것은 나! 그중에서 최고로 중요한 것은 나! 그중에서 최고로 중요한 것은 나!',
      commentCount: 0,
      date: new Date(2024, 7, 2),
    },
  ],
};

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

// 게시글 렌더링 하기
postList.innerHTML = DUMMY_POST.list
  .map(post => {
    const year = post.date.getFullYear(); // 연도 추출
    const month = monthNames[post.date.getMonth()]; // 월 이름 추출
    const day = post.date.getDate(); // 일 추출
    return `
  <li class="post">
    <p class="post-category">${post.category}</p>
    <h3 class="post-title">${post.title}</h3>
    <p class="post-content">${post.content}</p>
    <div class="post-status-container">
      <p class="post-status">댓글${post.commentCount}</p>
      <p class="post-status">${month} ${day}. ${year}</p>
    </div>
  </li>
`;
  })
  .join('');
