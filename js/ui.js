import api from "./request-api.js";

const ui = {
  async preencherFormulario(pensamentoId) {
    const pensamento = await api.buscarPensamentoPorId(pensamentoId);

    document.getElementById("pensamento-id").value = pensamento.id;
    document.getElementById("pensamento-conteudo").value = pensamento.conteudo;
    document.getElementById("pensamento-autoria").value = pensamento.autoria;
    document.getElementById("form-container").scrollIntoView();
    document.getElementById("pensamento-data").value = pensamento.data
      .toISOString()
      .split("T")[0];
  },

  async renderAPI(pensamentosFiltrados = null) {
    const listaDePensamentos = document.getElementById("lista-pensamentos");
    const mensagemVazia = document.getElementById("mensagem-vazia");
    listaDePensamentos.innerHTML = "";

    try {
      if (!pensamentosFiltrados) {
        pensamentosFiltrados = await api.requestAPI();
      }

      if (pensamentosFiltrados.length === 0) {
        mensagemVazia.style.display = "block";
      } else {
        mensagemVazia.style.display = "none";
        pensamentosFiltrados.forEach(ui.adicionarPensamentoNaLista);
      }
    } catch {
      alert("Erro ao carregar pensamentos");
      mensagemVazia.style.display = "block";
    }
  },
  adicionarPensamentoNaLista(pensamento) {
    const listaDePensamentos = document.getElementById("lista-pensamentos");

    const li = document.createElement("li");
    li.setAttribute("data-id", pensamento.id);
    li.classList.add("li-pensamento");

    const img = document.createElement("img");
    img.src = "assets/imagens/aspas-azuis.png";
    img.alt = "Aspas azuis";
    img.classList.add("icone-aspas");

    const pensamentoCaixa = document.createElement("div");
    pensamentoCaixa.classList.add("pensamento-caixa");

    const pensamentoConteudo = document.createElement("div");
    pensamentoConteudo.classList.add("pensamento-conteudo");
    pensamentoConteudo.textContent = pensamento.conteudo;

    const pensamentoAutoria = document.createElement("div");
    pensamentoAutoria.classList.add("pensamento-autoria");
    pensamentoAutoria.textContent = pensamento.autoria;

    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };
    const pensamentoData = document.createElement("div");
    const dataFormatada = pensamento.data.toLocaleDateString("pt-br", options);
    const dataRegex = dataFormatada.replace(/^\w/, (match) =>
      match.toUpperCase()
    );
    pensamentoData.textContent = dataRegex;
    pensamentoData.classList.add("pensamento-data");

    const botaoEditar = document.createElement("button");
    botaoEditar.classList.add("botao-editar");
    botaoEditar.onclick = () => ui.preencherFormulario(pensamento.id);

    const iconeEditar = document.createElement("img");
    iconeEditar.src = "assets/imagens/icone-editar.png";
    iconeEditar.alt = "Editar pensamento";
    botaoEditar.appendChild(iconeEditar);

    const botaoFavorito = document.createElement("button");
    botaoFavorito.classList.add("botao-favorito");
    botaoFavorito.onclick = async () => {
      try {
        await api.atualizarFavorito(pensamento.id, !pensamento.favorito);
      } catch (error) {
        alert("Erro ao atualizar favorito;");
        throw Error;
      }
    };

    const iconeFavorito = document.createElement("img");
    iconeFavorito.src = pensamento.favorito
      ? "assets/imagens/icone-favorito.png"
      : "assets/imagens/icone-favorito_outline.png";
    iconeFavorito.alt = "Favoritar pensamento";
    botaoFavorito.appendChild(iconeFavorito);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.classList.add("botao-excluir");
    botaoExcluir.onclick = async () => {
      try {
        await api.deleteAPI(pensamento.id);
        ui.renderAPI();
      } catch (error) {
        alert("Erro ao excluir pensamento");
      }
    };

    const iconeExcluir = document.createElement("img");
    iconeExcluir.src = "assets/imagens/icone-excluir.png";
    iconeExcluir.alt = "Excluir pensamento";
    botaoExcluir.appendChild(iconeExcluir);

    const icones = document.createElement("div");
    icones.classList.add("icones");
    icones.append(botaoFavorito, botaoEditar, botaoExcluir);

    pensamentoCaixa.append(
      pensamentoConteudo,
      pensamentoAutoria,
      pensamentoData
    );
    li.append(img, pensamentoCaixa, icones);
    listaDePensamentos.append(li);
  },
};

export default ui;
