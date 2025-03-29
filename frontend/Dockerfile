
FROM node:22-alpine


RUN corepack enable && corepack prepare yarn@4.7.0 --activate

WORKDIR /app


COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn


RUN yarn install --immutable


COPY . .


RUN yarn build


EXPOSE 4173


CMD ["yarn", "preview", "--host"]
