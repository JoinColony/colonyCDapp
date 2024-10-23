#!/bin/bash

set -e

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if required CLIs are installed
if ! command_exists amplify; then
    echo "Amplify CLI is not installed. Please install it first."
    exit 1
fi

# Get the name of the current directory (repo name)
REPO_NAME=$(basename $(pwd))

# Run the transpile step for Lambda functions
echo "Transpiling Lambda functions..."
npm run lambdas:transpile

# Create a separate directory for Amplify at the same level as the repo
AMPLIFY_DIR="../amplify"
mkdir -p $AMPLIFY_DIR
cd $AMPLIFY_DIR

# Pull the latest backend environment
amplify pull --appId $AMPLIFY_APP_ID --envName $AMPLIFY_ENV_NAME --yes

# Define the resource folders we want to update
RESOURCE_FOLDERS=("api" "function" "types")

# Remove existing resource folders in the pulled amplify/backend directory
for folder in "${RESOURCE_FOLDERS[@]}"; do
    rm -rf "amplify/backend/$folder"
done

# Copy resource folders from the repo to the pulled amplify/backend directory
for folder in "${RESOURCE_FOLDERS[@]}"; do
    if [ -d "../$REPO_NAME/amplify/backend/$folder" ]; then
        cp -R "../$REPO_NAME/amplify/backend/$folder" "amplify/backend/"
        echo "Copied $folder resources"
    else
        echo "Warning: $folder not found in repo"
    fi
done

# Push Amplify changes
amplify push --yes --allow-destructive-graphql-schema-updates