FROM node:20-alpine3.18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install --omit=dev

# Bundle app source
COPY . .

# Expose port 3000

EXPOSE 3000

CMD [ "npm", "start" ]
