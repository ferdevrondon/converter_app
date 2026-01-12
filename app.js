let EXCHANGE_RATE = 8.25;
let currentAmount = '0';
let conversionHistory = [];
let lastRateUpdate = null;
let isLoadingRate = false;

let direction = 'MXN_TO_JPY';

function setElementClasses(el, removeClasses, addClasses) {
    if (!el) return;
    removeClasses.forEach(c => el.classList.remove(c));
    addClasses.forEach(c => el.classList.add(c));
}

function applyCardTheme({ isFromJPY }) {
    const fromCard = document.getElementById('from-card');
    const toCard = document.getElementById('to-card');

    const fromLabel = document.getElementById('from-label');
    const toLabel = document.getElementById('to-label');
    const fromCountry = document.getElementById('from-country');
    const toCountry = document.getElementById('to-country');
    const fromSymbol = document.getElementById('from-symbol');
    const toSymbol = document.getElementById('to-symbol');

    const fromAmount = document.getElementById('mxn-amount');
    const toAmount = document.getElementById('jpy-amount');

    const gradientClasses = ['bg-gradient-to-br', 'from-primary-red', 'to-deep-red', 'shadow-xl', 'shadow-primary-red/20'];
    const whiteCardClasses = ['bg-white/85', 'backdrop-blur-md', 'border', 'border-primary-red/10', 'shadow-lg', 'shadow-primary-red/10'];

    const labelGray = ['text-gray-400'];
    const labelWhite = ['text-white/60'];

    const countryGray = ['text-gray-500'];
    const countryWhite = ['text-white/80'];

    const amountBlack = ['text-black'];
    const amountWhite = ['text-white'];

    const symbolGray = ['text-gray-400'];
    const symbolWhite = ['text-white/60'];

    if (isFromJPY) {
        setElementClasses(fromCard, whiteCardClasses, gradientClasses);
        setElementClasses(toCard, gradientClasses, whiteCardClasses);

        setElementClasses(fromLabel, labelGray, labelWhite);
        setElementClasses(fromCountry, countryGray, countryWhite);
        setElementClasses(fromAmount, amountBlack, amountWhite);
        setElementClasses(fromSymbol, symbolGray, symbolWhite);

        setElementClasses(toLabel, labelWhite, labelGray);
        setElementClasses(toCountry, countryWhite, countryGray);
        setElementClasses(toAmount, amountWhite, amountBlack);
        setElementClasses(toSymbol, symbolWhite, symbolGray);
    } else {
        setElementClasses(fromCard, gradientClasses, whiteCardClasses);
        setElementClasses(toCard, whiteCardClasses, gradientClasses);

        setElementClasses(fromLabel, labelWhite, labelGray);
        setElementClasses(fromCountry, countryWhite, countryGray);
        setElementClasses(fromAmount, amountWhite, amountBlack);
        setElementClasses(fromSymbol, symbolWhite, symbolGray);

        setElementClasses(toLabel, labelGray, labelWhite);
        setElementClasses(toCountry, countryGray, countryWhite);
        setElementClasses(toAmount, amountBlack, amountWhite);
        setElementClasses(toSymbol, symbolGray, symbolWhite);
    }
}

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
    const fromValue = mxnValue;
    const toValue = direction === 'MXN_TO_JPY' ? (fromValue * EXCHANGE_RATE) : (fromValue / EXCHANGE_RATE);
    
    const fromAmountEl = document.getElementById('mxn-amount');
    const toAmountEl = document.getElementById('jpy-amount');
    if (fromAmountEl) fromAmountEl.textContent = formatNumber(fromValue);
    if (toAmountEl) toAmountEl.textContent = formatNumber(toValue);
}

