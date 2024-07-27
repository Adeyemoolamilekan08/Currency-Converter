const amountInput = document.getElementById('amount');
const sourceCurrencySelect = document.getElementById('sourceCurrency');
const destinationCurrencySelect = document.getElementById('destinationCurrency');
const resultDisplay = document.getElementById('result');
const swapButton = document.getElementById('swapButton');

let exchangeRates = {};

// Function to fetch exchange rates
async function fetchExchangeRates() {
    const response = await fetch('https://v6.exchangerate-api.com/v6/ae3a45e1db2390b4dfa9a911/latest/USD'); // Replace with your API key
    const data = await response.json();
    
    if (data.result === "success") {
        exchangeRates = data.conversion_rates; // Change 'rates' to 'conversion_rates'
        populateCurrencyDropdowns();
        setDefaultCurrency();
    } else {
        console.error("Error fetching exchange rates:", data);
        alert("Failed to fetch exchange rates. Please try again later.");
    }
}

// Function to populate dropdowns with currency options
function populateCurrencyDropdowns() {
    const currencies = Object.keys(exchangeRates).sort();
    
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.textContent = currency;
        sourceCurrencySelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = currency;
        option2.textContent = currency;
        destinationCurrencySelect.appendChild(option2);
    });
}

// Set default selected currencies
function setDefaultCurrency() {
    if (sourceCurrencySelect.options.length > 0 && destinationCurrencySelect.options.length > 0) {
        sourceCurrencySelect.selectedIndex = 0; // Select first option
        destinationCurrencySelect.selectedIndex = 1; // Select second option
    }
}

// Function to convert currency
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const sourceCurrency = sourceCurrencySelect.value;
    const destinationCurrency = destinationCurrencySelect.value;

    console.log("amount:", amount);
    console.log("sourceCurrency:", sourceCurrency);
    console.log("destinationCurrency:", destinationCurrency);

    if (isNaN(amount) || amount < 0) {
        alert("Please enter a valid number.");
        resultDisplay.textContent = '0.00';
        return;
    }

    if (!exchangeRates[sourceCurrency] || !exchangeRates[destinationCurrency]) {
        alert("Please select valid currencies.");
        resultDisplay.textContent = '0.00';
        return;
    }

    const conversionRate = exchangeRates[destinationCurrency] / exchangeRates[sourceCurrency];
    console.log("conversionRate:", conversionRate);
    const convertedAmount = (amount * conversionRate).toFixed(2);
    resultDisplay.textContent = `${convertedAmount} ${destinationCurrency}`;
}

// Function to swap currencies
function swapCurrencies() {
    const temp = sourceCurrencySelect.value;
    sourceCurrencySelect.value = destinationCurrencySelect.value;
    destinationCurrencySelect.value = temp;
    convertCurrency(); // Update conversion after swapping
}

// Event listeners
amountInput.addEventListener('input', convertCurrency);
sourceCurrencySelect.addEventListener('change', convertCurrency);
destinationCurrencySelect.addEventListener('change', convertCurrency);
swapButton.addEventListener('click', swapCurrencies);

// Initialize
fetchExchangeRates();
