'use strict';

import axios from "axios";

const postList = document.querySelector('.post-list--container');
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