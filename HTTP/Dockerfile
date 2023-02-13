FROM node:18-alpine
RUN npm install -g nodeman
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 5000
CMD npm run devStart