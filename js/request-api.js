const URL_BASE = axios.create({
    baseURL: 'http://localhost:3000'
})
const converterStringParaData = (dataString) => {
  const [ano, mes, dia] = dataString.split("-")
  return new Date(Date.UTC(ano, mes-1, dia))
}

const api = {
    async requestAPI() {
        try {
            const response = await URL_BASE.get(`pensamentos`);
            const pensamentos = await response.data;

            return pensamentos.map(pensamento => {
                return {
                    ...pensamento,
                    data: new Date(pensamento.data)
                }
            })
        } catch {
            alert("Erro ao buscar pensamentos na API");
            throw Error 
        }
    }, 
    async postAPI(pensamento) {
        try {
            const data = converterStringParaData(pensamento.data);
            const response = await URL_BASE.post(`pensamentos`, {
                ...pensamento,
                data: data.toISOString()
            })
            return await response.data;
        } catch {
            alert("Erro ao postar pensamento")
            throw Error 
        }
    },
    async buscarPensamentoPorId(id) {
        try {
            const response = await URL_BASE.get(`pensamentos/${id}`);
            const pensamento = await response.data;

            return {
                ...pensamento,
                data: new Date(pensamento.data)
            }
        } catch {
            alert("Erro ao buscar pensamento por ID");
            throw Error 
        }
    },
    async putAPI(pensamento) {
        try {
            const data = converterStringParaData(pensamento.data)
            const response = await URL_BASE.put(`pensamentos/${pensamento.id}`, {
                ...pensamento,
                data
            });
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
    }, 
    
    async atualizarFavorito(id, favorito) {
        try {
            const response = await URL_BASE.patch(`pensamentos/${id}`, {favorito})
            return response.data;
        } catch (error) {
            alert("Erro ao favoritar pensamento.")
            throw Error
        }
    }
}

export default api