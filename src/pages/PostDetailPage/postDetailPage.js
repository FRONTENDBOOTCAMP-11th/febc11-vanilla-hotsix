'use strict';

const subscribeBtn = document.querySelector('.author-info__subscribe-button');

// 구독 버튼을 누르면 버튼 텍스트와 배경색이 바뀌는 함수
subscribeBtn.addEventListener('click', () => {
  subscribeBtn.classList.toggle('subscribed');

  if (subscribeBtn.classList.contains('subscribed')) {
    subscribeBtn.textContent = 'v 구독중';
  } else {
    subscribeBtn.textContent = '+ 구독';
  }
});

const DUMMY_POST = {
  _id: 1,
  type: 'community',
  title: '우여곡절 끝에 도착한 첫 번째 목적지',
  subTitle: 'Val carlos',
  user: {
    _id: 0,
    name: 'Sunny',
    job: '회사원',
    introduction:
      '12년 차 국내 항공사 승무원의 겨울 산티아고 순례길 이야기 연재 중. 커피 한 잔을 벗 삼아 편하게 읽을 수 있는 글쓰기에 꽤나 진심인 편입니다. 후후.',
    subscribers: 108,
  },
  content:
    '  그래 지난 화를 요약해 보면 생장에 도착한 나는 도착 당일 바로 첫여정을 시작하기로 마음먹었고 추천받은 목적지인 Val carlos까지 구글맵으로 걸어서 2시간 30분 거리를 확인했다. 그러나 걸어도 걸어도 줄지 않는 시간과 거리에 괴로워했었지.  오후 5시 36분. 세상에 인터넷에서 사진으로만 보다가 직접 내 눈으로 처음 목격한 정식적인(?) 까미노 표식! 아주 반갑기 그지없었다. 왠지 목적지가 가까워진 것만 같은 느낌적인 느낌! 하지만 구글맵의 내 위치는 전혀 그렇지 못했다.',
  createdAt: new Date(24, 7, 23),
  tag: [
    '산티아고순례길',
    '트레킹',
    '테스트',
    '테스트',
    '테스트',
    '테스트',
    '테스트',
    '테스트',
    '테스트',
    '테스트',
    '테스트',
  ],
  replies: [
    {
      _id: 1,
      user_id: 2,
      user: {
        id: 2,
        name: '이상옥',
        image: '...',
      },
      content:
        '유럽은 국경이 희미해서 좋아요. 옛추억에 점심은 프랑스에서 저녁은 스위스에서 먹던 기억이 나네요. 홀로 산티아고 길을, 마치 행군 하듯이 걷는 그 고통이 기쁨으로 충만하길 바라며 읽고 있습니다. ^^',
      createdAt: new Date(2024, 7, 24),
    },
    {
      _id: 2,
      user_id: 3,
      user: {
        id: 3,
        name: 'jungsin',
        image: '...',
      },
      content: '화이팅!^^',
      createdAt: new Date(2024, 7, 25),
    },
  ],
  likes: 82,
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

const titleDivNode = document.querySelector('.header__title');
const subTitleSpanNode = document.querySelector('.header__subtitle');
const authorSpanNode = document.querySelector('.info__author');
const timeSpanNode = document.querySelector('.info__time');
// const contentsNode = document.querySelector('.main__article p');
const tagsSectionNode = document.querySelector('.main__tags');
const commentsNode = document.querySelector('.comments');

// header 부분 출력하는 함수
function printHeader() {
  const year = DUMMY_POST.createdAt.getFullYear();
  const month = monthNames[DUMMY_POST.createdAt.getMonth() - 1];
  const day = DUMMY_POST.createdAt.getDate();

  titleDivNode.innerHTML = DUMMY_POST.title;
  subTitleSpanNode.innerHTML = DUMMY_POST.subTitle;
  authorSpanNode.innerHTML = DUMMY_POST.user.name;
  timeSpanNode.innerHTML = `${month} ${day}. ${year}`;
}

function printTags() {
  DUMMY_POST.tag.forEach(tag => {
    let span = document.createElement('span');
    span.className = 'tag';
    span.innerHTML = tag;
    tagsSectionNode.appendChild(span);
  });
}

// 댓글은 추가될 때마다 태그를 생성해야 하기에 createElement로 작성
function printComments() {
  DUMMY_POST.replies.forEach(comment => {
    console.log(comment);
    const year = comment.createdAt.getFullYear();
    const month = monthNames[comment.createdAt.getMonth() - 1];
    const day = comment.createdAt.getDate();

    let span = document.createElement('span');
    span.innerText = comment.user.name;
    let menuBtn = document.createElement('button');
    menuBtn.setAttribute('class', 'kebab-menu');
    let nameDiv = document.createElement('div');
    nameDiv.setAttribute('class', 'name');
    nameDiv.appendChild(span);
    nameDiv.appendChild(menuBtn);

    let timeSpan = document.createElement('span');
    timeSpan.setAttribute('class', 'time');
    timeSpan.innerText = `${month} ${day}. ${year}`;
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

    let profileImg = document.createElement('div');
    profileImg.setAttribute('class', 'profile-img');
    let commentProfile = document.createElement('section');
    commentProfile.setAttribute('class', 'comment__profile');
    commentProfile.appendChild(profileImg);

    let commentNode = document.createElement('div');
    commentNode.setAttribute('class', 'comment');
    commentNode.appendChild(commentProfile);
    commentNode.appendChild(commentContents);

    commentsNode.appendChild(commentNode);
  });
}

// 작가란 화면을 출력하는 함수
function printAuthor() {
  let authorNickname = document.querySelector('.nickname');
  let authorJob = document.querySelector('.job');
  let authorInfo = document.querySelector('.author-info__contents');
  let authorSubs = document.querySelector('#subscriber');

  authorNickname.innerHTML = DUMMY_POST.user.name;
  authorJob.innerHTML = DUMMY_POST.user.job;
  authorInfo.innerHTML = DUMMY_POST.user.introduction;
  authorSubs.innerHTML = DUMMY_POST.user.subscribers;
}

// 게시글이 추가될 때마다 element를 생성해야 하는 게 아니니까, createElement로 하지 않고, innerHTML로 구현
window.onload = function () {
  printHeader();
  printTags();
  printComments();
  printAuthor();
};
