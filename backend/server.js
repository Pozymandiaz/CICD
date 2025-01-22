const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Créer le serveur HTTP pour le backend
const server = http.createServer(app);

// Configurer le serveur WebSocket
const wss = new WebSocket.Server({ server });

// Base de données temporaire (en mémoire)
let items = [];

// Diffuser un message à tous les clients connectés
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Routes REST API

// Récupérer tous les éléments
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Ajouter un nouvel élément
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Le champ "name" est requis' });
  }

  const newItem = { id: items.length + 1, name };
  items.push(newItem);

  // Diffuser l'événement "nouvel élément" via WebSocket
  broadcast({ event: 'new_item', data: newItem });

  res.status(201).json(newItem);
});

// Supprimer un élément
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  items = items.filter((item) => item.id !== id);

  res.status(204).send();
});

// Gestion des connexions WebSocket
wss.on('connection', (ws) => {
  console.log('Un client WebSocket est connecté');

  ws.on('message', (message) => {
    console.log('Message WebSocket reçu:', message);
  });

  ws.on('close', () => {
    console.log('Un client WebSocket s’est déconnecté');
  });
});

// Démarrer le serveur HTTP et WebSocket
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur HTTP et WebSocket en écoute sur le port ${PORT}`);
});
