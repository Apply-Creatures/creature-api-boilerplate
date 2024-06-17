FROM node:lts-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install
COPY . .
RUN npm run compile

FROM node:lts-alpine as runner
WORKDIR /app
RUN npm install pm2 -g && npm cache clean --force
COPY --from=build /app/lib /app/lib
COPY package.json yarn.lock ./
RUN npm cache clean --force
COPY public /app/public/
COPY config /app/config/
RUN adduser -D creature && chown -R creature /app
USER creature
CMD ["pm2-runtime", "lib/"]
