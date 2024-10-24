// Elements
const articlesContainer = document.querySelector('.articles');
const searchInput = document.querySelector('.search-input').value;

// Functionality
document.addEventListener('DOMContentLoaded', function () {
  // 검색어 폼 제출 처리
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('q'); // 'q'가 검색어 파라미터라고 가정
  document.querySelector('h1').textContent = searchTerm; // 검색어를 타이틀에 표시

  // 검색어로 글을 필터링해 가져오는 로직
  fetch(`https://api.example.com/search?q=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // 가져온 글을 HTML에 삽입
      articlesContainer.innerHTML = ''; // 기존 글 초기화
      data.results.forEach(article => {
        const articleElement = `
            <article>
              <div class="article-title">
                <h2>${article.title}</h2>
              </div>
              <div class="article-contents">
                <div class="article-letters">
                  <p>${article.excerpt}</p>
                  <footer>
                    <span>${article.date}</span> · <span>${article.author}</span>
                  </footer>
                </div>
                <div class="image-placeholder"></div>
              </div>
            </article>
          `;
        articlesContainer.innerHTML += articleElement;
      });
    });

  // 최근 검색어 저장
  function saveSearchHistory(searchTerm) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(searchTerm)) {
      history.push(searchTerm);
      localStorage.setItem('searchHistory', JSON.stringify(history));
    }
  }

  document.querySelector('form').addEventListener('submit', function () {
    saveSearchHistory(searchInput);
  });
});
