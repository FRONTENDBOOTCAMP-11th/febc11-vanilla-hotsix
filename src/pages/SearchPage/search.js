// class SearchPage {
//   constructor() {
//     this.form = document.querySelector('form');
//     this.searchInput = document.querySelector('.search-input');
//     this.historyList = document.querySelector('.recent-section .history-list');
//     this.recommendSection = document.querySelector('.recommend-section');
//     this.recentSection = document.querySelector('.recent-section');
//     this.searchSection = document.querySelector('.search-section');
//     this.contents = document.querySelector('.contents');

//     // 샘플 데이터
//     this.articles = [
//       {
//         title: '딸의 정부청사 출장에 부모님이 동행하는 이유',
//         content:
//           '감사드립니다! 직장인(신입)으로 울릉도에서 근무하며 얻게 된 직장생활에 도움 되는 꿀팁...',
//         date: 'Apr 19. 2024',
//         writer: '은설 aka 꿈꾸는 알',
//       },

//       {
//         title: `덴마크의 '꿀 하트' 쿠키, Honninghjerter`,
//         content:
//           '오늘날까지 같은 주소에서 영업 중이다. 덴마크의 여왕 잉그리드도 이 꿀케이크 제과점을 자주 찾는다...',
//         date: 'Nov 16. 2023',
//         writer: 'Windsbird',
//       },
//     ];
//     this.authors = [
//       {
//         nickname: '꿀아빠',
//         description: '두아들 아빠 기록남기기 좋아하는 아빠입니다',
//         tags: ['여행'],
//       },
//       {
//         nickname: '꿀별',
//         description:
//           '글 쓰고 디자인 하는 사람. 마음이 담긴 일을 해요. 하는 일에 마음을 담아요.',
//         tags: [
//           '콘텐츠',
//           '만화',
//           '여행',
//           '크리에이터',
//           '어쩌구',
//           '저쩌구',
//           '이러쿵',
//         ],
//       },
//     ];

//     this.activeTab = 'articles';
//     this.init();
//   }

//   // 초기화
//   init() {
//     this.form.addEventListener('submit', e => this.handleSearchSubmit(e));
//     this.loadRecentSearches();
//   }

//   handleSearchSubmit(e) {
//     e.preventDefault();
//     const searchText = this.searchInput.value.trim();
//     if (!searchText) return;

//     this.addSearchToLocalStorage(searchText);
//     this.updateViewForSearch();
//     this.addCloseButton();

//     // 검색어에 따른 글과 작가 목록 필터링
//     this.filteredArticles = this.getFilteredArticles(searchText);
//     this.filteredAuthors = this.authors.filter(author =>
//       author.nickname.includes(searchText),
//     );

//     // 현재 활성화된 탭에 따라 결과를 표시
//     if (this.activeTab === 'articles') {
//       this.displayArticleResults();
//     } else {
//       this.displayAuthorResults();
//     }
//     this.createNavTab();
//   }

//   addSearchToLocalStorage(searchText) {
//     let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
//     if (!searches.includes(searchText)) {
//       searches.unshift(searchText);
//       if (searches.length > 5) searches.pop();
//       localStorage.setItem('recentSearches', JSON.stringify(searches));
//     }
//   }

//   updateViewForSearch() {
//     this.searchSection.style.borderBottom = 'none';
//     this.recommendSection.style.display = 'none';
//     this.recentSection.style.display = 'none';
//   }

//   createNavTab() {
//     // nav-tab 중복 생성 방지
//     if (document.querySelector('.nav-tab')) return;

//     const navTab = document.createElement('section');
//     navTab.className = 'nav-tab';
//     navTab.innerHTML = `
//       <ul class="tabs">
//         <li class="${this.activeTab === 'articles' ? 'active' : ''}" data-type="articles">글</li>
//         <li class="${this.activeTab === 'authors' ? 'active' : ''}" data-type="authors">작가</li>
//       </ul>
//     `;
//     this.searchSection.after(navTab);

//     // 탭 클릭 이벤트
//     navTab.addEventListener('click', e => this.handleTabClick(e));
//   }

//   handleTabClick(e) {
//     const clickedTab = e.target;
//     const type = clickedTab.getAttribute('data-type');

//     // 활성화된 탭 상태 업데이트
//     this.activeTab = type;

//     const tabs = document.querySelectorAll('.tabs li');
//     tabs.forEach(tab => tab.classList.remove('active'));
//     clickedTab.classList.add('active');

//     // 현재 활성 탭에 따라 표시할 목록 결정
//     if (this.activeTab === 'articles') {
//       this.displayArticleResults();
//     } else {
//       this.displayAuthorResults();
//     }
//   }

