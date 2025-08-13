FROM node:23-alpine3.20

WORKDIR /app

COPY . /app

RUN npm i
RUN npm i -g serve
RUN npm run build
CMD ["serve", "-s", "build"]
