FROM node:20
COPY . .
RUN npm install
RUN npm run built
EXPOSE 8080
CMD [ "node" ,"index.js" ]
