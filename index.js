// index.js

// Function to render quotes as products
function renderProducts(product) {
    const box = document.getElementById('box');
    box.innerHTML = '';
    product.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-box';
        div.innerHTML = `
            <img src="${product.images}">
            <h2>${product.title}</h2>
            <div class="price">${product.price}</div>
        `;
        box.appendChild(div);
    });
}

// Fetch quotes from API and render
fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        renderProducts(data.products);
    })
    .catch(err => {
        console.error('Error fetching quotes:', err);
    });

// Search functionality
document.getElementById('search').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
            const filteredProduct = data.products.filter(product => 
                product.title.toLowerCase().includes(query)
            );
            renderProducts(filteredProduct);
        })
        .catch(err => {
            console.error('Error fetching quotes:', err);
        });
});
