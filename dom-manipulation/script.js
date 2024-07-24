const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Be yourself; everyone else is already taken.", category: "Motivation" },
    { text: "Life is what happens when you are busy making other plans.", category: "Life" },
    
    // Add more quotes here
  ];
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  newQuoteButton.addEventListener("click", showRandomQuote);
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
  }
  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    `;
    return formContainer;
  }
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      // Clear input fields
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      showRandomQuote(); // Display the newly added quote
    } else {
      alert("Please fill in both quote and category fields.");
    }
  }
  // Call the function to create the form initially
  const addQuoteForm = createAddQuoteForm();
  document.body.appendChild(addQuoteForm);