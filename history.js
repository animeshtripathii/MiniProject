let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];

function renderSearchHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    historyList.innerHTML = '';

    if (suggestions.length === 0) {
        historyList.innerHTML = '<div class="empty-state">No recent searches found.</div>';
    } else {
        suggestions.sort((a, b) => b.time - a.time);
        suggestions.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            const query = typeof item === 'object' ? item.query : item;
            const time = typeof item === 'object' ? new Date(item.time).toLocaleString() : 'N/A';

            div.innerHTML = `
                <div class="info-content" onclick="goToSearch('${query}')">
                    <span class="text-primary">${query}</span>
                    <span class="text-secondary"><i class="far fa-clock"></i> ${time}</span>
                </div>
                <button class="delete-btn" onclick="deleteHistoryItem(${index})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            historyList.appendChild(div);
        });
    }
}

function renderViewHistory() {
    const viewList = document.getElementById('view-list');
    if (!viewList) return;
    viewList.innerHTML = '';

    if (viewedProducts.length === 0) {
        viewList.innerHTML = '<div class="empty-state">No recently viewed products.</div>';
    } else {
        viewedProducts.forEach((product, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="info-content" onclick="window.location.href='product_detail.html?id=${product.id}'">
                    <span class="text-primary">${product.title}</span>
                    <span class="text-secondary">Viewed on this device</span>
                </div>
                <button class="delete-btn" onclick="deleteViewItem(${index})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            viewList.appendChild(div);
        });
    }
}

window.goToSearch = (query) => {
    window.location.href = `index.html?search=${encodeURIComponent(query)}`;
};

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
    if (confirm('Permanently clear all search history?')) {
        suggestions = [];
        localStorage.removeItem('suggestions');
        renderSearchHistory();
    }
});

document.getElementById('clear-views').addEventListener('click', () => {
    if (confirm('Permanently clear all viewed products?')) {
        viewedProducts = [];
        localStorage.removeItem('viewedProducts');
        renderViewHistory();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderSearchHistory();
    renderViewHistory();
});