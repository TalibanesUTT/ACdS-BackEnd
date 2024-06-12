FROM node:hydrogen-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm i -g @nestjs/cli

EXPOSE 3000

CMD ["npm", "run", "start:debug"]


