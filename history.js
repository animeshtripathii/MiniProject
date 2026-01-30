// Get data from localStorage
let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];

function renderSearchHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (suggestions.length === 0) {
        historyList.innerHTML = '<div class="empty-state">No search history found.</div>';
        return;
    }

    // Sort by time descending (Newest first)
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

// Function to delete a single item
window.deleteHistoryItem = (index) => {
    suggestions.splice(index, 1);
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
    renderSearchHistory();
};

// Function to clear everything
document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all history?')) {
        suggestions = [];
        localStorage.removeItem('suggestions');
        renderSearchHistory();
    }
});

document.addEventListener('DOMContentLoaded', renderSearchHistory);