document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const container = document.querySelector('.container');

    if (productId) {
        fetch(`https://dummyjson.com/products/${productId}`)
            .then(res => res.json())
            .then(product => {
                container.innerHTML = `
                <h1 class="product-heading">Product Details</h1>
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.thumbnail}" alt="${product.title}">
                    </div>
                    <div class="product-info">
                        <h1 class="product-title">${product.title}</h1>
                        <p class="product-description">${product.description}</p>
                        <p class="product-price">$${product.price}</p>
                    </div>
                </div>
                `;

                // Save to Product View History
                let viewHistory = JSON.parse(localStorage.getItem('viewedProducts')) || [];
                
                // Remove if already exists to avoid duplicates, then add to start
                const existingIndex = viewHistory.findIndex(item => item.id === product.id);
                if (existingIndex !== -1) {
                    // Update timestamp if already present
                    viewHistory[existingIndex].timestamp = Date.now();
                    // Move to start
                    const [existing] = viewHistory.splice(existingIndex, 1);
                    viewHistory.unshift(existing);
                } else {
                    // Add new entry to start
                    viewHistory.unshift({
                        id: product.id,
                        title: product.title,
                        thumbnail: product.thumbnail,
                        timestamp: Date.now()
                    });
                }
             console.log(viewHistory);
                // Keep only last 10 views
                localStorage.setItem('viewedProducts', JSON.stringify(viewHistory.slice(0, 10)));
            });
    }
});