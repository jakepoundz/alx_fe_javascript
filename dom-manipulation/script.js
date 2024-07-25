// Array to store quote objects (initially empty)
let quotes = [];
let lastSyncedTimestamp = 0; // Timestamp of the last sync
// Function to load quotes from local storage
function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // If no quotes are stored, use default quotes
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration", timestamp: Date.now() },
      { text: "Life is what happens when you're busy making other plans.", category: "Life", timestamp: Date.now() },
      { text: "Strive not to be a success, but rather to be of value.", category: "Success", timestamp: Date.now() }
    ];
  }
  populateCategories(); // Update categories in the filter dropdown after loading
}
// Function to save quotes to local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
// Function to display a random quote and store it in session storage
function showRandomQuote() {
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").textContent = 
        `"${randomQuote.text}" - ${randomQuote.category}`;
    // Store the last viewed quote in session storage
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  } else {
    document.getElementById("quoteDisplay").textContent = "No quotes available. Add some!";
  }
}
// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText.trim() !== "" && newQuoteCategory.trim() !== "") {
    const newQuote = { text: newQuoteText, category: newQuoteCategory, timestamp: Date.now() };
    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    saveQuotesToLocalStorage(); // Save to local storage
    populateCategories(); // Update categories in the filter dropdown
    showRandomQuote(); // Show the new quote
  } else {
    alert("Please enter both quote and category.");
  }
}
// Function to export quotes to JSON file
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
  URL.revokeObjectURL(url); // Release the URL after download
}
// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      // Validate the imported data
      if (importedQuotes.every(quote => quote.hasOwnProperty('text') && quote.hasOwnProperty('category'))) {
        quotes.push(...importedQuotes);
        saveQuotesToLocalStorage();
        populateCategories(); // Update categories in the filter dropdown
        showRandomQuote();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format. Please ensure quotes have "text" and "category" properties.');
      }
    } catch (error) {
      alert('Error importing quotes: ' + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
// Function to update the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  // Clear existing options (except "All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  // Get unique categories from quotes array
  const uniqueCategories = new Set(quotes.map(quote => quote.category));
  // Populate filter dropdown with unique categories
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  });
  // Restore the last selected category from local storage
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    categoryFilter.value = lastCategory;
  }
}
// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selectedCategory); // Save the selected category
  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    document.getElementById("quoteDisplay").textContent = 
        `"${randomQuote.text}" - ${randomQuote.category}`;
  } else {
    document.getElementById("quoteDisplay").textContent = "No quotes found for this category.";
  }
}
// Function to simulate fetching quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    // Process serverQuotes to match the quote structure
    // (You'll likely need to transform the data from JSON Placeholder)
    // For simplicity, let's just use a placeholder here:
    const processedServerQuotes = serverQuotes.map(quote => ({
      text: quote.title,
      category: 'Mock Category', // Replace with real categories
      timestamp: quote.id // Using the ID as a placeholder timestamp
    }));
    // Update local quotes with server data
    updateQuotesFromServer(processedServerQuotes);
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}
// Function to update local quotes with data from the server
function updateQuotesFromServer(serverQuotes) {
  // Resolve conflicts (server data takes precedence)
  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = quotes.findIndex(localQuote => localQuote.text === serverQuote.text && localQuote.category === serverQuote.category);
    if (existingQuoteIndex !== -1) {
      // If a quote with the same text and category exists, update it if the server timestamp is newer
      if (serverQuote.timestamp > quotes[existingQuoteIndex].timestamp) {
        quotes[existingQuoteIndex] = serverQuote;
      }
    } else {
      // If the quote doesn't exist locally, add it
      quotes.push(serverQuote);
    }
  });
  // Update the UI and local storage
  saveQuotesToLocalStorage();
  populateCategories();
  showRandomQuote();
  // Display a notification (optional)
  // alert("Quotes synced with server.");
}
// Function to initiate the syncing process
function syncData() {
  fetchQuotesFromServer();
  lastSyncedTimestamp = Date.now();
  // Set up a timer to sync again periodically (e.g., every 10 seconds)
  setTimeout(syncData, 10000);
}
// Load quotes from local storage on page load
loadQuotesFromLocalStorage();
// Display a random quote on page load
showRandomQuote();
// Event listener for the 'Show New Quote' button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Add buttons for export and import
const exportButton = document.createElement('button');
exportButton.textContent = 'Export Quotes';
exportButton.addEventListener('click', exportToJsonFile);
document.body.appendChild(exportButton);
const importInput = document.createElement('input');
importInput.type = 'file';
importInput.id = 'importFile';
importInput.accept = '.json';
importInput.addEventListener('change', importFromJsonFile);
document.body.appendChild(importInput);

// Start the syncing process
syncData();