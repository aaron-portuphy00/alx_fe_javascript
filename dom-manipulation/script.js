const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Simulated server endpoint

// Array to store quotes (loaded from localStorage or default values)
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
];

// Load quotes and categories from localStorage on page load and sync with server
window.onload = async () => {
  loadQuotes();
  populateCategories();
  showRandomQuote(); // Show a random quote on page load
  restoreLastSelectedCategory(); // Restore the last selected category
  createAddQuoteForm(); // Dynamically create the form on page load

  // Set up event listeners
  document.getElementById('exportButton').addEventListener('click', exportToJsonFile);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

  // Sync quotes with the server on load and periodically
  await syncQuotes();
  setInterval(syncQuotes, 5000); // Sync with server every 5 seconds
};

// Fetch data from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch data from the server');
    }
    const serverQuotes = await response.json();
    return serverQuotes.slice(0, 10); // Simulate limited results
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Sync quotes between local storage and server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  // Compare server and local quotes, handle conflict resolution
  if (serverQuotes.length > localQuotes.length) {
    console.log('Updating local quotes from server...');
    quotes = [...serverQuotes]; // Server data takes precedence
    saveQuotes();
    populateCategories();
    alert('Quotes updated from server!');
  } else if (localQuotes.length > serverQuotes.length) {
    console.log('Posting new local quotes to server...');
    const newLocalQuotes = localQuotes.slice(serverQuotes.length); // Find new quotes not on the server
    for (const quote of newLocalQuotes) {
      await postQuoteToServer(quote);
    }
  } else {
    console.log('Quotes are already in sync');
  }
}

// Post a new quote to the server
async function postQuoteToServer(newQuote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newQuote),
    });
    if (!response.ok) {
      throw new Error('Failed to sync new quote with the server');
    }
    const result = await response.json();
    console.log('Quote synced to server:', result);
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}

// Save quotes to localStorage every time a new quote is added
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from localStorage or use default quotes
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes); // If quotes exist in localStorage, load them
  }
}

// Add a new quote and update localStorage
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    
    saveQuotes(); // Save updated quotes to localStorage
    syncQuotes(); // Sync with the server after adding a new quote

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

// Populate the category filter dynamically using the unique categories in the quotes array
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Clear previous options and add "All Categories"
  
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

  // Save the last selected category to localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);

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

// Restore the last selected category from localStorage when the user revisits the page
function restoreLastSelectedCategory() {
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    document.getElementById('categoryFilter').value = lastSelectedCategory;
    filterQuotes(); // Apply the filter for the restored category
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
  addButton.id = 'newQuoteButton';
  addButton.textContent = 'Add Quote';
  
  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);
  
  formContainer.appendChild(formDiv);

  // Add event listener to the new quote button
  addButton.addEventListener('click', addQuote);
}
