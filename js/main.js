import ui from "./ui.js";
import api from "./request-api.js";

document.addEventListener("DOMContentLoaded", () => {
    ui.renderAPI();

    const formularioPensamento = document.getElementById("pensamento-form");
    const btnCancelar = document.getElementById("botao-cancelar");
    const inputPesquisa = document.getElementById("campo-busca");

    formularioPensamento.addEventListener("submit", subirPensamento);

    btnCancelar.onclick = () => {
        formularioPensamento.reset();
    };

    inputPesquisa.addEventListener("input", realizarBusca);
})

async function subirPensamento(event) {
    event.preventDefault();
    const id = document.getElementById("pensamento-id").value;
    const conteudo = document.getElementById("pensamento-conteudo").value;
    const autoria = document.getElementById("pensamento-autoria").value;
    const data = document.getElementById("pensamento-data").value;

    if (!validarData(data)) {
        alert("Impossível inserir datas futuras. Insira uma data válida.");
        return
    }

    try {
        if (id) {
            await api.putAPI({id, conteudo, autoria, data});
        } else {
            await api.postAPI({ conteudo, autoria, data})
        }
    
        ui.renderAPI() 
    } catch {
        alert("Erro ao postar Pensamento")
    }
}

async function realizarBusca() {
    const termoBuscado = document.getElementById("campo-busca").value;

    try {
        const pensamentosFiltrados = await api.buscarPensamentoPorTermo(termoBuscado);
        ui.renderAPI(pensamentosFiltrados);
    } catch (error) {
        alert("Erro ao realizar a busca");
        throw Error
    }
}

function validarData(data) {
    const dataAtual = new Date();
    const dataInserida = new Date(data);
    return dataAtual >= dataInserida
}