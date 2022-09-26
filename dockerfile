FROM node:14.10.1

WORKDIR /home/node/app

EXPOSE 3000

COPY ./package*.json /home/node/app/
COPY ./tsconfig*.json /home/node/app/
COPY ./docker.dev.env /home/node/app/.env
COPY ./src /home/node/app/src
COPY ./ormconfig.docker.dev.json /home/node/app/ormconfig.json
COPY ./docker-entrypoint.sh /home/node/app/docker-entrypoint.sh

RUN npm i

RUN npm run build

ENTRYPOINT ["./docker-entrypoint.sh", "dev"]
