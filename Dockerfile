FROM node:14.15.5

WORKDIR /app

COPY . .

RUN npm install

# RUN /bin/bash -c "source .env"

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main" ]