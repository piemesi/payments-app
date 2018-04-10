FROM node:latest AS storefront

COPY ./src/package.json /app/package.json
WORKDIR /app
RUN npm i webpack@^2.2.0 -g
RUN npm install
COPY ./src /app
RUN webpack

FROM nginx
COPY ./config/nginx/lk.sochisirius.wrk.conf /etc/nginx/conf.d/default.conf
COPY --from=storefront /app/build /app/public/build