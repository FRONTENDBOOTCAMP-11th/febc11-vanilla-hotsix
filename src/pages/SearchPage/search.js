class SearchPage {
  constructor() {
    this.form = document.querySelector('form');
    this.searchInput = document.querySelector('.search-input');
    this.historyList = document.querySelector('.recent-section .history-list');
    this.recommendSection = document.querySelector('.recommend-section');
    this.recentSection = document.querySelector('.recent-section');
    this.searchSection = document.querySelector('.search-section');
    this.contents = document.querySelector('.contents');
    this.articles = [];
    this.authors = [];

    this.activeTab = 'articles';
    this.init();
  }

  // 초기화 메서드
  async init() {
    this.form.addEventListener('submit', e => this.handleSearchSubmit(e));
    this.loadRecentSearches();
  }

  async handleSearchSubmit(e) {
    e.preventDefault();
    const searchText = this.searchInput.value.trim();
    if (!searchText) return;

    this.addSearchToLocalStorage(searchText);
    this.updateViewForSearch();
    this.addCloseButton();

    try {
      await Promise.all([
        this.fetchArticles(searchText),
        this.fetchAuthors(searchText),
      ]);

      this.filteredArticles = this.getFilteredArticles(searchText);
      this.filteredAuthors = this.getFilteredAuthors(searchText);

      if (this.activeTab === 'articles') {
        this.displayArticleResults();
      } else {
        this.displayAuthorResults();
      }
      this.createNavTab();
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
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

  async fetchArticles(searchText = '') {
    try {
      const url = new URL('https://11.fesp.shop/posts');
      if (searchText) {
        url.searchParams.append('keyword', searchText);
      }
      const response = await fetch(url, {
        headers: {
          'client-id': 'vanilla06',
        },
      });
      const data = await response.json();
      console.log('API Response: ', data);
      this.articles = data.item || [];
      console.log('Fetched articles:', this.articles); // 여기서 콘솔로 확인
    } catch (error) {
      console.error('글 목록을 불러오는 데 실패했습니다: ', error);
    }
  }

  // async fetchAuthors(searchText = '') {
  //   try {
  //     const url = new URL('https://11.fesp.shop/users');
  //     if (searchText) {
  //       url.searchParams.append('name', searchText);
  //     }
  //     const response = await fetch(url, {
  //       headers: {
  //         'client-id': 'vanilla06',
  //       },
  //     });
  //     const data = await response.json();
  //     console.log('API Response: ', data);
  //     this.authors = data.item || [];
  //     console.log('Fetched authors: ', this.authors);
  //   } catch (error) {
  //     console.error('작가 목록을 불러오는 데 실패했습니다: ', error);
  //   }
  // }

  // 작가 이름의 일부만 검색어로 제출해도 검색되게 하기 위해, 일단 모든 작가 목록을 로드함. 이후에 필터링 메서드로 걸러질 것 (api에서 부분일치 기능을 제공하지 않아서)
  async fetchAuthors() {
    try {
      const url = new URL('https://11.fesp.shop/users');
      const response = await fetch(url, {
        headers: {
          'client-id': 'vanilla06',
        },
      });
      const data = await response.json();
      console.log('API Response: ', data);
      this.authors = data.item || [];
    } catch (error) {
      console.error('작가 목록을 불러오는 데 실패했습니다: ', error);
    }
  }

  getFilteredArticles(searchText) {
    return this.articles.filter(
      article =>
        article.title.includes(searchText) ||
        article.content.includes(searchText),
    );
  }

  getFilteredAuthors(searchText) {
    return this.authors.filter(author => author.name.includes(searchText));
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
      console.log(
        'Filtered authors: ',
        JSON.stringify(this.filteredAuthors, null, 2),
      );
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
      const textOnlyContent = result.content.replace(/<[^>]*>/g, '');
      const articleImage = `https://11.fesp.shop/${result.image}`;
      const dateObj = new Date(result.createdAt);
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const formattedDate = dateObj.toLocaleDateString('en-US', options);

      const postId = result._id;

      const article = document.createElement('article');
      article.innerHTML = `
        <a href="../../pages/PostPage/detailPage.html?postId=${postId}">
        <div class="article-title">
          <h2>${this.highlightKeyword(result.title, this.searchInput.value)}</h2>
        </div>
        <div class="article-contents">
          <div class="article-letters">
            <p>${this.highlightKeyword(textOnlyContent, this.searchInput.value)}</p>
            <footer>
              <span class="article-date">${formattedDate}</span>
              <img
                class="seperator-dot" 
                src="/public/assets/images/seperator-dot.svg"
              />
              <img
                class="seperator-text-by"
                src="/public/assets/images/seperator-text-by.svg"
              />
              <span class="article-writer">${result.user.name}</span>
            </footer>
          </div>
          <div class="image-placeholder" style="background-image: url('${articleImage}'); background-size: cover;"></div>
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
      const authorImage = `https://11.fesp.shop/${author.image}`;
      const name = author.name || [];
      const description = author.extra?.biography || [];
      const keywords = author.extra?.keyword || [];

      const authorId = author._id;

      const authorDiv = document.createElement('div');
      authorDiv.className = 'author';
      authorDiv.innerHTML = `        
        <div class="author-contents">
          <a href="../../pages/AuthorPage/index.html?userId=${authorId}">
          <div class="author-image" style="background-image: url('${authorImage}'); background-size: cover;"></div>
          <div class="author-letters">
            <div class="author-nickname">${this.highlightKeyword(name, this.searchInput.value)}</div>
            <div class="author-description">${description}</div>
          </div>
        </div>
        <ul class="tags">${keywords.map(tag => `<li class="tag">${tag}</li>`).join('')}</ul>
      `;

      // 작가 태그 영역을 클릭했을 때
      const tags = authorDiv.querySelectorAll('.tag');
      tags.forEach(tag => {
        tag.addEventListener('click', e => {
          // 링크 이동 방지
          e.preventDefault();
          e.stopPropagation();

          // 태그 내용을 검색어로 제출
          const tagText = tag.textContent.trim();
          this.searchInput.value = tagText;
          this.form.dispatchEvent(new Event('submit'));
        });
      });

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

// SearchPage 초기화
document.addEventListener('DOMContentLoaded', () => {
  const searchPage = new SearchPage();

  // 태그 클릭 시 검색어로 제출
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      const tagText = tag.textContent.trim();

      searchPage.searchInput.value = tagText;
      searchPage.form.dispatchEvent(new Event('submit'));
    });
  });
});
