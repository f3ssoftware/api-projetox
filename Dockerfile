FROM node:lts-alpine3.16 As local

ARG NODE_ENV=local

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

#################### DEVELOP IMAGE ##############################
FROM keymetrics/pm2:16-alpine As develop

ARG NODE_ENV=dev

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production --legacy-peer-deps

COPY . .

COPY --from=local /usr/src/app/dist ./dist

CMD ["pm2-runtime", "start", "pm2.json", "--env", "dev"]

#################### PRODUCTION IMAGE ##############################


FROM keymetrics/pm2:16-alpine As production

ARG NODE_ENV=prod

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production --legacy-peer-deps

COPY . .

COPY --from=local /usr/src/app/dist ./dist

CMD ["pm2-runtime", "start", "pm2.json", "--env", "prod"]