//   // 검색 결과 표시
//   displayArticleResults() {
//     this.contents.innerHTML = ''; // 콘텐츠 초기화
//     if (this.filteredArticles.length === 0) {
//       this.displayNoResults();
//     } else {
//       const articlesSection = this.createArticlesSection(this.filteredArticles);
//       this.contents.append(articlesSection);
//       this.updateSearchInfo(this.filteredArticles.length, '글');
//     }
//   }

//   displayAuthorResults() {
//     this.contents.innerHTML = ''; // 콘텐츠 초기화
//     if (this.filteredAuthors.length === 0) {
//       this.displayNoResults();
//     } else {
//       const authorsSection = this.createAuthorsSection(this.filteredAuthors);
//       this.contents.append(authorsSection);
//       this.updateSearchInfo(this.filteredAuthors.length, '작가');
//     }
//   }

//   displayNoResults() {
//     const noResultDiv = document.createElement('div');
//     noResultDiv.className = 'notify-noresult';
//     noResultDiv.innerHTML = `
//         <img src="/public/assets/images/logo-b.svg" alt="No Results" />
//         <p>검색 결과가 없습니다.</p>
//     `;
//     this.contents.append(noResultDiv);
//   }

//   updateSearchInfo(count, type) {
//     const searchInfo =
//       document.querySelector('.search-info') ||
//       document.createElement('section');
//     searchInfo.className = 'search-info';
//     searchInfo.innerHTML = `<span>${type} 검색 결과 ${count}건</span>`;
//     if (!document.contains(searchInfo)) this.contents.prepend(searchInfo);
//   }

//   getFilteredArticles(searchText) {
//     return this.articles.filter(
//       article =>
//         article.title.includes(searchText) ||
//         article.content.includes(searchText),
//     );
//   }

//   createArticlesSection(results) {
//     const articlesSection = document.createElement('section');
//     articlesSection.className = 'articles';
//     results.forEach(result => {
//       const article = document.createElement('article');
//       article.innerHTML = `
//         <div class="article-title">
//           <h2>${this.highlightKeyword(result.title, this.searchInput.value)}</h2>
//         </div>
//         <div class="article-contents">
//           <div class="article-letters">
//             <p>${this.highlightKeyword(result.content, this.searchInput.value)}</p>
//             <footer>
//               <span class="article-date">${result.date}</span>
//               <span class="article-writer">by ${result.writer}</span>
//             </footer>
//           </div>
//           <div class="image-placeholder"></div>
//         </div>
//       `;
//       articlesSection.appendChild(article);
//     });
//     return articlesSection;
//   }

//   createAuthorsSection(results) {
//     const authorsSection = document.createElement('section');
//     authorsSection.className = 'authors';

//     results.forEach(author => {
//       const authorDiv = document.createElement('div');
//       authorDiv.className = 'author';
//       authorDiv.innerHTML = `
//         <div class="author-contents">
//           <div class="author-image"></div>
//           <div class="author-letters">
//             <div class="author-nickname">${this.highlightKeyword(author.nickname, this.searchInput.value)}</div>
//             <div class="author-description">${author.description}</div>
//           </div>
//         </div>
//         <ul class="tags">${author.tags.map(tag => `<li class="tag">${tag}</li>`).join('')}</ul>
//       `;
//       authorsSection.appendChild(authorDiv);
//     });

//     return authorsSection;
//   }

//   highlightKeyword(text, keyword) {
//     return text.replace(
//       new RegExp(`(${keyword})`, 'gi'),
//       '<span class="keyword">$1</span>',
//     );
//   }

//   // 검색창의 닫기 버튼
//   addCloseButton() {
//     let closeButton = document.querySelector('.close-btn');
//     if (!closeButton) {
//       closeButton = document.createElement('button');
//       closeButton.className = 'close-btn';
//       this.searchSection.appendChild(closeButton);
//       closeButton.addEventListener('click', () => this.resetSearch());
//     }
//   }

//   resetSearch() {
//     this.searchInput.value = '';
//     this.searchSection.style.borderBottom = '1px solid var(--grey_50)';
//     this.recommendSection.style.display = 'flex';
//     this.recentSection.style.display = 'flex';

//     document
//       .querySelectorAll(
//         '.nav-tab, .search-info, .articles, .authors, .close-btn, .notify-noresult',
//       )
//       .forEach(el => el.remove());
//     this.activeTab = 'articles';
//     this.loadRecentSearches();
//   }

//   // 최근검색어 관리
//   loadRecentSearches() {
//     this.historyList.innerHTML = '';
//     const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
//     searches.forEach(search => this.createHistoryItem(search));
//   }

//   createHistoryItem(search) {
//     const item = document.createElement('li');
//     item.className = 'history-item';
//     item.innerHTML = `<span>${search}</span> <button class="delete-btn"></button>`;
//     item.addEventListener('click', e => this.handleHistoryClick(e, search));
//     this.historyList.appendChild(item);
//   }

