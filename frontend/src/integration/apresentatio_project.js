const mockProjetos = [
  {
    id: 1,
    title: 'Saúde PET',
    description: 'Melhorando os resultados de saúde em comunidades carentes.',
    curso: 'saude-coletiva',
    status: 'ativo',
    palavraChave: 'pet'
  },
  {
    id: 2,
    title: 'PID',
    description: 'Programa de inclusão digital.',
    curso: 'sistemas-de-informação',
    status: 'ativo',
    palavraChave: 'inclusao'
  },
  {
    id: 3,
    title: 'Tecnologia Verde',
    description: 'Iniciativa para promover tecnologia sustentável.',
    curso: 'engenharia-da-computacao',
    status: 'finalizado',
    palavraChave: 'tecnologia'
  }
];

if (!localStorage.getItem('projetos')) {
  localStorage.setItem('projetos', JSON.stringify(mockProjetos));
}

export function getProjetos() {
  return JSON.parse(localStorage.getItem('projetos')) || [];
}

export function salvarProjeto(novoProjeto) {
  const projetos = getProjetos();
  novoProjeto.id = Date.now();
  projetos.push(novoProjeto);
  localStorage.setItem('projetos', JSON.stringify(projetos));
}


