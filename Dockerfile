FROM node:20.16.0

WORKDIR /frontend/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5173

CMD [ "yarn", "dev" ]
