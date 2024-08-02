import React, { useState } from "react";
import axios from "axios";
import CardProducts from "./card_podcts";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxCount, setMaxCount] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/scrape", {
        searchQuery,
        maxCount,
      });
      setResults(response.data);
    } catch (error) {
      console.error("Erro ao realizar scraping:", error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Web Scraper</h1>
      </div>
      <div>
        <input
          type="text"
          placeholder="O que você quer procurar?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantos produtos você quer chamar?"
          value={maxCount}
          onChange={(e) => setMaxCount(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      {loading && <p>Carregando...</p>}
      <div className="card-container">
        {results.map((product, index) => (
          <CardProducts key={index} card_podcts={product} />
        ))}
      </div>
    </div>
  );
}

export default App;
