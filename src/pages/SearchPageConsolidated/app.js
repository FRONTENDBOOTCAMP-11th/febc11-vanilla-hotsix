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
          '분이 많네요, 감사드립니다! 직장인(신입)으로 올룡도에서 근무하며 얻게 된 직장생활에 도움 되는...',
        date: 'Apr 19. 2024',
        writer: '은설 aka 꿈꾸는 알',
      },
    ];
    this.authors = [
      {
        nickname: '꿀아빠',
        description: '두아들 아빠 기록남기기 좋아하는 아빠 고민하는 아빠입니다',
        tags: ['tag1', 'tag2', 'tag3'],
      },
      {
        nickname: '별아빠',
        description: '자녀들과 함께하는 순간을 기록하는 아빠입니다',
        tags: ['tagA', 'tagB', 'tagC'],
      },
    ];

    this.init();
  }

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
    this.displayArticleResults(searchText);
    this.addCloseButton();
  }

  addSearchToLocalStorage(searchText) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!searches.includes(searchText)) {
      searches.unshift(searchText);
      if (searches.length > 5) searches.pop();
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    }
  }

  updateViewForSearch() {
    this.searchSection.style.borderBottom = 'none';
    this.recommendSection.style.display = 'none';
    this.recentSection.style.display = 'none';
  }

  displayArticleResults(searchText) {
    const existingNavTab = document.querySelector('.nav-tab');
    if (existingNavTab) existingNavTab.remove();

    document
      .querySelectorAll('.search-info, .articles, .authors')
      .forEach(el => el.remove());

    const filteredResults = this.getFilteredArticles(searchText);

    const navTab = this.createNavTab();
    const searchInfo = this.createSearchInfo(filteredResults.length, '글');
    const articlesSection = this.createArticlesSection(filteredResults);

    this.contents.append(searchInfo, articlesSection);
    this.searchSection.after(navTab);

    navTab.addEventListener('click', e => this.handleTabClick(e, searchText));
  }

  getFilteredArticles(searchText) {
    return this.articles.filter(
      article =>
        article.title.includes(searchText) ||
        article.content.includes(searchText),
    );
  }

  createNavTab() {
    const navTab = document.createElement('section');
    navTab.className = 'nav-tab';
    navTab.innerHTML = `
      <ul class="tabs">
        <li class="active">글</li>
        <li>작가</li>
      </ul>
    `;
    return navTab;
  }

  createSearchInfo(count, type) {
    const searchInfo = document.createElement('section');
    searchInfo.className = 'search-info';
    searchInfo.innerHTML = `<span>${type} 검색 결과 ${count}건</span>`;
    return searchInfo;
  }

  createArticlesSection(results) {
    const articlesSection = document.createElement('section');
    articlesSection.className = 'articles';
    results.forEach(result => {
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
    this.recentSection.style.display = 'block';
    document
      .querySelectorAll(
        '.nav-tab, .search-info, .articles, .authors, .close-btn',
      )
      .forEach(el => el.remove());
    this.loadRecentSearches();
  }

  handleTabClick(e, searchText) {
    const clickedTab = e.target;
    const tabs = document.querySelectorAll('.tabs li');

    tabs.forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');

    const searchInfo = document.querySelector('.search-info');
    const isAuthorTab = clickedTab.innerText === '작가';

    if (isAuthorTab) {
      this.toggleAuthorsSection(searchText, true);
      const filteredAuthors = this.authors.filter(author =>
        author.nickname.includes(searchText),
      );
      searchInfo.innerHTML = `<span>작가 검색 결과 ${filteredAuthors.length}건</span>`;
    } else {
      this.toggleAuthorsSection(searchText, false);
      const filteredArticles = this.getFilteredArticles(searchText);
      searchInfo.innerHTML = `<span>글 검색 결과 ${filteredArticles.length}건</span>`;
    }
  }

  toggleAuthorsSection(searchText, showAuthors) {
    const authorsSection = document.querySelector('.authors');
    const articlesSection = document.querySelector('.articles');

    if (showAuthors) {
      articlesSection.style.display = 'none';
      if (!authorsSection) this.createAuthorsSection(searchText);
      else authorsSection.style.display = 'flex';
    } else {
      if (authorsSection) authorsSection.style.display = 'none';
      articlesSection.style.display = 'flex';
    }
  }

  createAuthorsSection(searchText) {
    const authorsSection = document.createElement('section');
    authorsSection.className = 'authors';

    const filteredAuthors = this.authors.filter(author =>
      author.nickname.includes(searchText),
    );
    filteredAuthors.forEach(author => {
      const authorDiv = document.createElement('div');
      authorDiv.className = 'author';
      authorDiv.innerHTML = `
        <div class="author-contents">
          <div class="author-image"></div>
          <div class="author-letters">
            <div class="author-nickname">${this.highlightKeyword(author.nickname, searchText)}</div>
            <div class="author-description">${author.description}</div>
          </div>
        </div>
        <ul class="tags">${author.tags.map(tag => `<li class="tag">${tag}</li>`).join('')}</ul>
      `;
      authorsSection.appendChild(authorDiv);
    });

    this.contents.appendChild(authorsSection);
  }

  highlightKeyword(text, keyword) {
    return text.replace(
      new RegExp(`(${keyword})`, 'gi'),
      '<span class="keyword">$1</span>',
    );
  }

  createHistoryItem(search) {
    const item = document.createElement('li');
    item.className = 'history-item';
    item.innerHTML = `<span>${search}</span> <button class="delete-btn"></button>`;
    item.addEventListener('click', e => this.handleHistoryClick(e, search));
    this.historyList.appendChild(item);
  }

  loadRecentSearches() {
    this.historyList.innerHTML = '';
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    searches.forEach(search => this.createHistoryItem(search));
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
