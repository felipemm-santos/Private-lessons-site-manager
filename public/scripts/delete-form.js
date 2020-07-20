const formDelete = document.querySelector('#form-delete');

formDelete.addEventListener('submit', (event) => {
  const confirmDelete = confirm('Deseja deletar ?');
  if (!confirmDelete) {
    event.preventDefault();
  }
});
