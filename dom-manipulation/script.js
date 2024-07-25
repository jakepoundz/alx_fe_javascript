// Array to store quote objects (initially empty)
let quotes = [];
// Function to load quotes from local storage
function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // If no quotes are stored, use default quotes
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Strive not to be a success, but rather to be of value.", category: "Success" }
    ];
  }
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
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    saveQuotesToLocalStorage(); // Save to local storage
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