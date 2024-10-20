// Array to store quotes
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
];

// Load quotes from localStorage on page load
window.onload = () => {
  loadQuotes();
  populateCategories();
  showRandomQuote(); // Show a random quote on page load
};

// Show a random quote using innerHTML
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available.</p>';
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  // Display the random quote using innerHTML
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <strong>${randomQuote.category}</strong></p>`;
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Add a new quote using innerHTML
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);

    saveQuotes(); // Save quotes to localStorage

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Update categories and show the new quote added
    populateCategories();
    showRandomQuote();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}
