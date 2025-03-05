FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install --force
COPY . .


RUN npm run build

EXPOSE 5102

CMD [ "npm", "run", "serve" ]
