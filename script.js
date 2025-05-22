function pegarDataLocalISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaEditando = null;

function atualizarListas() {
  const hoje = pegarDataLocalISO();
  const listaHoje = document.querySelector('#listaHoje');
  const listaEmBreve = document.querySelector('#listaEmBreve');
  const listaAtrasadas = document.querySelector('#listaAtrasadas');
  const todasHoje = document.querySelector('#tarefasHoje ul');
  const todasEmBreve = document.querySelector('#tarefasEmBreve ul');
  const todasAtrasadas = document.querySelector('#tarefasAtrasadas ul');

  const hojeTarefas = ordenarTarefas(tarefas.filter(t => t.dataTarefa === hoje));
  const emBreveTarefas = ordenarTarefas(tarefas.filter(t => t.dataTarefa > hoje));
  const atrasadasTarefas = ordenarTarefas(tarefas.filter(t => t.dataTarefa < hoje));

  renderizarTarefas(listaHoje, hojeTarefas);
  renderizarTarefas(listaEmBreve, emBreveTarefas);
  renderizarTarefas(listaAtrasadas, atrasadasTarefas);

  renderizarTarefas(todasHoje, hojeTarefas);
  renderizarTarefas(todasEmBreve, emBreveTarefas);
  renderizarTarefas(todasAtrasadas, atrasadasTarefas);
}

function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function renderizarTarefas(lista, tarefas) {
  lista.innerHTML = '';
  if (tarefas.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item text-center text-muted';
    li.textContent = 'Não há tarefas cadastradas';
    lista.appendChild(li);
    return;
  }

  tarefas.forEach((tarefa, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'd-flex justify-content-between align-items-center';

    const dados = document.createElement('div');
    dados.innerHTML = `
        <strong>${tarefa.titulo}</strong><br>
        <small><i class="bi bi-calendar3"></i> ${formatarDataBR(tarefa.dataTarefa)}</small><br>
        <small><span class="badge bg-${corPrioridade(tarefa.prioridade)}">${tarefa.prioridade}</span></small>
    `;

    const botoes = document.createElement('div');
    botoes.innerHTML = `
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="toggleDetalhes(this)">Detalhes</button>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editarTarefa(${index})">Editar</button>
        <button class="btn btn-sm btn-outline-danger" onclick="removerTarefa(${index})">Remover</button>
    `;

    cabecalho.appendChild(dados);
    cabecalho.appendChild(botoes);
    li.appendChild(cabecalho);

    const detalhes = document.createElement('div');
    detalhes.style.display = 'none';
    detalhes.className = 'mt-2 text-muted';
    detalhes.innerHTML = `
        <p><strong>Comentário:</strong> ${tarefa.comentario || 'Sem comentário'}</p>
    `;

    li.appendChild(detalhes);
    lista.appendChild(li);
  });
}

function corPrioridade(prioridade) {
  switch (prioridade) {
    case 'Alta': return 'danger';
    case 'Média': return 'warning';
    case 'Baixa': return 'success';
    default: return 'secondary';
  }
}

function toggleDetalhes(botao) {
  const detalhes = botao.parentElement.parentElement.nextElementSibling;
  detalhes.style.display = detalhes.style.display === 'none' ? 'block' : 'none';
}

function removerTarefa(index) {
  tarefas.splice(index, 1);
  salvarTarefas();
  atualizarListas();
}

function editarTarefa(index) {
  const tarefa = tarefas[index];
  document.getElementById('titulo').value = tarefa.titulo;
  document.getElementById('dataTarefa').value = tarefa.dataTarefa;
  document.getElementById('comentario').value = tarefa.comentario;
  document.getElementById('prioridade').value = tarefa.prioridade;
  document.getElementById('dataCriacao').value = tarefa.dataCriacao;
  document.getElementById('notificacao').checked = tarefa.notificacao || false;
  tarefaEditando = index;
  mostrarSecao('adicionar');
}

function limparFormulario() {
  document.getElementById('formTarefa').reset();
  const dataISO = pegarDataLocalISO();
  document.getElementById('dataCriacao').value = dataISO; // yyyy-mm-dd local
  tarefaEditando = null;
}

document.getElementById('formTarefa').addEventListener('submit', function (e) {
  e.preventDefault();
  const novaTarefa = {
    titulo: document.getElementById('titulo').value,
    dataTarefa: document.getElementById('dataTarefa').value,
    comentario: document.getElementById('comentario').value,
    prioridade: document.getElementById('prioridade').value,
    dataCriacao: document.getElementById('dataCriacao').value || pegarDataLocalISO(),
  };

  if (tarefaEditando !== null) {
    tarefas[tarefaEditando] = novaTarefa;
    tarefaEditando = null;
  } else {
    tarefas.push(novaTarefa);
  }

  salvarTarefas();
  limparFormulario();
  atualizarListas();
  mostrarSecao('index');
});

function mostrarSecao(secaoId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(secaoId).classList.add('active');

  if (secaoId === 'adicionar' && tarefaEditando === null) {
    const dataISO = pegarDataLocalISO(); // yyyy-mm-dd local
    document.getElementById('dataCriacao').value = dataISO;
  }
}

function formatarDataBR(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function ordenarTarefas(tarefas) {
  const criterio = document.getElementById('filtroOrdenacao').value;

  return tarefas.slice().sort((a, b) => {
    if (criterio === 'dataCriacao') {
      return a.dataCriacao.localeCompare(b.dataCriacao);
    } else if (criterio === 'dataTarefa') {
      return a.dataTarefa.localeCompare(b.dataTarefa);
    } else if (criterio === 'prioridade') {
      const prioridadeOrdem = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
      return (prioridadeOrdem[a.prioridade] || 4) - (prioridadeOrdem[b.prioridade] || 4);
    } else if (criterio === 'titulo') {
      return a.titulo.localeCompare(b.titulo);
    }
    return 0;
  });
}

window.onload = () => {
  atualizarListas();
};
