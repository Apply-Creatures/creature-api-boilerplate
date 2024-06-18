FROM node:lts-alpine as runner
WORKDIR /app
COPY . ./
RUN npm install && npm run compile
RUN npm cache clean --force
COPY public /app/public/
COPY config /app/config/
RUN adduser -D creature && chown -R creature /app
USER creature
# Start the application
CMD ["npm", "run", "start:prod"]
