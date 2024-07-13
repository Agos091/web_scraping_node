import React from "react";
import "./App.css";

function card_podcts({ card_podcts }) {
  return (
    <div className="card">
      {card_podcts.imageUrl && (
        <img src={card_podcts.imageUrl} alt={card_podcts.title} />
      )}
      <h2>{card_podcts.title || "Título não disponível"}</h2>
      <p className="price">
        Preço: {card_podcts.price || "Preço não disponível"}
      </p>
      <p>{card_podcts.description || "Descrição não disponível"}</p>
    </div>
  );
}

export default card_podcts;
