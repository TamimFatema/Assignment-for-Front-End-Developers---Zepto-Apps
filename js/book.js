const bookDetailsElement = document.getElementById('book-details');
const apiURL = 'https://gutendex.com/books';

// Helper function to extract query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch the book ID from the query string
const bookId = getQueryParam('id');

if (bookId) {
    fetch(`${apiURL}/${bookId}`)
        .then(response => response.json())
        .then(book => renderBookDetails(book))
        .catch(error => console.log('Error fetching book details:', error));
} else {
    bookDetailsElement.innerHTML = '<p>Book not found.</p>';
}

function renderBookDetails(book) {
    const isWishlisted = JSON.parse(localStorage.getItem('wishlist'))?.some(wish => wish.id === book.id);

    bookDetailsElement.innerHTML = `
        <div class="book-details-card">
            <img src="${book.formats['image/jpeg']}" alt="${book.title}">
            <div>
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${book.authors[0]?.name || 'Unknown Author'}</p>
                <p><strong>Published:</strong> ${book.publish_date || 'N/A'}</p>
                <p><strong>Subjects:</strong> ${book.subjects.join(', ') || 'N/A'}</p>
                <span class="wishlist-icon" onclick="toggleWishlist(${book.id})">
                    ${isWishlisted ? '❤️' : '🤍'}
                </span>
            </div>
        </div>
    `;
}

// Function to toggle wishlist in book details
function toggleWishlist(bookId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const book = { id: bookId, title: document.querySelector('h2').textContent };

    if (wishlist.some(wish => wish.id === bookId)) {
        wishlist = wishlist.filter(wish => wish.id !== bookId);
    } else {
        wishlist.push(book);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderBookDetails({ id: bookId });
}
