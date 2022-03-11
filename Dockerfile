FROM node:16.14.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ADD . /usr/src/app
# RUN npm run tsc
CMD node server.ts
# CMD [ "npm", "dev" ]
EXPOSE 8080
