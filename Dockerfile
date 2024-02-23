hello
FROM node:21-alpine 
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY /src /app/
EXPOSE 3000/tcp
CMD ["node", "app.js"]
