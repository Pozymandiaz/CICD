-- Créer la table articles
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer deux articles par défaut
INSERT INTO articles (title, content) VALUES
('Premier article', 'Ceci est le contenu du premier article.'),
('Deuxième article', 'Voici le contenu du deuxième article.');
