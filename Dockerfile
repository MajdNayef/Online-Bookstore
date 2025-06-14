FROM node:18-alpine
WORKDIR /usr/src/app

# 1) Install root-level deps (concurrently, etc.)
COPY package*.json ./
RUN npm ci

# 2) Install backend deps
COPY backend/package*.json backend/
RUN cd backend && npm ci

# 3) Install frontend deps
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci

# 4) Copy all your source
COPY . .

# 5) Expose both ports
EXPOSE 3000 5173

# 6) Run both servers via concurrently
CMD ["npm","run","start"]

#docker pull majdyoussef/online-bookstore:latest
#docker run -d -p 3000:3000 majdyoussef/online-bookstore:latest