//   handleHistoryClick(e, search) {
//     if (e.target.classList.contains('delete-btn')) {
//       this.deleteHistory(search);
//     } else {
//       this.searchInput.value = search;
//       this.form.dispatchEvent(new Event('submit'));
//     }
//   }

//   deleteHistory(searchText) {
//     let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
//     searches = searches.filter(search => search !== searchText);
//     localStorage.setItem('recentSearches', JSON.stringify(searches));
//     this.loadRecentSearches();
//   }
// }

// // 초기화
// document.addEventListener('DOMContentLoaded', () => new SearchPage());

class SearchPage {
  constructor() {
    this.form = document.querySelector('form');
    this.searchInput = document.querySelector('.search-input');
    this.historyList = document.querySelector('.recent-section .history-list');
    this.recommendSection = document.querySelector('.recommend-section');
    this.recentSection = document.querySelector('.recent-section');
    this.searchSection = document.querySelector('.search-section');
    this.contents = document.querySelector('.contents');

    // 샘플 데이터
    this.articles = [
      {
        title: '딸의 정부청사 출장에 부모님이 동행하는 이유',
        content:
          '감사드립니다! 직장인(신입)으로 울릉도에서 근무하며 얻게 된 직장생활에 도움 되는 꿀팁...',
        date: 'Apr 19. 2024',
        writer: '은설 aka 꿈꾸는 알',
      },

      {
        title: `덴마크의 '꿀 하트' 쿠키, Honninghjerter`,
        content:
          '오늘날까지 같은 주소에서 영업 중이다. 덴마크의 여왕 잉그리드도 이 꿀케이크 제과점을 자주 찾는다...',
        date: 'Nov 16. 2023',
        writer: 'Windsbird',
      },
    ];
    this.authors = [
      {
        nickname: '꿀아빠',
        description: '두아들 아빠 기록남기기 좋아하는 아빠입니다',
        tags: ['여행'],
      },
      {
        nickname: '꿀별',
        description:
          '글 쓰고 디자인 하는 사람. 마음이 담긴 일을 해요. 하는 일에 마음을 담아요.',
        tags: [
          '콘텐츠',
          '만화',
          '여행',
          '크리에이터',
          '어쩌구',
          '저쩌구',
          '이러쿵',
        ],
      },
    ];

    this.activeTab = 'articles';
    this.init();
  }

  // 초기화
  init() {
    this.form.addEventListener('submit', e => this.handleSearchSubmit(e));
    this.loadRecentSearches();
  }

  handleSearchSubmit(e) {
    e.preventDefault();
    const searchText = this.searchInput.value.trim();
    if (!searchText) return;

    this.addSearchToLocalStorage(searchText);
    this.updateViewForSearch();
    this.addCloseButton();

    // 검색어에 따른 글과 작가 목록 필터링
    this.filteredArticles = this.getFilteredArticles(searchText);
    this.filteredAuthors = this.getFilteredAuthors(searchText);

    // 현재 활성화된 탭에 따라 결과를 표시
    if (this.activeTab === 'articles') {
      this.displayArticleResults();
    } else {
      this.displayAuthorResults();
    }
    this.createNavTab();
  }

  handleTabClick(e) {
    const clickedTab = e.target;
    const type = clickedTab.getAttribute('data-type');
    this.activeTab = type;

    const tabs = document.querySelectorAll('.tabs li');
    tabs.forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');

    if (this.activeTab === 'articles') {
      this.displayArticleResults();
    } else {
      this.displayAuthorResults();
    }
  }

