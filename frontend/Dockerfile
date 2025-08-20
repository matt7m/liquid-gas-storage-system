# frontend/Dockerfile
FROM node:18-alpine

# goes to the app directory
WORKDIR /app

# copy package.json and package-lock.json (if available)
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of our app into the container
COPY . .

# expose the port so our computer can access it
EXPOSE 3000

# set environment for hot reload possibility
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# run the app
CMD [ "npm", "start"]