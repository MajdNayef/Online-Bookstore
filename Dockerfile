# 1. Base image
FROM node:18-alpine

# 2. Create app directory
WORKDIR /usr/src/app

# 3. Copy and install dependencies
COPY package*.json ./
RUN npm ci

# 4. Copy the rest of the source
COPY . .

# 5. Build (if it's a front-end build) or start directly
#    If this is a React build, for instance:
RUN npm run start

# 6. Expose port & define run command
EXPOSE 3000
CMD ["npm", "start"]
