'use strict';

import axios from 'axios';
import getImg from '../../api/getImg';

// 환경 변수 가져오기
const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;
console.log(clientId)

// 받아올 유저정보
const userName = document.querySelector('.author-info__name');
const userRole = document.querySelector('.author-info__role');
const userImg = document.querySelector('.author-info__avatar');

// 유저 정보 받아오기 통신
const getUserInfo = async () => {
  try {
    const res = await axios.get(apiUrl + '/users/1', {
      headers: {
        'client-id': clientId,
      },
    });

    console.log(res.data);

    // 유저정보 넣기
    userName.innerHTML = res.data.item.name;
    userRole.innerHTML = res.data.item.type;

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

const getUserPost = async () => {
  try {
    const res = await axios.get(apiUrl + `/posts/users/1?type=info`, {
      headers: {
        'client-id': clientId,
      },
    });

    console.log(res.data.item);

    // 게시글 렌더링 하기
    const posts = res.data?.item;
    console.log(posts);
    if (posts) {
      postList.innerHTML = posts
        .map(post => {
          const [datePart, timePart] = post.updatedAt.split(' ');
          const [year, month, day] = datePart.split('.');
          const dateObj = new Date(`${year}-${month}-${day}`);

          const formattedDate = `${monthNames[dateObj.getMonth()]} ${day}. ${year}`;

          return `
          <li class="post">
            <p class="post-category">${post.type}</p>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-content">${post.content}</p>
            <div class="post-status-container">
              <p class="post-status">댓글${post.repliesCount}</p>
              <p class="post-status">${formattedDate}</p>
            </div>
          </li>
        `;
        })
        .join('');
    } else {
      console.error('Posts data is unavailable or not in the expected format');
      postList.innerHTML = '<p>게시글을 불러오는 데 실패했습니다.</p>';
    }
  } catch (err) {
    console.log(err);
  }
};
getUserPost();