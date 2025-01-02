import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PostForm.css';
import { api } from "../services/api";

const PostForm = ({ currentPost, setCurrentPost, isEditMode, toggleFormVisibility, fetchPosts }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file && allowedTypes.includes(file.type)) {
      if (file.size <= 4 * 1024 * 1024) {  // Limite de 4MB
        setCurrentPost((prevState) => ({
          ...prevState,
          imagem: file
        }));
      } else {
        toast.warn("O arquivo é muito grande. O tamanho máximo permitido é 4MB.",{
          className: 'toast-warning',
          position: "bottom-right"
        });
      }
    } else {
      toast.error("Por favor, selecione uma imagem válida (JPG, PNG, JPEG).",{
        className: 'toast-error',
        position: "bottom-right",
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    try {
      if (isEditMode) {
        formData.append("_id", currentPost._id);
        formData.append("descricao", currentPost.descricao);
        formData.append("alt", currentPost.alt);
        if (currentPost.imagem && currentPost.imagem.name !== currentPost.imagemAnterior) {
          formData.append("imagem", currentPost.imagem);
          formData.append("imagemAnterior", currentPost.imagemAnterior);
        }
        await api.updatePost(formData);
        toast.success("Post alterado com sucesso.",{
          className: 'toast-sucess',
          position: "bottom-right"
        });
      } else {
        formData.append("descricao", currentPost.descricao);
        formData.append("alt", currentPost.alt);
        if (currentPost.imagem instanceof File) {
          formData.append("imagem", currentPost.imagem);
        }
        await api.createPost(formData);
        toast.success("Post acrescentado com sucesso.",{
          className: 'toast-sucess',
          position: "bottom-right"
        });
      }

      toggleFormVisibility(false);
      setCurrentPost({ _id: "", imagem: "", descricao: "", alt: "", imagemAnterior: "" });
      fetchPosts();
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      toast.error("Erro ao salvar post. Tente novamente.",{
        position: "bottom-right",
        className: 'toast-sucess',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h3>{isEditMode ? "Editar Post" : "Incluir Novo Post"}</h3>

      <div>
        <button 
          className="selecionar" 
          onClick={() => document.getElementById("imageInput").click()}
        >
          Selecionar imagem
        </button>
      </div>
      <div>
        <textarea 
          className="textarea-imagem" 
          readOnly
          value={currentPost.imagem ? (currentPost.imagem.name || currentPost.imagem) : ""}
          onClick={() => document.getElementById("imageInput").click()}
        />
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>

      <div>
        <label>Descrição:</label>
        <textarea
          className="textarea-descricao"
          value={currentPost.descricao}
          onChange={(e) => setCurrentPost({ ...currentPost, descricao: e.target.value })}
        />
      </div>

      <div>
        <label>Texto Alternativo:</label>
        <textarea
          className="textarea-alt"
          value={currentPost.alt}
          onChange={(e) => setCurrentPost({ ...currentPost, alt: e.target.value })}
        />
      </div>

      <div className="form-buttons">
        <button className="save" onClick={handleSubmit} disabled={isLoading}>
          {isEditMode ? "Atualizar" : "Salvar"}
        </button>
        <button className="cancel" onClick={() => toggleFormVisibility(false)} disabled={isLoading}>
          Cancelar
        </button>
      </div>

      {isLoading && <div className="loading-message">Aguarde gravando...</div>}
    </div>
  );
};

export default PostForm;
