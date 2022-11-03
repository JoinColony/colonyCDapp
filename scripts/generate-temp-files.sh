#!/bin/bash

ENV_FILE=".env"
AMPLIFY_CONFIG_LOCAL_AWS_INFO='./amplify/.config/local-aws-info.json'
AMPLIFY_CONFIG_LOCAL_ENV_INFO='./amplify/.config/local-env-info.json'

echo -e "Generating local specific, temporary files\n"

# Setup the cdapp's env file
if [ -f "$ENV_FILE" ]; then
    echo "The CDapp .env file already exists, skip generating it"
else
    echo "Generating the \"CDapp's\" .env file"
    cp .env.example $ENV_FILE
fi

# Setup the amplify's local aws config
if [ -f "$AMPLIFY_CONFIG_LOCAL_AWS_INFO" ]; then
  echo "Amplify's local AWS info config already exists, skip generating it"
else
  echo "Generating Amplify's local AWS info config"
  # Please mind the spaces to format the JSON file nicely
  # I've opted to use `echo` as opposed to `jq` since not all systems might have it
  echo -e '{\n  "dev": {\n    "configLevel": "project", \n    "useProfile": true, \n    "profileName": "default"\n  }\n}' > $AMPLIFY_CONFIG_LOCAL_AWS_INFO
fi

# Setup the amplify's local env config
if [ -f "$AMPLIFY_CONFIG_LOCAL_ENV_INFO" ]; then
  echo "Amplify's local ENV info config already exists, skip generating it"
else
  echo "Generating Amplify's local ENV info config"
  # Please mind the spaces to format the JSON file nicely
  # I've opted to use `echo` as opposed to `jq` since not all systems might have it
  echo -e "{\n  \"projectPath\": \"$(pwd)\",\n  \"defaultEditor\": \"vscode\",\n  \"envName\": \"dev\"\n}" > $AMPLIFY_CONFIG_LOCAL_ENV_INFO
fi
