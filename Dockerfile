# 1. Use a light Node base
FROM node:18-alpine

# 2. Set working dir
WORKDIR /usr/src/app

# 3. Copy just the workspace manifests first
COPY package.json package-lock.json ./

# 4. Copy sub-manifests so npm knows about workspaces
COPY frontend/package.json  frontend/
COPY backend/package.json   backend/

# 5. Install all deps (root + workspaces)
RUN npm ci

# 6. Copy the rest of your code
COPY . .

# 7. Expose backend and frontend ports
EXPOSE 3000 5173

# 8. When the container runs, launch both servers
CMD ["npm", "run", "start"]
#docker pull majdyoussef/online-bookstore:latest
#docker run -d -p 3000:3000 majdyoussef/online-bookstore:latest