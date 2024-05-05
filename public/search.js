let searchBarBtn = document.querySelector('.search-bar');
let searchInput = document.querySelector('.search');

searchBarBtn.addEventListener('submit', () => {
    event.preventDefault();
    const searchInfo = searchInput.value.trim();
    if (searchInfo) {
        location.href = `/search/${encodeURIComponent(searchInfo)}`;
    }
});