function formatNumber(num) {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function swapCurrencies() {
    direction = direction === 'MXN_TO_JPY' ? 'JPY_TO_MXN' : 'MXN_TO_JPY';
    
    const fromLabel = document.getElementById('from-label');
    const toLabel = document.getElementById('to-label');
    const fromCountry = document.getElementById('from-country');
    const toCountry = document.getElementById('to-country');
    const fromSymbol = document.getElementById('from-symbol');
    const toSymbol = document.getElementById('to-symbol');
    const fromFlag = document.getElementById('from-flag');
    
    if (direction === 'MXN_TO_JPY') {
        if (fromLabel) fromLabel.textContent = 'From MXN';
        if (toLabel) toLabel.textContent = 'To JPY';
        if (fromCountry) fromCountry.textContent = 'Mexico';
        if (toCountry) toCountry.textContent = 'Japan';
        if (fromSymbol) fromSymbol.textContent = '$';
        if (toSymbol) toSymbol.textContent = '¥';
        if (fromFlag) fromFlag.textContent = 'MX';
    } else {
        if (fromLabel) fromLabel.textContent = 'From JPY';
        if (toLabel) toLabel.textContent = 'To MXN';
        if (fromCountry) fromCountry.textContent = 'Japan';
        if (toCountry) toCountry.textContent = 'Mexico';
        if (fromSymbol) fromSymbol.textContent = '¥';
        if (toSymbol) toSymbol.textContent = '$';
        if (fromFlag) fromFlag.textContent = 'JP';
    }

    applyCardTheme({ isFromJPY: direction === 'JPY_TO_MXN' });
    
    updateHomeScreen();
    updateDisplay();
}

function saveConversion() {
    const fromValue = parseFloat(currentAmount) || 0;
    
    if (fromValue === 0) {
        alert('Please enter an amount to convert');
        return;
    }
    
    const toValue = direction === 'MXN_TO_JPY' ? (fromValue * EXCHANGE_RATE) : (fromValue / EXCHANGE_RATE);
    const now = new Date();
    
    const conversion = {
        direction,
        fromValue,
        toValue,
        fromCurrency: direction === 'MXN_TO_JPY' ? 'MXN' : 'JPY',
        toCurrency: direction === 'MXN_TO_JPY' ? 'JPY' : 'MXN',
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
    
    const total = conversionHistory.reduce((sum, conv) => sum + (conv.toCurrency === 'JPY' ? conv.toValue : 0), 0);
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
            const fromSymbol = conv.fromCurrency === 'MXN' ? '$' : '¥';
            const toSymbol = conv.toCurrency === 'MXN' ? '$' : '¥';
            const displayRate = conv.direction === 'MXN_TO_JPY'
                ? `1 MXN = ${conv.rate.toFixed(3)} JPY`
                : `1 JPY = ${(1 / conv.rate).toFixed(4)} MXN`;

            html += `
                <div class="bg-white border border-primary-red/10 rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-1.5">
                            <span class="text-primary-red font-bold text-lg">${fromSymbol} ${formatNumber(conv.fromValue)}</span>
                            <span class="material-symbols-outlined text-gray-400 text-sm">arrow_forward</span>
                            <span class="text-gray-900 font-bold text-lg">${toSymbol} ${formatNumber(conv.toValue)}</span>
                        </div>
                        <p class="text-gray-400 text-[10px] font-medium mt-0.5">${displayRate} • ${conv.time}</p>
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
        const parsed = JSON.parse(saved);
        conversionHistory = Array.isArray(parsed) ? parsed.map(item => {
            if (item && typeof item === 'object' && ('fromValue' in item) && ('toValue' in item)) {
                return item;
            }

            if (item && typeof item === 'object' && ('mxn' in item) && ('jpy' in item)) {
                return {
                    direction: 'MXN_TO_JPY',
                    fromValue: item.mxn,
                    toValue: item.jpy,
                    fromCurrency: 'MXN',
                    toCurrency: 'JPY',
                    rate: item.rate || EXCHANGE_RATE,
                    timestamp: item.timestamp || Date.now(),
                    date: item.date || 'Today',
                    time: item.time || ''
                };
            }

            return item;
        }) : [];
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
        if (direction === 'MXN_TO_JPY') {
            rateDisplay.textContent = `1 MXN = ${EXCHANGE_RATE.toFixed(2)} JPY`;
        } else {
            rateDisplay.textContent = `1 JPY = ${(1 / EXCHANGE_RATE).toFixed(4)} MXN`;
        }
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

applyCardTheme({ isFromJPY: direction === 'JPY_TO_MXN' });

fetchExchangeRate();

setInterval(fetchExchangeRate, 3600000);
