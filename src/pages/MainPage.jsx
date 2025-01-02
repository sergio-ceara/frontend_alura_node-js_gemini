import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate para navegação
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Estilos do Toast
import { api } from "../services/api";
import PostList from './PostList';
import PostForm from './PostForm';
import Saida from './Saida';
import './MainPage.css'; // Importando o arquivo CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function MainPage() {
  const [posts, setPosts] = useState([]);
  const [columnsPerRow, setColumnsPerRow] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    imagem: "",
    descricao: "",
    alt: "",
    imagemAnterior: ""
  });
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa
  const [selectedColumn, setSelectedColumn] = useState(1);  // Novo estado para a coluna selecionada
  const navigate = useNavigate(); // Usando o hook useNavigate
  // Função para normalizar os textos removendo acentos
  const normalizeText = (text) => {
    return text
      .normalize("NFD") // Normaliza para a forma decompositiva
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
      .toLowerCase(); // Transforma em minúsculo
  }

  // Busca os posts ao carregar o componente
  useEffect(() => {
    fetchPosts();
  }, []);

  // Chama automaticamente a função handleColumnsChange(1) se a tela for menor que 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        handleColumnsChange(1); // Define 1 coluna automaticamente
      } else {
        handleColumnsChange(4); // Define 4 coluna automaticamente
      }
    };

    // Executa na montagem do componente
    handleResize();

    // Adiciona o event listener para o resize da janela
    window.addEventListener('resize', handleResize);

    // Limpeza do event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []); // O useEffect é executado uma vez quando o componente é montado

  const fetchPosts = useCallback(async () => {
    try {
      const result = await api.getPosts();
      setPosts(result);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      toast.error("Erro ao carregar posts. Tente novamente mais tarde.", {
        position: "bottom-right",
        closeOnClick: true,
        draggable: true,
        className: 'toast-error',
      });
    }
  }, []);

  const handleColumnsChange = (num) => {
    setColumnsPerRow(num);
    setSelectedColumn(num);  // Atualiza o estado de seleção ao mudar a coluna
  };

  const toggleFormVisibility = (show, post = null) => {
    setIsFormVisible(show);
    
    if (!show) {
      setCurrentPost({
        _id: "",
        imagem: "",
        descricao: "",
        alt: "",
        imagemAnterior: ""
      });
    } else if (post) {
      const { imagem, descricao, alt, _id } = post;
      setCurrentPost(prevState => ({
        ...prevState,
        imagem: imagem || prevState.imagem,
        descricao: descricao || prevState.descricao,
        alt: alt || prevState.alt,
        _id,
        imagemAnterior: imagem // Armazena a imagem atual antes da edição
      }));
    }
    
    setIsEditMode(!!post);
  };

  const handleSair = () => {
    console.log("handleSair: passou");
    navigate("/Saida", { replace: true }); // Redireciona para a página de saída sem permitir voltar atrás
  };

  // Filtra os posts com base no termo de pesquisa, incluindo 'descricao' e 'alt'
  const filteredPosts = posts.filter(post => {
    const normalizedDescricao = normalizeText(post.descricao);
    const normalizedAlt = normalizeText(post.alt);
    const normalizedSearchTerm = normalizeText(searchTerm);

    return normalizedDescricao.includes(normalizedSearchTerm) || 
           normalizedAlt.includes(normalizedSearchTerm);
  });

  return (
    <div className="main-container">
      {/* Header com navegação */}
      <header className="header p-3">
      <div className="container-fluid">
          {/* Linha 1: Título à esquerda, Botões à direita */}
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <h1 className="h1_title">Lista de posts</h1>
            </div>
            <div className="col-12 col-md-6 text-end">
              <button className="btn-include"
                onClick={() => toggleFormVisibility(true)}>Incluir post</button>
            </div>
          </div>
          {/* Linha 2: Campo de pesquisa */}
          <div className="row">
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar por descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de pesquisa
              />
            </div>
            <div className="col-12 col-md-6 text-end btn-group">
              <label className="label-small">Colunas:</label>
              {["1", "2", "3", "4"].map((col) => (
                <button 
                  className={`button-col ${selectedColumn === Number(col) ? 'selected' : ''}`} // Classe condicional
                  key={col} 
                  onClick={() => handleColumnsChange(Number(col))}>
                  {col} 
                </button>
              ))}
            </div>
          </div>          
        </div>

      </header>

      {/* Conteúdo principal */}
      <div className="content">
        <PostList 
          posts={filteredPosts} 
          toggleFormVisibility={toggleFormVisibility} 
          fetchPosts={fetchPosts} 
          columnsPerRow={columnsPerRow}
        />

        {/* Formulário de Post */}
        {isFormVisible && (
          <PostForm 
            currentPost={currentPost}
            setCurrentPost={setCurrentPost}
            isEditMode={isEditMode}
            toggleFormVisibility={toggleFormVisibility}
            fetchPosts={fetchPosts}
          />
        )}

        {/* Toast Notifications */}
        <ToastContainer />
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-info">
          <label className="footer-chave">curso:</label>
          <label className="footer-valor">Imersão Dev Back-End com Alura e Google Gemini.</label>
        </div>
        <div className="footer-info">
          <label className="footer-chave">aluno:</label>
          <label className="footer-valor">Sérgio Sousa</label>
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/sérgio-sousa-948447133" target="_blank" aria-label="Visite meu perfil no LinkedIn">
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>
            <a href="https://github.com/sergio-ceara/" target="_blank" aria-label="Visite meu GitHub">
              <i className="fab fa-github"></i> GitHub
            </a>
            <div className="footer-sair-div">
              <button className="footer-sair-button" onClick={handleSair}>sair</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;
