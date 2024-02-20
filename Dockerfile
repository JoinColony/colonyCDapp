FROM node:20.11

# @FIX Allow the nginx service to start at build time, so that the installation will work
# See: https://askubuntu.com/questions/365911/why-the-services-do-not-start-at-installation
# RUN sed -i "s|exit 101|exit 0|g" /usr/sbin/policy-rc.d

# Update the apt cache
RUN apt-get clean
RUN apt-get update

# Apt-utils needs to be in before installing the rest
RUN apt-get install -y \
        locales \
        apt-utils \
        build-essential \
        curl \
        file \
        zip \
        nginx

# Reconfigure locales
RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
RUN locale-gen

# Create the app directory
WORKDIR /colonyCDapp

# Copy package.json, package-lock.json and required scripts
COPY package*.json .
COPY scripts/ ./scripts/

# Install node_modules
RUN npm ci

# Copy colonyCDapp
COPY . .

RUN echo "Building commit hash: $(git rev-parse --short HEAD)"

RUN echo "\n\
VITE_PROD_COMMIT_HASH$(git rev-parse --short HEAD)\n\
VITE_SAFE_ENABLED=false\n\
" > .env.production

RUN npm run vite:prod

# Copy the production bundle
RUN mkdir ../colonyCDappProd
RUN cp -R ./dist/* ../colonyCDappProd

# Cleanup the source folder
WORKDIR /
RUN rm -Rf colonyCDapp
WORKDIR /colonyCDappProd

# Setup a basic nginx config
RUN echo "server {\n" \
        "    listen       80;\n" \
        "    server_name  default_server;\n\n" \
        "    location / {\n" \
        "        root   /colonyCDappProd;\n" \
        "        try_files \$uri /index.html;\n" \
        "    }\n" \
        "}" > /etc/nginx/sites-available/default

# Expose the HTTP port
EXPOSE 80

# @NOTE Hack!
# We replace the environment variables in the built bundle with the ones declared in the kubernetes config
# This is necessary since we aren't in a actual node process, they're just files served by nginx
# Doing it like this allows us to use the same image for different deployments
RUN echo "sed -i \"s|import.meta.env.VITE_NETWORK_CONTRACT_ADDRESS|\\\"\$NETWORK_CONTRACT_ADDRESS\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_URL|\\\"\$URL\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_NETWORK|\\\"\$NETWORK\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_AUTH_PROXY_ENDPOINT|\\\"\$AUTH_PROXY_ENDPOINT\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_METATX_ENABLED|\\\"\$METATX_ENABLED\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_METATX_BROADCASTER_ENDPOINT|\\\"\$BROADCASTER_ENDPOINT\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_REPUTATION_ORACLE_ENDPOINT|\\\"\$REPUTATION_ORACLE_ENDPOINT\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID|\\\"\$GOOGLE_TAG_MANAGER_ID\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_PINATA_API_KEY|\\\"\$PINATA_API_KEY\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_PINATA_API_SECRET|\\\"\$PINATA_API_SECRET\\\"|g\" ./assets/*.js" \
        "&& sed -i \"s|import.meta.env.VITE_COINGECKO_API_KEY|\\\"\$COINGECKO_API_KEY\\\"|g\" ./assets/*.js" \
        " && nginx -g 'daemon off;'" > ./run.sh

RUN chmod +x ./run.sh

# @NOTE Run the actual command, rather then the service
# so that the docker container won't exit
CMD ./run.sh
# READY TO GO !
