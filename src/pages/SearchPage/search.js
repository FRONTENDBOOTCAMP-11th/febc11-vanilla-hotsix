document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('form').addEventListener('submit', function (e) {
    const searchInput = document.querySelector('.search-input').value;

    if (searchInput.trim() === '') {
      e.preventDefault(); // 검색어가 없으면 전송하지 않음
    } else {
      this.action = `/src/pages/SearchArticlePage/index.html?query=${encodeURIComponent(searchInput)}`; // 검색 결과 페이지로 리다이렉션
    }
  });
});
