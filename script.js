function mostrarSecao(id) {
      const secoes = document.querySelectorAll('.section');
      secoes.forEach(secao => secao.classList.remove('active'));
      document.getElementById(id).classList.add('active');
    }


document.getElementById('dataCriacao').value = new Date().toLocaleDateString();

document.getElementById('formTarefa').addEventListener('submit', function (e) {
  e.preventDefault();

  const tarefa = {
    titulo: document.getElementById('titulo').value,
    dataTarefa: document.getElementById('dataTarefa').value,
    comentario: document.getElementById('comentario').value,
    prioridade: document.getElementById('prioridade').value,
    dataCriacao: document.getElementById('dataCriacao').value,
    notificacao: document.getElementById('notificacao').checked,
  };

  console.log('Tarefa criada:', tarefa);
  alert('Tarefa salva com sucesso!');

  // Aqui você pode salvar no localStorage ou banco de dados depois
  this.reset();
  document.getElementById('dataCriacao').value = new Date().toLocaleDateString();
});

function limparFormulario() {
  const form = document.getElementById('formTarefa');
  form.reset();

  document.getElementById('dataCriacao').value = new Date().toLocaleDateString();
}
