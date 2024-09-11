let booklist = [];
let currentPage = 1;
let itemsPerPage = 5;

const fetchBooksButton = document.querySelector('#fetchbooks');
let mainContainer = document.querySelector('#books-container');
let paginationContainer = document.querySelector('#pagination-container');
let searchInput = document.querySelector('#search');
let sortingItem = document.querySelector('#sorting');
let complexityFilter = document.querySelector('#complexity');

fetchBooksButton.addEventListener('click', async () => {
    mainContainer.innerHTML = "<p>Loading books...</p>";
    try {
        const response = await fetch('https://openlibrary.org/search.json?q=subject:fiction');
        const data = await response.json();
        booklist = data.docs.map(book => ({
            title: book.title,
            description: book.first_sentence ? book.first_sentence[0] : 'No description available',
            coverImage: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'https://via.placeholder.com/100',
            complexity: 'medium'
        }));
        displayBooks();
    } catch (error) {
        mainContainer.innerHTML = "<p>Error fetching books. Please try again later.</p>";
        console.error(error);
    }
});

function displayBooks() {
    mainContainer.innerHTML = "";

    let filteredBooks = booklist.filter(book =>
        book.title.toLowerCase().includes(searchInput.value.toLowerCase()) &&
        (complexityFilter.value === 'all' || book.complexity === complexityFilter.value)
    );

    if (sortingItem.value === 'asc') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
    }

    let paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    paginatedBooks.forEach(book => {
        let bookImage = document.createElement('img');
        bookImage.src = book.coverImage;
        bookImage.height = 100;
        bookImage.width = 100;

        let title = document.createElement('div');
        title.textContent = book.title;

        let description = document.createElement('div');
        description.textContent = book.description;

        let container = document.createElement('div');
        container.appendChild(bookImage);
        container.appendChild(title);
        container.appendChild(description);
        mainContainer.appendChild(container);
    });

    displayPagination(filteredBooks.length);
}

searchInput.addEventListener('input', () => {
    currentPage = 1;
    displayBooks();
});

sortingItem.addEventListener('change', () => {
    displayBooks();
});

complexityFilter.addEventListener('change', () => {
    displayBooks();
});

function displayPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-btn');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayBooks();
        });
        paginationContainer.appendChild(pageButton);
    }
}