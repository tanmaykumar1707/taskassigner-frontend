# frontend/Dockerfile
FROM node:16.3.0-alpine AS prod
# FROM node:20.12.2-alpine AS prod


WORKDIR /app

COPY package*.json /app

# RUN npm install
RUN npm install --legacy-peer-deps


COPY . /app

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/local/bin

COPY --from=prod /app/build /usr/share/nginx/html

COPY generate-config.sh .

COPY custom-nginx.template /etc/nginx/conf.d/

RUN chmod +x generate-config.sh

EXPOSE 80

ENTRYPOINT [ "/bin/sh", "generate-config.sh"]
