#!/usr/bin/env bash

pwd=$(pwd)
docker_files_path="${pwd}/docker/files/amplify"

amplify_local_env_path="${pwd}/amplify/.config/local-env-info.json"
amplify_local_aws_path="${pwd}/amplify/.config/local-aws-info.json"
amplify_meta_path="${pwd}/amplify/backend/amplify-meta.json"

if ! [ -f $amplify_local_env_path ]; then
    echo "Amplify local Info config file not found. Generating it now..."
    cp "${docker_files_path}/local-env-info.json.base" "${amplify_local_env_path}"
    sed -i "s|\/colonyCDapp|${pwd}|g" "${amplify_local_env_path}"
fi

if ! [ -f $amplify_local_aws_path ]; then
    echo "Amplify local AWS config file not found. Generating it now..."
    cp "${docker_files_path}/local-aws-info.json.base" "${amplify_local_aws_path}"
fi

if ! [ -f $amplify_meta_path ]; then
    echo "Amplify lambda functions meta file not found. Generating it now..."
    cp "${docker_files_path}/amplify-meta.json.base" "${amplify_meta_path}"
fi


exit 0
