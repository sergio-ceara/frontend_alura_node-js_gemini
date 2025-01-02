import React from 'react';
import './Saida.css'; // Importando o arquivo CSS

const Saida = () => {
  return (
    <div className="saida-container">
      <div className="saida-content">
        <h1>Saída Bem-Sucedida!</h1>
        <p className="saida-message">Agradecemos por utilizar nossa aplicação. Esperamos vê-lo novamente em breve!</p>
        <p className="saida-link">
          Clique <a href="/" className="link-retorno">aqui</a> para voltar à página inicial.
        </p>
      </div>
    </div>
  );
};

export default Saida;
