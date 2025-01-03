//const express = require('express');
import express from 'express';

const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve arquivos estáticos do diretório 'dist' gerado pelo Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Para todas as outras rotas, retornar o arquivo 'index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
