# Utiliser une image Node.js légère
FROM node:18-alpine

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port défini dans ton server.js (5000)
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]