const container = document.getElementById('indicadores');

// Delegação de eventos para os botões
container.addEventListener('click', (event) => {
  const target = event.target.closest('button');

  if (!target) return;

  // Botão de adicionar
  if (target.classList.contains('adicionar')) {
    adicionarIndicador();
  }

  // Botão de remover
  if (target.classList.contains('remover')) {
    removerIndicador(target.closest('.indicador'));
  }
});

function adicionarIndicador() {
  const indicadores = container.querySelectorAll('.indicador');
  const ultimo = indicadores[indicadores.length - 1];

  // Clona o último
  const clone = ultimo.cloneNode(true);

  // Limpa os valores do clone
  clone.querySelector('input[type="text"]').value = '';
  clone.querySelector('input[type="number"]').value = '';

  // Remove o botão de adicionar do anterior
  ultimo.querySelector('.adicionar').remove();

  // Adiciona o clone no container
  container.appendChild(clone);
}

function removerIndicador(indicador) {
  const todos = container.querySelectorAll('.indicador');

  // Só remove se tiver mais de 1
  if (todos.length > 1) {
    const isUltimo = indicador.querySelector('.adicionar') !== null;

    indicador.remove();

    // Se o que foi removido era o último, coloca o + no novo último
    if (isUltimo) {
      const novoUltimo = container.querySelector('.indicador:last-child');
      const acoes = novoUltimo.querySelector('.acoes');

      const botaoAdicionar = document.createElement('button');
      botaoAdicionar.className = 'adicionar';
      botaoAdicionar.type = 'button';
      botaoAdicionar.innerHTML = '<img src="../../assets/icons/+.png" alt="Adicionar" />';

      acoes.appendChild(botaoAdicionar);
    }
  }
}
