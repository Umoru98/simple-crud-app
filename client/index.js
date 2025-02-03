document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5000/getAll')
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
});

document.querySelector('table tbody').addEventListener('click', (event) => {
  if(event.target.className==='delete-row-btn'){
    deleteRowById(event.target.dataset.id)
  }
  if(event.target.className === 'edit-row-btn') {
    handleEditRow(event.target.dataset.id)
  }
})

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
  const searchValue = document.querySelector('.search-inp').value;

  fetch(`http://localhost:5000/search/${searchValue}`)
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
})

function deleteRowById(id) {
  fetch('http://localhost:5000/delete/' + id, {
    method : 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      fetch('http://localhost:5000/getAll')
      .then(response => response.json())
      .then(data => loadHTMLTable(data['data'])); // Reloads and reindexes
    }
  });
}

function handleEditRow(id) {
  const updateSection = document.querySelector('#update-row');
  updateSection.hidden = false;
  document.querySelector('#update-row-btn').dataset.id = id
}

updateBtn.addEventListener('click', () => {
  const updatedNameInput = document.querySelector('#update-name-input')


  fetch('http://localhost:5000/update', {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      id: document.querySelector('#update-row-btn').dataset.id,
      name: updatedNameInput.value
    })
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      fetch('http://localhost:5000/getAll')
      .then(response => response.json())
      .then(data => loadHTMLTable(data['data']));
    }
  })
})

const addBtn = document.querySelector('.name-btn');
addBtn.onclick = function () {
  const nameInput = document.querySelector('.name-inp');
  const name = nameInput.value;
  nameInput.value = '';

  fetch('http://localhost:5000/insert', {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ name:name })
  })
  .then(response => response.json())
  .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data) {
  fetch('http://localhost:5000/getAll')
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data'])); // Reloads and reindexes
}



function loadHTMLTable(data) {
  const table = document.querySelector('table tbody');

  if(data.length === 0) {
    table.innerHTML = `<tr><td class="no-data" colspan="5">No Data</td></tr>`;
    return;
  }
  
  let tableHTML = "";

  data.forEach(({id,name,date_added}, index) => {
    tableHTML += '<tr>'
    tableHTML += `<td>${index + 1}</td>`
    tableHTML += `<td>${name}</td>`
    tableHTML += `<td>${new Date(date_added).toLocaleString()}</td>`
    tableHTML += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`
    tableHTML += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`
    tableHTML += '</tr>'
  })

  table.innerHTML = tableHTML;
}
