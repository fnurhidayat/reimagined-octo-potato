FROM node:12.13-alpine

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000

CMD npm start
