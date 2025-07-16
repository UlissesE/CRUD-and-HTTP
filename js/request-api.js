const URL_BASE = axios.create({
    baseURL: 'http://localhost:3000'
})

const api = {
    async requestAPI() {
        try {
            const response = await URL_BASE.get(`pensamentos`);
            return await response.data;
        } catch {
            alert("Erro ao buscar pensamentos");
            throw Error 
        }
    }, 
    async postAPI(pensamento) {
        try {
            const response = await URL_BASE.post(`pensamentos`, pensamento)
            return await response.axios;
        } catch {
            alert("Erro ao postar pensamento")
            throw Error 
        }
    },
    async buscarPensamentoPorId(id) {
        try {
            const response = await URL_BASE.get(`pensamentos/${id}`);
            return await response.data;
        } catch {
            alert("Erro ao buscar pensamento por ID");
            throw Error 
        }
    },
    async putAPI(pensamento) {
        try {
            const response = await URL_BASE.put(`pensamentos/${pensamento.id}`, pensamento);
            return await response.data;
        } catch {
            alert("Erro ao editar pensamento")
            throw Error 
        }
    },
    async deleteAPI(id) {
        try {
            const response = await URL_BASE.delete(`pensamentos/${id}`);
        } catch {
            alert("Erro ao excluir pensamento");
            throw Error 
        }
    },

    async buscarPensamentoPorTermo(termo) {
        try {
            const pensamentos = await this.requestAPI();
            const termoFormatado = termo.toLowerCase();
            
            const pensamentosFiltrados = pensamentos.filter(pensamento => {
                return pensamento.conteudo.toLowerCase().includes(termoFormatado) || 
                pensamento.autoria.toLowerCase().includes(termoFormatado)
            })
            return pensamentosFiltrados;
        } catch (error) {
            alert("Erro ao filtrar pensamentos pesquisados")
            throw Error
        }
    }
}

export default api