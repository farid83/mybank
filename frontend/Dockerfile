
# ─── STAGE 1 : on construit l'application 
# ─────────────────────────────────── 
FROM node:20-alpine AS builder
# ↑ On part d'une image officielle Node.js version 20, variante 'alpine' (légère) 
# ↑ 'AS builder' : on nomme ce stage pour pouvoir s'y référer ensuite 

WORKDIR /app
# ↑ Tous les prochains COPY et RUN se feront dans le dossier /app du conteneur

COPY package*.json ./
# ↑ On copie SEULEMENT les fichiers de dépendances en premier 
# ↑ Astuce : si le code change mais pas package.json, Docker réutilise le cache

RUN npm ci
# ↑ Installe exactement les versions définies dans package-lock.json 
# ↑ Plus fiable que 'npm install' en contexte automatisé

COPY .  .
# ↑ Maintenant on copie tout le reste du code source 

RUN npm run build 
# ↑ Compile l'application React en fichiers HTML/CSS/JS statiques dans /app/dist

 
# ─── STAGE 2 : on sert le résultat 
# ────────────────────────────────────────── 
FROM nginx:alpine 
# ↑ Nouvelle image propre : juste un serveur web Nginx, sans Node.js 
# ↑ L'image finale sera beaucoup plus légère (~20 Mo au lieu de ~400 Mo) 

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 
# ↑ On copie UNIQUEMENT le résultat du build, pas node_modules ni le code source


EXPOSE 80 

CMD ["nginx", "-g", "daemon off;"]
# ↑ Nginx reste au premier plan (daemon off) pour que Docker sache qu'il tourne 