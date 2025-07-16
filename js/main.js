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

    try {
        if (id) {
            await api.putAPI({id, conteudo, autoria});
        } else {
            await api.postAPI({ conteudo, autoria})
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