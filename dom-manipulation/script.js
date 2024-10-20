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
  createAddQuoteForm(); // Dynamically create the form on page load
};

// Show a random quote
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

// Create and dynamically add the quote form using appendChild
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');
  
  const formTitle = document.createElement('h3');
  formTitle.textContent = 'Add a New Quote';
  formContainer.appendChild(formTitle);
  
  const formDiv = document.createElement('div');
  
  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';
  
  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';
  
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote; // Set the onclick event to addQuote
  
  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);
  
  formContainer.appendChild(formDiv);
}

// Add a new quote and update the DOM
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

// Populate the category filter dynamically using appendChild
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = ''; // Clear previous options
  
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Categories';
  categoryFilter.appendChild(allOption);
  
  const categories = [...new Set(quotes.map(q => q.category))]; // Get unique categories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');

  let filteredQuotes;
  if (selectedCategory === 'all') {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <strong>${randomQuote.category}</strong></p>`;
  } else {
    quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
  }
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes); // Merge imported quotes with existing ones
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(file);
  }
}
