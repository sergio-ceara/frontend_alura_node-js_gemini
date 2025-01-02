import React from 'react';
import { toast } from 'react-toastify';
import { api, API_URL } from "../services/api";
import './PostList.css';

const PostList = ({ posts, toggleFormVisibility, fetchPosts, columnsPerRow  }) => {
  const handleDelete = async (id) => {
    try {
      await api.deletePost(id);
      fetchPosts();
      toast.success("Post excluído com sucesso.",{
        position: "bottom-right",
        className: 'toast-sucess',
      });
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      toast.error("Erro ao excluir post. Tente novamente.",{
        position: "bottom-right",
        className: 'toast-sucess',
      });
    }
  };

  const getImageUrl = (post) => {
    const postId = post._id;
    const imageExtension = post.imagem && post.imagem.split(".").pop();
    return post.imagem
      ? `${API_URL}/${postId}.${imageExtension}`
      : `${API_URL}/sem-imagem.png`;
  };

  // Classe para a grid baseada no número de colunas
  const gridClass = `grid-${columnsPerRow}`;  

  return (
    <div className={`posts-container ${gridClass}`}>
      {posts.map((post) => (
        <div className="post-card" key={post._id}>
          <img
            className="post-imagem"
            src={getImageUrl(post)}
            height="200"
            width="300"
          />
          <div className="post-descricao">{post.descricao}</div>
          <div className="actions-container">
            <button onClick={() => toggleFormVisibility(true, post)}>Editar</button>
            <button onClick={() => handleDelete(post._id)}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;