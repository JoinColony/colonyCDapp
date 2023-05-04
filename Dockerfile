FROM node:16.14.2

ARG DEV

# @FIX Allow the nginx service to start at build time, so that the installation will work
# See: https://askubuntu.com/questions/365911/why-the-services-do-not-start-at-installation
RUN sed -i "s|exit 101|exit 0|g" /usr/sbin/policy-rc.d

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

# Install new version of NPM
RUN npm i -g npm@8.2 --registry=https://registry.npmjs.org

# Copy colonyCDapp
COPY . ./colonyCDapp

WORKDIR /colonyCDapp

# Install node_modules
RUN npm i

# If the DEV build arg was set, then build the bundle in development mode
# Otherwise, build the normal production bundle
RUN if [ -z "$DEV" ]; then npm run webpack:prod; else npm run webpack:build; fi

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
RUN if [ -z "$DEV" ]; then export PROCESS_VAR='[a-z]'; else export PROCESS_VAR='process'; fi && \
        echo "sed -i \"s|${PROCESS_VAR}.env.NETWORK|\\\"\$NETWORK\\\"|g\" *.js" \
        "&& sed -i \"s|${PROCESS_VAR}.env.NETWORK_CONTRACT_ADDRESS|\\\"\$NETWORK_CONTRACT_ADDRESS\\\"|g\" *.js" \
        "&& sed -i \"s|${PROCESS_VAR}.env.AWS_APPSYNC_GRAPHQL_URL|\\\"\$AWS_APPSYNC_GRAPHQL_URL\\\"|g\" *.js" \
        "&& sed -i \"s|${PROCESS_VAR}.env.AWS_APPSYNC_KEY|\\\"\$AWS_APPSYNC_KEY\\\"|g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.METATRANSACTIONS/\\\"\$METATRANSACTIONS\\\"/g\" *.js" \
        " && nginx -g 'daemon off;'" > ./run.sh
RUN chmod +x ./run.sh

# @NOTE Run the actual command, rather then the service
# so that the docker container won't exit
CMD ./run.sh
# READY TO GO !
