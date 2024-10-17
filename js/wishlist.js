let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const wishlistContainer = document.getElementById('wishlist-container');

function renderWishlist() {
    wishlistContainer.innerHTML = '';

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>No books in your wishlist.</p>';
        return;
    }

    // Create a container for the book cards
    const bookCards = document.createElement('div');
    bookCards.className = 'wishlist-container'; // Apply CSS class for styling

    wishlist.forEach(book => {
        bookCards.innerHTML += `
            <div class="book-card">
                <a href="/html/book.html?id=${book.id}">
                    <img src="${book.formats['image/jpeg']}" alt="${book.title}">
                </a>
                <h3>${book.title}</h3>
                <p>Author: ${book.authors[0]?.name}</p>
            </div>
        `;
    });

    // Append the book cards to the wishlist container
    wishlistContainer.appendChild(bookCards);
}

// Call the function to render the wishlist
renderWishlist();
