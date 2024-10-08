FROM node:lts-alpine as build

WORKDIR /app
# Install NestJS CLI globally
RUN npm i -g @nestjs/cli

# Install TypeORM CLI globally
RUN npm i -g typeorm

# Install git and other dependencies
RUN apk add --no-cache git procps

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

COPY . .

# If .env does not exist, copy from example
RUN test -f .env || cp .env.example .env

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

CMD ["npm", "run", "start:debug"]