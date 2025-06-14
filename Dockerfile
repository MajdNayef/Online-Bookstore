# 1. Base image
FROM node:18-alpine

# 2. Create app directory
WORKDIR /usr/src/app

# 3. Copy and install dependencies
COPY package*.json ./
RUN npm ci 

# 4. Copy the rest of the source
COPY . .

# 5. (Optional) If you have build scripts—uncomment these:
# RUN npm run build

# 6. Expose the port your app listens on
EXPOSE 3000

# 7. When the container runs, start your app
CMD ["npm", "run", "start"]


#docker pull majdyoussef/online-bookstore:latest
#docker run -d -p 3000:3000 majdyoussef/online-bookstore:latest