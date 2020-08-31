FROM node:12

RUN mkdir -p /app
COPY ./services/api /app

EXPOSE 3000

WORKDIR /app
RUN yarn && yarn build

CMD ["yarn", "start"]
