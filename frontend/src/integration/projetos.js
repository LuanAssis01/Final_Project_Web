document.addEventListener("DOMContentLoaded", () => {
  // Inicializa Choices.js para os selects (seu código original, está correto)
  document.querySelectorAll(".custom-select").forEach((select) => {
    new Choices(select, {
      searchEnabled: false,
      itemSelectText: "",
      shouldSort: false,
    });
  });

  // Seleciona elementos do DOM
  const searchInput = document.querySelector("#pesquisar-projeto");
  // É importante pegar o <select> original, e não o container do Choices.js
  const cursoSelect = document.querySelector("select.curso");
  const statusSelect = document.querySelector("select.status");
  const palavrasSelect = document.querySelector("select.palavras-chave");
  const projetosGrid = document.querySelector(".projetos-grid");
  const projetos = Array.from(projetosGrid.querySelectorAll("article"));

  // Função para filtrar projetos
  function filtrarProjetos() {
    const searchText = searchInput.value.toLowerCase().trim();
    const cursoValue = cursoSelect.value;
    const statusValue = statusSelect.value;
    const palavrasValue = palavrasSelect.value;

    let projetosVisiveis = 0;

    projetos.forEach((projeto) => {
      // Dados do HTML
      const titulo = projeto.querySelector("h3").textContent.toLowerCase();
      const descricao = projeto.querySelector("p").textContent.toLowerCase();
      const curso = projeto.dataset.curso; // lê data-curso
      const status = projeto.dataset.status; // lê data-status
      const palavras = projeto.dataset.palavras; // lê data-palavras

      // Verifica se o projeto corresponde aos filtros
      const matchesSearch = searchText === "" || titulo.includes(searchText) || descricao.includes(searchText);
      const matchesCurso = cursoValue === "" || curso.includes(cursoValue);
      const matchesStatus = statusValue === "" || status.includes(statusValue);
      const matchesPalavras = palavrasValue === "" || palavras.includes(palavrasValue);

      // Exibe ou esconde o projeto
      if (matchesSearch && matchesCurso && matchesStatus && matchesPalavras) {
        projeto.style.display = "block";
        projetosVisiveis++;
      } else {
        projeto.style.display = "none";
      }
    });

    // Exibe mensagem se nenhum projeto for encontrado
    let noResults = projetosGrid.querySelector(".no-results");
    if (projetosVisiveis === 0 && searchText !== "") {
      if (!noResults) {
        noResults = document.createElement("p");
        noResults.className = "no-results";
        noResults.textContent = "Nenhum projeto encontrado.";
        noResults.style.textAlign = "center";
        noResults.style.gridColumn = "1 / -1"; // Faz a mensagem ocupar a largura toda do grid
        noResults.style.marginTop = "20px";
        projetosGrid.appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  // Adiciona eventos de mudança aos filtros
  searchInput.addEventListener("input", filtrarProjetos);
  cursoSelect.addEventListener("change", filtrarProjetos);
  statusSelect.addEventListener("change", filtrarProjetos);
  palavrasSelect.addEventListener("change", filtrarProjetos);

  // Garante que a filtragem inicial ocorra caso os selects tenham valores pré-selecionados
  filtrarProjetos();
});