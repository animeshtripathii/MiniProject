function renderProducts(products) {
    const box = document.getElementById('box');
    box.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-box';
        div.innerHTML = `
            <img src="${product.thumbnail || product.images[0]}">
            <h2>${product.title}</h2>
            <div class="price">$${product.price}</div>
        `;
        box.appendChild(div);
        div.addEventListener('click', () => {
            // Save to Viewed Products before redirecting
            saveToViewHistory(product);
            window.location.href = `./product_detail.html?id=${product.id}`;
        });
    });
}

function saveToViewHistory(product) {
    let viewed = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    // Prevent duplicates
    viewed = viewed.filter(p => p.id !== product.id);
    viewed.unshift({ id: product.id, title: product.title });
    // Keep only last 10 items
    localStorage.setItem('viewedProducts', JSON.stringify(viewed.slice(0, 10)));
}

fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => renderProducts(data.products))
    .catch(err => console.error('Error fetching products:', err));

document.getElementById('search').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) return;

    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
            const filteredProduct = data.products.filter(product => 
                product.title.toLowerCase().includes(query)
            );
            renderProducts(filteredProduct);
        });

    let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    const isDuplicate = suggestions.some(item => item.query === query);
    
    if (!isDuplicate) {
        suggestions.push({ query: query, time: Date.now() });
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
        // Update the UI if the function exists
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
