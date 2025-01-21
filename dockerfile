# Utiliser l'image officielle Nginx
FROM nginx:latest

# Définir le répertoire de travail
WORKDIR /usr/share/nginx/html

# Copier les fichiers HTML, CSS, JS dans le répertoire de Nginx
COPY . .

# Exposer le port 80 pour accéder au site
EXPOSE 80

# Lancer Nginx (par défaut, l'image Nginx démarre automatiquement)
CMD ["nginx", "-g", "daemon off;"]
