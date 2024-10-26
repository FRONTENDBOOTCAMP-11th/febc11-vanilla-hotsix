document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const searchInput = document.querySelector('.search-input');
  const historyList = document.querySelector('.recent-section .history-list');

  // 로컬 스토리지에서 최근 검색어를 불러오고, 강 항목에 클릭 이벤트 리스너를 추가하는 함수 정의
  function loadRecentSearches() {
    historyList.innerHTML = ''; // 초기화
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    // 최근 검색어 표시
    searches.forEach(search => {
      const item = document.createElement('li');
      item.className = 'history-item';
      item.innerHTML = `${search} <button class='delete-btn'></button>`;

      // history-item 클릭 시 동작
      item.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn')) {
          // 삭제 버튼 클릭 시 삭제 기능 실행
          deleteSearch(search);
        } else {
          // history-item의 나머지 부분 클릭 시 검색어 제출
          searchInput.value = search;
          form.dispatchEvent(new Event('submit')); // 새로운 submit 이벤트 생성 후 form 요소에 강제로 발생시킴
        }
      });

      historyList.appendChild(item);
    });
  }

  // 최근 검색어 삭제 함수 정의
  function deleteSearch(searchText) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    searches = searches.filter(search => search !== searchText);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    loadRecentSearches();
  }

  // 페이지 로드 시 최근 검색어 표시
  loadRecentSearches();

  // 검색어 제출 시 처리
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const searchText = searchInput.value.trim();

    if (searchText !== '') {
      // 검색어를 로컬 스토리지에 추가
      let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
      if (!searches.includes(searchText)) {
        searches.unshift(searchText); // 최신 검색어가 위로 오게 추가
        if (searches.length > 5) searches.pop(); // 최근 검색어 5개 유지
        localStorage.setItem('recentSearches', JSON.stringify(searches));
      }

      // search-section 하단 경계선 지우기
      document.querySelector('.search-section').style.borderBottom = 'none';

      // 추천키워드, 최근검색어 섹션 숨기기
      document.querySelector('.recommend-section').style.display = 'none';
      document.querySelector('.recent-section').style.display = 'none';

      // 글/작가 섹션 생성 (이미 생성되어 있지 않은 경우에만)
      let navSection = document.querySelector('.nav-tab');
      if (!navSection) {
        navSection = document.createElement('section');
        navSection.className = 'nav-tab';
        document.querySelector('.search-section').after(navSection);
      }

      // 글/작가 탭 표시
      navSection.innerHTML = `
        <ul class="tabs">
          <li class="active">글</li>
          <li>작가</li>
        </ul>
      `;

      // 검색 정보(검색 건수 및 필터) 섹션 생성 (이미 생성되어 있지 않은 경우에만)
      let searchInfoSection = document.querySelector('.search-info');
      if (!searchInfoSection) {
        searchInfoSection = document.createElement('section');
        searchInfoSection.className = 'search-info';
        document.querySelector('.contents').appendChild(searchInfoSection);
      }

      // 검색 결과 섹션 생성 (이미 생성되어 있지 않은 경우에만)
      let articlesSection = document.querySelector('.articles');
      if (!articlesSection) {
        articlesSection = document.createElement('section');
        articlesSection.className = 'articles';
        document.querySelector('.contents').appendChild(articlesSection);
      }

      // 검색 결과 예시 데이터
      const results = [
        {
          title: '딸의 정부청사 출장에 부모님이 동행하는 이유',
          content:
            '분이 많네요, 감사드립니다! 직장인(신입)으로 올룡도에서 근무하며 얻게 된 직장생활에 도움 되는...',
          date: 'Apr 19. 2024',
          writer: '은설 aka 꿈꾸는 알',
        },

        {
          title: '딸의 정부청사 출장에 부모님이 동행하는 이유',
          content:
            '분이 많네요, 감사드립니다! 직장인(신입)으로 올룡도에서 근무하며 얻게 된 직장생활에 도움 되는...',
          date: 'Apr 19. 2024',
          writer: '은설 aka 꿈꾸는 알',
        },
      ];

      // 검색 결과 필터링
      const filteredResults = results.filter(
        result =>
          result.title.includes(searchText) ||
          result.content.includes(searchText),
      );

      // 검색 정보 표시
      searchInfoSection.innerHTML = ''; // 초기화
      searchInfoSection.innerHTML = `<span>글 검색 결과 ${filteredResults.length}건</span>`;

      // 검색 결과 표시
      articlesSection.innerHTML = ''; // 초기화
      filteredResults.forEach(result => {
        const article = document.createElement('article');
        article.innerHTML = `
          <div class="article-title">
            <h2>${result.title}</h2>
          </div>
          <div class="article-contents">
            <div class="article-letters">
              <p>${result.content}</p>
              <footer>
                <span class="article-date">${result.date}</span>
                <span class="article-writer">${result.writer}</span>
              </footer>
            </div>
            <div class="image-placeholder"></div>
          </div>
        `;
        articlesSection.appendChild(article);
      });

      // 검색창에 close-btn 추가
      let closeButton = document.querySelector('.close-btn');
      if (!closeButton) {
        closeButton = document.createElement('button');
        closeButton.className = 'close-btn';
        document.querySelector('.search-section').appendChild(closeButton);

        // close-btn 클릭 이벤트
        closeButton.addEventListener('click', function () {
          // 검색어 초기화 및 초기 화면 복원
          searchInput.value = '';
          document.querySelector('.search-section').style.borderBottom =
            '1px solid var(--grey_50)';
          document.querySelector('.recommend-section').style.display = 'flex';
          document.querySelector('.recent-section').style.display = 'block';
          navSection.remove();
          searchInfoSection.remove();
          articlesSection.innerHTML = '';
          closeButton.remove();
          loadRecentSearches(); // 최근 검색어 불러오기
        });
      }
    }
  });
});
