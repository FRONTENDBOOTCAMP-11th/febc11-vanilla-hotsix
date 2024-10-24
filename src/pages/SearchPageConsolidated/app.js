document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search-form');
  const searchResults = document.getElementById('search-results'); // ID로 변경
  const resultSection = document.querySelector('.result-section');
  const resultTitle = document.querySelector('.result-title');

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault(); // 페이지 리로드 없이 동적으로 화면 업데이트 하기 위함

    const searchInput = document.querySelector('.search-input').value.trim();

    // 빈 검색어일 때는 아무 동작도 하지 않음
    if (searchInput === '') {
      return;
    }

    // 검색어에 따라 결과를 동적으로 생성
    displaySearchResults(searchInput);
  });

  function displaySearchResults(query) {
    const sampleResults = [
      {
        title: '딸의 정부청사 출장에 부모님이 동행하는 이유',
        date: 'Apr 19, 2024',
        by: '출판사',
        snippet: '딸이 만나러...',
      },
      {
        title: "덴마크의 '꿀 하트' 쿠키",
        date: 'Nov 16, 2023',
        by: 'Windsbird',
        snippet: '덴마크의 유명...',
      },
      {
        title: '꿀 빠는 풍경',
        date: 'Jan 25, 2024',
        by: '작가',
        snippet: '책을 기다리며...',
      },
      {
        title: '사진만 봐도 꿀 같은 윤기 가득한...',
        date: 'Mar 28, 2023',
        by: '백엽상',
        snippet: '촬영기법...',
      },
    ];

    // 기존 검색 결과를 초기화
    searchResults.innerHTML = '';

    if (sampleResults.length === 0) {
      searchResults.innerHTML = '<p>검색 결과가 없습니다.</p>';
    } else {
      resultTitle.textContent = `'${query}' 검색 결과 ${sampleResults.length}건`;

      sampleResults.forEach(result => {
        const article = document.createElement('article');

        article.innerHTML = `
          <article>  
            <div class="article-title">
              <h2>${result.title}</h2>
            </div>
            
            <div class="article-contents">
              <div class="article-letters">
                <p>${result.snippet}</p>
                <footer>
                  <span class="article-date">${result.date}</span>
                  <span class="article-writer">${result.by}</span>
                </footer>
              </div>
              <div class="image-placeholder"></div>
            </div>
          </article>
          
        `;

        searchResults.appendChild(article);
      });
    }

    // 검색 결과 섹션을 보여줌
    resultSection.style.display = 'block';
  }
});
