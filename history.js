let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];

function renderSearchHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (suggestions.length === 0) {
        historyList.innerHTML = '<div class="empty-state">No search history found.</div>';
    } else {
        suggestions.sort((a, b) => b.time - a.time);
        suggestions.forEach((item, index) => {
            const historyCard = document.createElement('div');
            historyCard.className = 'history-item';
            const query = typeof item === 'object' ? item.query : item;
            const time = typeof item === 'object' ? new Date(item.time).toLocaleString() : 'N/A';

            historyCard.innerHTML = `
                <div class="query-info">
                    <span class="query-text">${query}</span>
                    <span class="query-time"><i class="far fa-clock"></i> ${time}</span>
                </div>
                <div class="delete-btn" onclick="deleteHistoryItem(${index})">
                    <i class="fas fa-trash-can"></i>
                </div>
            `;
            historyList.appendChild(historyCard);
        });
    }
}

function renderViewHistory() {
    const viewList = document.getElementById('view-list');
    viewList.innerHTML = '';

    if (viewedProducts.length === 0) {
        viewList.innerHTML = '<div class="empty-state">No recently viewed products.</div>';
        return;
    }

    viewedProducts.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="query-info" onclick="window.location.href='product_detail.html?id=${product.id}'" style="cursor:pointer">
                <span class="query-text">${product.title}</span>
                <span class="query-time">$${product.price}</span>
            </div>
            <div class="delete-btn" onclick="deleteViewItem(${index})">
                <i class="fas fa-trash-can"></i>
            </div>
        `;
        viewList.appendChild(item);
    });
}

window.deleteHistoryItem = (index) => {
    suggestions.splice(index, 1);
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
    renderSearchHistory();
};

window.deleteViewItem = (index) => {
    viewedProducts.splice(index, 1);
    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
    renderViewHistory();
};

document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm('Clear all search history?')) {
        suggestions = [];
        localStorage.removeItem('suggestions');
        renderSearchHistory();
    }
});

document.getElementById('clear-views').addEventListener('click', () => {
    if (confirm('Clear viewed products?')) {
        viewedProducts = [];
        localStorage.removeItem('viewedProducts');
        renderViewHistory();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderSearchHistory();
    renderViewHistory();
});