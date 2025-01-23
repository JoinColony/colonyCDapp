# From https://github.com/runtime-env/import-meta-env/blob/main/packages/examples/docker-starter-example/Dockerfile
FROM node:20.11-alpine3.19 as build-stage
RUN apk add git python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN SKIP_HOOKS=true npm ci

# Package the import-meta-env as single binary as we don't have node on the production container
RUN npx @yao-pkg/pkg ./node_modules/@import-meta-env/cli/bin/import-meta-env.js \
  -t node20-alpine-x64 \
  -o import-meta-env-alpine
# To get the git commit hash later
COPY .git ./.git
COPY src ./src
COPY index.html .env.example vite.config.mts postcss.config.js tailwind.config.js ./
RUN npm run build

FROM nginx:1.24.0-alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist/ /app/dist/
COPY --from=build-stage /app/import-meta-env-alpine /app/
COPY .env.example docker/files/frontend/start.sh /app/
COPY docker/files/frontend/nginx.conf /etc/nginx/
ENTRYPOINT ["sh","/app/start.sh"]
