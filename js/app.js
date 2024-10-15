const apiURL = 'https://gutendex.com/books';
let currentPage = 1;
let books = [];
const booksPerPage = 12; // Show 12 books per page
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

const bookListElement = document.getElementById('book-list');
const searchInput = document.getElementById('search-bar');
const genreFilter = document.getElementById('genre-filter');
const pageNumber = document.getElementById('page-number');
const paginationElement = document.querySelector('.pagination');

document.getElementById('next-page').addEventListener('click', () => changePage(1));
document.getElementById('prev-page').addEventListener('click', () => changePage(-1));

searchInput.addEventListener('input', renderBooks);
genreFilter.addEventListener('change', renderBooks);

function fetchBooks() {
    fetch(`${apiURL}?page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            books = data.results;
            populateGenres(data.results);
            renderBooks();
        });
}

function renderBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const genre = genreFilter.value;

    bookListElement.innerHTML = '';
    
    const filteredBooks = books.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(searchTerm);
        const matchesGenre = genre ? book.subjects.includes(genre) : true;
        return matchesTitle && matchesGenre;
    });

    const startIndex = (currentPage - 1) * booksPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

    paginatedBooks.forEach(book => {
        const isWishlisted = wishlist.some(wish => wish.id === book.id);
        bookListElement.innerHTML += `
            <div class="book-card">
                <img src="${book.formats['image/jpeg']}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>Author: ${book.authors[0]?.name}</p>
                <span class="wishlist-icon" onclick="toggleWishlist(${book.id})">
                    ${isWishlisted ? '❤️' : '🤍'}
                </span>
            </div>
        `;
    });

    updatePagination(filteredBooks.length);
}

function toggleWishlist(bookId) {
    const book = books.find(b => b.id === bookId);
    if (wishlist.some(wish => wish.id === bookId)) {
        wishlist = wishlist.filter(wish => wish.id !== bookId);
    } else {
        wishlist.push(book);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderBooks();
}

function changePage(step) {
    currentPage += step;
    if (currentPage < 1) currentPage = 1;
    renderBooks();
}

function populateGenres(books) {
    const genres = new Set(books.flatMap(book => book.subjects));
    genreFilter.innerHTML = '<option value="">All Genres</option>';
    genres.forEach(genre => {
        genreFilter.innerHTML += `<option value="${genre}">${genre}</option>`;
    });
}

function updatePagination(totalBooks) {
    const totalPages = Math.ceil(totalBooks / booksPerPage);

    paginationElement.innerHTML = `
        <button id="prev-page" class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        ${Array.from({ length: totalPages }, (_, i) => `
            <button class="pagination-btn ${currentPage === i + 1 ? 'active' : ''}" onclick="goToPage(${i + 1})">${i + 1}</button>
        `).join('')}
        <button id="next-page" class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;
}

function goToPage(page) {
    currentPage = page;
    renderBooks();
}

fetchBooks();
