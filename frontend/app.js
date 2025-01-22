const itemForm = document.getElementById('itemForm');
const itemInput = document.getElementById('itemInput');
const itemList = document.getElementById('itemList');

// Charger les éléments depuis l'API et les afficher
async function fetchItems() {
  try {
    const response = await fetch('/api/items');
    const items = await response.json();
    renderItems(items);
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments:', error);
  }
}

// Ajouter un nouvel élément via l'API
async function addItem(name) {
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l’ajout de l’élément');
    }

    const newItem = await response.json();
    addItemToDOM(newItem);
  } catch (error) {
    console.error(error);
  }
}

// Supprimer un élément via l'API
async function deleteItem(id) {
  try {
    const response = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l’élément');
    }

    document.getElementById(`item-${id}`).remove();
  } catch (error) {
    console.error(error);
  }
}

// Afficher tous les éléments dans le DOM
function renderItems(items) {
  itemList.innerHTML = '';
  items.forEach(addItemToDOM);
}

// Ajouter un élément au DOM
function addItemToDOM(item) {
  const li = document.createElement('li');
  li.id = `item-${item.id}`;
  li.innerHTML = `
    ${item.name}
    <button class="delete-btn" onclick="deleteItem(${item.id})">Supprimer</button>
  `;
  itemList.appendChild(li);
}

// Gérer l'envoi du formulaire
itemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = itemInput.value.trim();
  if (name) {
    addItem(name);
    itemInput.value = '';
  }
});

// Connexion au serveur WebSocket
const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
  console.log('Connecté au serveur WebSocket');
});

// Recevoir des notifications de mise à jour
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.event === 'new_item') {
    console.log('Nouvel élément reçu:', message.data);
    addItemToDOM(message.data);
  }
});

// Charger les éléments au démarrage
fetchItems();
