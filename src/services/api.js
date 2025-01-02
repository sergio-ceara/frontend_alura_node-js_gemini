//export const API_URL = "http://192.168.3.6:3000";
export const API_URL = "https://backendaluranode-jsgemini-1072465127874.southamerica-east1.run.app";

export const api = {
  getPosts: async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar posts: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      return { error: error.message };
    }
  },
  getClusters: async () => await fetch(`${API_URL}/clusters`).then((res) => res.json()),
  getPostById: async (id) => await fetch(`${API_URL}/posts/${id}`).then((res) => res.json()),
  createPost: async (data) => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        body: data, // Envia os dados no formato correto
      });
      if (!response.ok) {
        //throw new Error(`Erro ao criar post: ${response.statusText}`);
      }  
      const result = await response.json();
      console.log("Resposta do servidor:", result);
      return result;
    } catch (error) {
      console.error("Erro ao enviar a requisição:", error);
      return { error: error.message };
    }
  },
  updatePost: async (data) => {
    try {
      const response = await fetch(`${API_URL}/posts/${data.get('_id')}`, {
        method: "PUT",
        body: data, // Envia os dados no formato correto
      });
      const result = await response.json();
      console.log("updatePost: ", result);
      return result;
    } catch (error) {
      console.error("Erro ao enviar a requisição:", error);
      return { error: error.message };
    }
  },
  deletePost: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
  deleteAllPosts: async () => {
    const response = await fetch(`${API_URL}/posts`, {
      method: "DELETE",
    });
    return response.json();
  },
};
