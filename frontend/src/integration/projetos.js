document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".custom-select").forEach((select) => {
    new Choices(select, {
      searchEnabled: false,
      itemSelectText: "",
      shouldSort: false,
    });
  });

  const searchInput = document.querySelector("#pesquisar-projeto");
  const cursoSelect = document.querySelector("select.curso");
  const statusSelect = document.querySelector("select.status");
  const palavrasSelect = document.querySelector("select.palavras-chave");
  const projetosGrid = document.querySelector(".projetos-grid");
  const projetos = Array.from(projetosGrid.querySelectorAll("article"));

  function filtrarProjetos() {
    const searchText = searchInput.value.toLowerCase().trim();
    const cursoValue = cursoSelect.value;
    const statusValue = statusSelect.value;
    const palavrasValue = palavrasSelect.value;

    let projetosVisiveis = 0;

    projetos.forEach((projeto) => {
      const titulo = projeto.querySelector("h3").textContent.toLowerCase();
      const descricao = projeto.querySelector("p").textContent.toLowerCase();
      const curso = projeto.dataset.curso; 
      const status = projeto.dataset.status; 
      const palavras = projeto.dataset.palavras; 

      const matchesSearch = searchText === "" || titulo.includes(searchText) || descricao.includes(searchText);
      const matchesCurso = cursoValue === "" || curso.includes(cursoValue);
      const matchesStatus = statusValue === "" || status.includes(statusValue);
      const matchesPalavras = palavrasValue === "" || palavras.includes(palavrasValue);

      if (matchesSearch && matchesCurso && matchesStatus && matchesPalavras) {
        projeto.style.display = "block";
        projetosVisiveis++;
      } else {
        projeto.style.display = "none";
      }
    });

    let noResults = projetosGrid.querySelector(".no-results");
    if (projetosVisiveis === 0 && searchText !== "") {
      if (!noResults) {
        noResults = document.createElement("p");
        noResults.className = "no-results";
        noResults.textContent = "Nenhum projeto encontrado.";
        noResults.style.textAlign = "center";
        noResults.style.gridColumn = "1 / -1"; 
        noResults.style.marginTop = "20px";
        projetosGrid.appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  searchInput.addEventListener("input", filtrarProjetos);
  cursoSelect.addEventListener("change", filtrarProjetos);
  statusSelect.addEventListener("change", filtrarProjetos);
  palavrasSelect.addEventListener("change", filtrarProjetos);

  filtrarProjetos();
});