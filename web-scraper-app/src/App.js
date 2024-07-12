import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [maxCount, setMaxCount] = useState(1);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/scrape', {
                searchQuery,
                maxCount
            });
            setResults(response.data);
        } catch (error) {
            console.error("Erro ao realizar scraping:", error);
        }
        setLoading(false);
    };

    return (
        <div className="App">
            <h1>Teste Neogrid Web Scraper</h1>
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
            <div>
                {results.map((result, index) => (
                    <div key={index} style={{ border: '1px solid #000', margin: '10px', padding: '10px' }}>
                        <h2>{result.title}</h2>
                        <p>Preço: {result.price}</p>
                        <img src={result.imageUrl} alt={result.title} width="100" />
                        <p>{result.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
