let allProducts = []; 
let currentPage = 1;
const itemsPerPage = 8;

const box = document.getElementById('box');
const paginationContainer = document.getElementById('pagination');

function renderProducts(products) {
    box.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = products.slice(startIndex, endIndex);

    paginatedItems.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-box';
        div.innerHTML = `
            <img src="${product.thumbnail || product.images[0]}">
            <h2>${product.title}</h2>
            <div class="price">$${product.price}</div>
        `;
        
        div.addEventListener('click', () => {
            saveToViewHistory(product);
            window.location.href = `./product_detail.html?id=${product.id}`;
        });
        box.appendChild(div);
    });

    renderPaginationControls(products.length);
}

function renderPaginationControls(totalItems) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.innerText = 'Prev';
    prevBtn.className = 'page-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        currentPage--;
        renderProducts(allProducts);
        window.scrollTo(0, 0);
    };
    paginationContainer.appendChild(prevBtn);

    // Page X of Y Info
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next';
    nextBtn.className = 'page-btn';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        currentPage++;
        renderProducts(allProducts);
        window.scrollTo(0, 0);
    };
    paginationContainer.appendChild(nextBtn);
}

function saveToViewHistory(product) {
    let viewed = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    viewed = viewed.filter(p => p.id !== product.id);
    viewed.unshift({ id: product.id, title: product.title });
    localStorage.setItem('viewedProducts', JSON.stringify(viewed.slice(0, 10)));
}

fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        allProducts = data.products;
        renderProducts(allProducts);
    })
    .catch(err => console.error('Error fetching products:', err));

document.getElementById('search').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) return;

    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
            allProducts = data.products.filter(product => 
                product.title.toLowerCase().includes(query)
            );
            currentPage = 1; 
            renderProducts(allProducts);
        });

    let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    const isDuplicate = suggestions.some(item => item.query === query);
    
    if (!isDuplicate) {
        suggestions.push({ query: query, time: Date.now() });
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
        if (typeof renderSearchHistory === 'function') renderSearchHistory();
    }
    
    document.getElementById('suggestion').innerHTML = '';
});

const suggestionDiv = document.getElementById('suggestion');
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        suggestionDiv.innerHTML = '';
        return;
    }

    const suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    const filteredSuggestions = suggestions.filter(item => 
        item.query.toLowerCase().includes(query)
    );

    suggestionDiv.innerHTML = '';
    filteredSuggestions.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerText = item.query;   
        div.addEventListener('click', () => {
            searchInput.value = item.query;
            suggestionDiv.innerHTML = '';
            document.getElementById('search').click(); 
        });
        suggestionDiv.appendChild(div);
    });
});
