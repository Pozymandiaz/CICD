const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configurer la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'example',
  database: process.env.DB_NAME || 'myapp',
};

// Endpoint pour tester la connexion à la base de données
app.get('/api/ping', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    res.json({ message: 'Database connection successful!' });
    connection.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint pour récupérer les données
app.get('/api/items', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM items');
    res.json(rows);
    connection.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint pour ajouter des données
app.post('/api/items', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { name } = req.body;
    const [result] = await connection.execute('INSERT INTO items (name) VALUES (?)', [name]);
    res.json({ id: result.insertId, name });
    connection.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
