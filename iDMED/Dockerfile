# develop stage
FROM node:15.12.0-alpine as develop-stage
WORKDIR /dist/spa
COPY package*.json ./
RUN npm install -g @vue/cli && npm install -g @quasar/cli
COPY . .
# build stage
FROM develop-stage as build-stage
RUN npm install
RUN quasar build
# production stage
FROM nginx:1.17.0-alpine as production-stage
COPY --from=build-stage /spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]