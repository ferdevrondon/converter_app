let EXCHANGE_RATE = 8.25;
let currentAmount = '0';
let conversionHistory = [];
let lastRateUpdate = null;
let isLoadingRate = false;

function navigateTo(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`${screen}-screen`).classList.add('active');
    
    if (screen === 'history') {
        renderHistory();
    }
}

function addDigit(digit) {
    if (digit === '.' && currentAmount.includes('.')) return;
    
    if (currentAmount === '0' && digit !== '.') {
        currentAmount = digit;
    } else {
        currentAmount += digit;
    }
    
    updateDisplay();
}

function deleteDigit() {
    if (currentAmount.length === 1) {
        currentAmount = '0';
    } else {
        currentAmount = currentAmount.slice(0, -1);
    }
    
    updateDisplay();
}

function updateDisplay() {
    const mxnValue = parseFloat(currentAmount) || 0;
    const jpyValue = mxnValue * EXCHANGE_RATE;
    
    document.getElementById('mxn-amount').textContent = formatNumber(mxnValue);
    document.getElementById('jpy-amount').textContent = formatNumber(jpyValue);
}

function formatNumber(num) {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function swapCurrencies() {
    alert('Currency swap feature coming soon!');
}

function saveConversion() {
    const mxnValue = parseFloat(currentAmount) || 0;
    
    if (mxnValue === 0) {
        alert('Please enter an amount to convert');
        return;
    }
    
    const jpyValue = mxnValue * EXCHANGE_RATE;
    const now = new Date();
    
    const conversion = {
        mxn: mxnValue,
        jpy: jpyValue,
        rate: EXCHANGE_RATE,
        timestamp: now.getTime(),
        date: formatDate(now),
        time: formatTime(now)
    };
    
    conversionHistory.unshift(conversion);
    saveToLocalStorage();
    
    currentAmount = '0';
    updateDisplay();
    
    alert('Conversion saved to history!');
}

function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    const totalConverted = document.getElementById('total-converted');
    const conversionCount = document.getElementById('conversion-count');
    
    if (conversionHistory.length === 0) {
        historyList.innerHTML = '<p class="text-gray-400 text-center text-sm mt-8">No conversions yet</p>';
        totalConverted.textContent = '¥ 0.00';
        conversionCount.textContent = '0 conversions saved';
        return;
    }
    
    const total = conversionHistory.reduce((sum, conv) => sum + conv.jpy, 0);
    totalConverted.textContent = `¥ ${formatNumber(total)}`;
    conversionCount.textContent = `${conversionHistory.length} conversion${conversionHistory.length !== 1 ? 's' : ''} saved`;
    
    const groupedByDate = {};
    conversionHistory.forEach(conv => {
        if (!groupedByDate[conv.date]) {
            groupedByDate[conv.date] = [];
        }
        groupedByDate[conv.date].push(conv);
    });
    
    let html = '';
    Object.keys(groupedByDate).forEach(date => {
        html += `<p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 mt-4">${date}</p>`;
        
        groupedByDate[date].forEach(conv => {
            html += `
                <div class="bg-white border border-primary-red/10 rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-1.5">
                            <span class="text-primary-red font-bold text-lg">$ ${formatNumber(conv.mxn)}</span>
                            <span class="material-symbols-outlined text-gray-400 text-sm">arrow_forward</span>
                            <span class="text-gray-900 font-bold text-lg">¥ ${formatNumber(conv.jpy)}</span>
                        </div>
                        <p class="text-gray-400 text-[10px] font-medium mt-0.5">1 MXN = ${conv.rate.toFixed(3)} JPY • ${conv.time}</p>
                    </div>
                    <div class="h-8 w-8 rounded-full bg-accent-red flex items-center justify-center">
                        <span class="material-symbols-outlined text-primary-red text-sm">history</span>
                    </div>
                </div>
            `;
        });
    });
    
    historyList.innerHTML = html;
}

function clearHistory() {
    if (conversionHistory.length === 0) return;
    
    if (confirm('Are you sure you want to clear all conversion history?')) {
        conversionHistory = [];
        saveToLocalStorage();
        renderHistory();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('conversionHistory');
    if (saved) {
        conversionHistory = JSON.parse(saved);
    }
}

async function fetchExchangeRate() {
    if (isLoadingRate) return;
    
    isLoadingRate = true;
    
    const refreshIcon = document.getElementById('refresh-icon');
    if (refreshIcon) {
        refreshIcon.classList.add('spinning');
    }
    
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/MXN');
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rate');
        }
        
        const data = await response.json();
        
        if (data.rates && data.rates.JPY) {
            EXCHANGE_RATE = data.rates.JPY;
            lastRateUpdate = new Date();
            
            localStorage.setItem('exchangeRate', EXCHANGE_RATE.toString());
            localStorage.setItem('lastRateUpdate', lastRateUpdate.toISOString());
            
            updateHomeScreen();
            updateDisplay();
            
            console.log(`Exchange rate updated: 1 MXN = ${EXCHANGE_RATE.toFixed(4)} JPY`);
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        
        const savedRate = localStorage.getItem('exchangeRate');
        const savedUpdate = localStorage.getItem('lastRateUpdate');
        
        if (savedRate) {
            EXCHANGE_RATE = parseFloat(savedRate);
            lastRateUpdate = savedUpdate ? new Date(savedUpdate) : null;
        }
    } finally {
        isLoadingRate = false;
        
        if (refreshIcon) {
            refreshIcon.classList.remove('spinning');
        }
    }
}

function loadSavedRate() {
    const savedRate = localStorage.getItem('exchangeRate');
    const savedUpdate = localStorage.getItem('lastRateUpdate');
    
    if (savedRate) {
        EXCHANGE_RATE = parseFloat(savedRate);
        lastRateUpdate = savedUpdate ? new Date(savedUpdate) : null;
    }
}

function updateHomeScreen() {
    const now = lastRateUpdate || new Date();
    document.getElementById('last-update').textContent = `${formatDate(now)}, ${formatTime(now)}`;
    document.getElementById('live-rate').textContent = `${EXCHANGE_RATE.toFixed(2)} JPY`;
    
    const rateDisplay = document.getElementById('rate-display');
    if (rateDisplay) {
        rateDisplay.textContent = `1 MXN = ${EXCHANGE_RATE.toFixed(2)} JPY`;
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(err => console.log('ServiceWorker registration failed'));
    });
}

loadFromLocalStorage();
loadSavedRate();
updateHomeScreen();
updateDisplay();

fetchExchangeRate();

setInterval(fetchExchangeRate, 3600000);
