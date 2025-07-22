import ui from "./ui.js";
import api from "./request-api.js";

const regexConteudo = /^[A-Za-z\s]{10,}$/
const regexAutoria = /^[A-Za-z\s]{2,}$/

const pensamentoSet = new Set();

async function adicionarChaveAoPensamento() {
    try {
        const pensamentos = await api.requestAPI();
        pensamentos.forEach(pensamento => {
            const chaveNovoPensamento = 
            `${pensamento.conteudo.trim().toLowerCase()}-${pensamento.autoria.trim().toLowerCase()}`
            pensamentoSet.add(chaveNovoPensamento)
        });
    } catch (error) {
        alert("Erro ao adicionar chave ao pensamento")
    }
}

function removerEspaços(string) {
    return string.replaceAll(/\s+/g, '')
}

function validarConteudo(conteudo) {
    return regexConteudo.test(conteudo)
}

function validarAutoria(autoria) {
    return regexAutoria.test(autoria)
}

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
    
    const conteudoSemEspacos = removerEspaços(conteudo);
    const autoriaSemEspacos = removerEspaços(autoria);
    
    if (!validarData(data)) {
        alert("Impossível inserir datas futuras. Insira uma data válida.");
        return
    }
    
    if (!validarAutoria(autoriaSemEspacos)) {
        alert("Autoria com mínimo de duas letras.")
        return
    }
    if (!validarConteudo(conteudoSemEspacos)) {
        alert("Conteúdo com mínimo de 10 letras.")
        return
    }
    
    if (pensamentoSet.has(chaveNovoPensamento)) {
        alert("Esse pensamento já existe");
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