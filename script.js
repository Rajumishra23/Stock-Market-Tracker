window.onload = function () {
  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
      alert("Please enter a valid search query.");
      return;
    }

    if (!query.match(/^[a-zA-Z\s]+$/)) {
      alert("Please enter a valid company name.");
      return;
    }

    fetchCompanySymbol(query);
  });

  async function fetchCompanySymbol(query) {
    const apiKey = "d013mopr01qv3oh2gg60d013mopr01qv3oh2gg6g";
    const searchUrl = `https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`;

    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "<p>Loading matches...</p>";

    try {
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.result && data.result.length > 0) {
        const filtered = data.result.filter(item =>
          item.description.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
          resultsContainer.innerHTML = "<p>No matching companies found.</p>";
          return;
        }

        resultsContainer.innerHTML = "<h3>Matching Companies:</h3>";
        filtered.forEach(item => {
          const div = document.createElement("div");
          div.className = "result";
          div.innerHTML = `
            <h4>${item.description}</h4>
            <p><strong>Symbol:</strong> ${item.symbol}</p>
            <button class="stock-fetch" data-symbol="${item.symbol}">Get Stock Data</button>
          `;
          resultsContainer.appendChild(div);
        });

        addQuoteListeners(apiKey);
      } else {
        resultsContainer.innerHTML = "<p>No results found.</p>";
      }
    } catch (error) {
      console.error("Search API Error:", error);
      resultsContainer.innerHTML = "<p>Failed to fetch company data.</p>";
    }
  }

  function addQuoteListeners(apiKey) {
    const buttons = document.querySelectorAll(".stock-fetch");

    buttons.forEach(button => {
      button.addEventListener("click", async () => {
        const symbol = button.getAttribute("data-symbol");
        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

        const stockInfo = {
          symbol: document.getElementById("symbol"),
          open: document.getElementById("open"),
          close: document.getElementById("close"),
          high: document.getElementById("high"),
          low: document.getElementById("low"),
          volume: document.getElementById("volume")
        };

        stockInfo.symbol.textContent = `Symbol: ${symbol}`;
        stockInfo.open.textContent = "Fetching...";
        stockInfo.close.textContent = "";
        stockInfo.high.textContent = "";
        stockInfo.low.textContent = "";
        stockInfo.volume.textContent = "";

        try {
          const response = await fetch(quoteUrl);
          const quote = await response.json();

          stockInfo.open.textContent = `Open: $${quote.o}`;
          stockInfo.close.textContent = `Close: $${quote.pc}`;
          stockInfo.high.textContent = `High: $${quote.h}`;
          stockInfo.low.textContent = `Low: $${quote.l}`;
          stockInfo.volume.textContent = `Volume: ${quote.v}`;
        } catch (err) {
          console.error("Quote API Error:", err);
          stockInfo.open.textContent = "Failed to fetch stock data.";
        }
      });
    });
  }
};
