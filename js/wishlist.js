let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const wishlistContainer = document.getElementById('wishlist-container');

function renderWishlist() {
    wishlistContainer.innerHTML = '';
    wishlist.forEach(book => {
        wishlistContainer.innerHTML += `
            <div class="book-card">
                <a href="/html/book.html?id=${book.id}">
                    <img src="${book.formats['image/jpeg']}" alt="${book.title}">
                </a>
                <h3>${book.title}</h3>
                <p>Author: ${book.authors[0]?.name}</p>
            </div>
        `;
    });
}

renderWishlist();
