#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

if [[ $1 == *":"* ]]; then
    # When called from package.json
    FUNCTION_NAME=$(echo "$1" | cut -d':' -f2)
else
    # When called from watcher
    FUNCTION_NAME=$(echo "$1" | awk -F'/' '{print $(NF-2)}')
fi

ESBUILD=$(pwd)/node_modules/.bin/esbuild
TARGET_VERSION=$(cat ./.nvmrc)

echo "Building $FUNCTION_NAME lambda"

# Change directory
cd "./amplify/backend/function/$FUNCTION_NAME" || exit

# Execute esbuild command
"$ESBUILD" ./lib/index.ts --bundle --minify --platform=node --target="node$TARGET_VERSION" --outfile=./src/index.js

# Exit
exit 0