  // 데이터 처리 관련 메서드
  addSearchToLocalStorage(searchText) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!searches.includes(searchText)) {
      searches.unshift(searchText);
      if (searches.length > 5) searches.pop();
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    }
  }

  loadRecentSearches() {
    this.historyList.innerHTML = '';
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    searches.forEach(search => this.createHistoryItem(search));
  }

  getFilteredArticles(searchText) {
    return this.articles.filter(
      article =>
        article.title.includes(searchText) ||
        article.content.includes(searchText),
    );
  }

  getFilteredAuthors(searchText) {
    return this.authors.filter(author => author.nickname.includes(searchText));
  }

  // 화면 갱신 관련 메서드들
  updateViewForSearch() {
    this.searchSection.style.borderBottom = 'none';
    this.recommendSection.style.display = 'none';
    this.recentSection.style.display = 'none';
  }

  createNavTab() {
    if (document.querySelector('.nav-tab')) return;
    const navTab = document.createElement('section');
    navTab.className = 'nav-tab';
    navTab.innerHTML = `
      <ul class="tabs">
        <li class="${this.activeTab === 'articles' ? 'active' : ''}" data-type="articles">글</li>
        <li class="${this.activeTab === 'authors' ? 'active' : ''}" data-type="authors">작가</li>
      </ul>
    `;
    this.searchSection.after(navTab);
    navTab.addEventListener('click', e => this.handleTabClick(e));
  }

  displayArticleResults() {
    this.contents.innerHTML = '';
    if (this.filteredArticles.length === 0) {
      this.displayNoResults();
    } else {
      const articlesSection = this.createArticlesSection(this.filteredArticles);
      this.contents.append(articlesSection);
      this.updateSearchInfo(this.filteredArticles.length, '글');
    }
  }

  displayAuthorResults() {
    this.contents.innerHTML = '';
    if (this.filteredAuthors.length === 0) {
      this.displayNoResults();
    } else {
      const authorsSection = this.createAuthorsSection(this.filteredAuthors);
      this.contents.append(authorsSection);
      this.updateSearchInfo(this.filteredAuthors.length, '작가');
    }
  }

  displayNoResults() {
    const noResultDiv = document.createElement('div');
    noResultDiv.className = 'notify-noresult';
    noResultDiv.innerHTML = `
        <img src="/public/assets/images/logo-b.svg" alt="No Results" />
        <p>검색 결과가 없습니다.</p>
    `;
    this.contents.append(noResultDiv);
  }

  updateSearchInfo(count, type) {
    const searchInfo =
      document.querySelector('.search-info') ||
      document.createElement('section');
    searchInfo.className = 'search-info';
    searchInfo.innerHTML = `<span>${type} 검색 결과 ${count}건</span>`;
    if (!document.contains(searchInfo)) this.contents.prepend(searchInfo);
  }

  createArticlesSection(results) {
    const articlesSection = document.createElement('section');
    articlesSection.className = 'articles';
    results.forEach(result => {
      const article = document.createElement('article');
      article.innerHTML = `
        <div class="article-title">
          <h2>${this.highlightKeyword(result.title, this.searchInput.value)}</h2>
        </div>
        <div class="article-contents">
          <div class="article-letters">
            <p>${this.highlightKeyword(result.content, this.searchInput.value)}</p>
            <footer>
              <span class="article-date">${result.date}</span>
              <span class="article-writer">by ${result.writer}</span>
            </footer>
          </div>
          <div class="image-placeholder"></div>
        </div>
      `;
      articlesSection.appendChild(article);
    });
    return articlesSection;
  }

  createAuthorsSection(results) {
    const authorsSection = document.createElement('section');
    authorsSection.className = 'authors';
    results.forEach(author => {
      const authorDiv = document.createElement('div');
      authorDiv.className = 'author';
      authorDiv.innerHTML = `
        <div class="author-contents">
          <div class="author-image"></div>
          <div class="author-letters">
            <div class="author-nickname">${this.highlightKeyword(author.nickname, this.searchInput.value)}</div>
            <div class="author-description">${author.description}</div>
          </div>
        </div>
        <ul class="tags">${author.tags.map(tag => `<li class="tag">${tag}</li>`).join('')}</ul>
      `;
      authorsSection.appendChild(authorDiv);
    });
    return authorsSection;
  }

  // 헬퍼 메서드
  highlightKeyword(text, keyword) {
    return text.replace(
      new RegExp(`(${keyword})`, 'gi'),
      '<span class="keyword">$1</span>',
    );
  }

  addCloseButton() {
    let closeButton = document.querySelector('.close-btn');
    if (!closeButton) {
      closeButton = document.createElement('button');
      closeButton.className = 'close-btn';
      this.searchSection.appendChild(closeButton);
      closeButton.addEventListener('click', () => this.resetSearch());
    }
  }

  resetSearch() {
    this.searchInput.value = '';
    this.searchSection.style.borderBottom = '1px solid var(--grey_50)';
    this.recommendSection.style.display = 'flex';
    this.recentSection.style.display = 'flex';

    document
      .querySelectorAll(
        '.nav-tab, .search-info, .articles, .authors, .close-btn, .notify-noresult',
      )
      .forEach(el => el.remove());
    this.activeTab = 'articles';
    this.loadRecentSearches();
  }

  createHistoryItem(search) {
    const item = document.createElement('li');
    item.className = 'history-item';
    item.innerHTML = `<span>${search}</span> <button class="delete-btn"></button>`;
    item.addEventListener('click', e => this.handleHistoryClick(e, search));
    this.historyList.appendChild(item);
  }

  handleHistoryClick(e, search) {
    if (e.target.classList.contains('delete-btn')) {
      this.deleteHistory(search);
    } else {
      this.searchInput.value = search;
      this.form.dispatchEvent(new Event('submit'));
    }
  }

  deleteHistory(searchText) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    searches = searches.filter(search => search !== searchText);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    this.loadRecentSearches();
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => new SearchPage());
