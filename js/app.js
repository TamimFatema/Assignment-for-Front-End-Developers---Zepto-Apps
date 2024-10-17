const apiURL = 'https://gutendex.com/books';
let currentPage = 1;
let books = [];
const booksPerPage = 12; // Show 12 books per page
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

const bookListElement = document.getElementById('book-list');
const searchInput = document.getElementById('search-bar');
const genreFilter = document.getElementById('genre-filter');
const paginationElement = document.querySelector('.pagination');

// Event listeners for search and genre filter
searchInput.addEventListener('input', renderBooks);
genreFilter.addEventListener('change', renderBooks);

// Fetch books from the API
function fetchBooks() {
    showLoading(); // Show loading icon
    fetch(`${apiURL}?page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            books = data.results;
            populateGenres(data.results);
            renderBooks();
            hideLoading(); // Hide loading icon after fetching
        });
}

// Render the book list based on the current page and filters
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
                <a href="/html/book.html?id=${book.id}" class="details-button">View Details</a>
            </div>
        `;
    });

    updatePagination(filteredBooks.length);
}

// Toggle the wishlist status of a book
function toggleWishlist(bookId) {
    const book = books.find(b => b.id === bookId);
    if (wishlist.some(wish => wish.id === bookId)) {
        wishlist = wishlist.filter(wish => wish.id !== bookId);
        showNotification(`Removed ${book.title} from wishlist!`);
    } else {
        wishlist.push(book);
        showNotification(`Added ${book.title} to wishlist!`);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderBooks();
}

// Update pagination buttons
function updatePagination(totalBooks) {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    paginationElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        paginationElement.innerHTML += `
            <button class="pagination-btn ${currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>
        `;
    }
}

// Go to a specific page
function goToPage(page) {
    currentPage = page;
    renderBooks();
}

// Populate the genre filter
function populateGenres(books) {
    const genres = new Set(books.flatMap(book => book.subjects));
    genreFilter.innerHTML = '<option value="">All Genres</option>';
    genres.forEach(genre => {
        genreFilter.innerHTML += `<option value="${genre}">${genre}</option>`;
    });
}

// Show loading icon
function showLoading() {
    document.getElementById('loading-icon').style.display = 'block';
}

// Hide loading icon
function hideLoading() {
    document.getElementById('loading-icon').style.display = 'none';
}

// Show notification message
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fetch initial books
fetchBooks();
