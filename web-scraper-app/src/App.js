import React, { useState, useEffect } from "react";
import axios from "axios";
import CardProducts from "./card_podcts";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxCount, setMaxCount] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrapingResult, setScrapingResult] = useState(null);
  const [availableFiles, setAvailableFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  // Carrega lista de arquivos disponíveis
  const loadAvailableFiles = async () => {
    try {
      const response = await axios.get("http://localhost:5001/files");
      setAvailableFiles(response.data);
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
    }
  };

  // Carrega arquivos disponíveis ao montar o componente
  useEffect(() => {
    loadAvailableFiles();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setScrapingResult(null);
    try {
      const response = await axios.post("http://localhost:5001/scrape", {
        searchQuery,
        maxCount: parseInt(maxCount),
      });
      
      setResults(response.data.products);
      setScrapingResult(response.data);
      
      // Recarrega a lista de arquivos
      await loadAvailableFiles();
    } catch (error) {
      console.error("Erro ao realizar scraping:", error);
      alert("Erro ao realizar scraping. Verifique se o backend está funcionando.");
    }
    setLoading(false);
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5001/download/${filename}`, {
        responseType: 'blob',
      });
      
      // Cria um link temporário para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer download:", error);
      alert("Erro ao fazer download do arquivo");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="App">
      <div className="header">
        <h1>🔍 Web Scraper - Mineração de Texto</h1>
        <p>Extraia dados de produtos e salve em CSV/TXT para análise</p>
      </div>
      
      <div className="search-container">
        <div className="input-group">
          <input
            type="text"
            placeholder="O que você quer procurar? (ex: tênis, camiseta)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <input
            type="number"
            placeholder="Quantos produtos? (máx: 20)"
            value={maxCount}
            min="1"
            max="20"
            onChange={(e) => setMaxCount(e.target.value)}
            className="count-input"
          />
          <button 
            onClick={handleSearch} 
            disabled={loading || !searchQuery}
            className="search-button"
          >
            {loading ? "🔄 Extraindo..." : "🚀 Buscar"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Realizando web scraping... Por favor, aguarde.</p>
        </div>
      )}

      {scrapingResult && (
        <div className="scraping-summary">
          <h2>✅ Extração Concluída!</h2>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-number">{scrapingResult.summary.totalProducts}</span>
              <span className="stat-label">Produtos Extraídos</span>
            </div>
            <div className="stat">
              <span className="stat-number">2</span>
              <span className="stat-label">Arquivos Gerados</span>
            </div>
          </div>
          
          <div className="generated-files">
            <h3>📁 Arquivos Gerados</h3>
            <div className="file-downloads">
              <div className="file-item">
                <span className="file-icon">📊</span>
                <div className="file-info">
                  <strong>{scrapingResult.files.csv}</strong>
                  <small>Dados estruturados em CSV</small>
                </div>
                <button 
                  onClick={() => handleDownload(scrapingResult.files.csv)}
                  className="download-btn csv"
                >
                  💾 CSV
                </button>
              </div>
              
              <div className="file-item">
                <span className="file-icon">📝</span>
                <div className="file-info">
                  <strong>{scrapingResult.files.txt}</strong>
                  <small>Texto otimizado para mineração</small>
                </div>
                <button 
                  onClick={() => handleDownload(scrapingResult.files.txt)}
                  className="download-btn txt"
                >
                  💾 TXT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="files-section">
        <div className="files-header">
          <h3>📂 Histórico de Extrações</h3>
          <button 
            onClick={() => setShowFiles(!showFiles)}
            className="toggle-files-btn"
          >
            {showFiles ? "▼ Ocultar" : "▶ Mostrar"} ({availableFiles.length} arquivos)
          </button>
        </div>
        
        {showFiles && (
          <div className="files-list">
            {availableFiles.length === 0 ? (
              <p className="no-files">Nenhum arquivo encontrado. Faça uma busca primeiro!</p>
            ) : (
              <div className="files-grid">
                {availableFiles.map((file, index) => (
                  <div key={index} className="file-card">
                    <div className="file-header">
                      <span className={`file-icon ${file.type}`}>
                        {file.type === 'csv' ? '📊' : '📝'}
                      </span>
                      <span className={`file-type ${file.type}`}>{file.type.toUpperCase()}</span>
                    </div>
                    <div className="file-details">
                      <h4>{file.name}</h4>
                      <div className="file-meta">
                        <span>📁 {formatFileSize(file.size)}</span>
                        <span>🕒 {formatDate(file.created)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload(file.name)}
                      className="download-btn"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="products-section">
        {results.length > 0 && (
          <>
            <h2>🛒 Produtos Encontrados</h2>
            <div className="card-container">
              {results.map((product, index) => (
                <CardProducts key={index} card_podcts={product} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="info-section">
        <h3>ℹ️ Como usar</h3>
        <div className="usage-steps">
          <div className="step">
            <span className="step-number">1</span>
            <p>Digite o termo de busca (ex: "tênis", "camiseta")</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <p>Escolha quantos produtos extrair (máximo 20)</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <p>Clique em "Buscar" e aguarde a extração</p>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <p>Faça download dos arquivos CSV/TXT gerados</p>
          </div>
        </div>
        
        <div className="file-info">
          <h4>📋 Sobre os arquivos gerados:</h4>
          <ul>
            <li><strong>CSV:</strong> Dados estruturados com títulos, preços, descrições, URLs e timestamps</li>
            <li><strong>TXT:</strong> Texto limpo e normalizado, ideal para mineração de texto e análise semântica</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
