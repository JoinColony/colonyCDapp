#!/usr/bin/env bash

# This scripts accepts a target version as an argument and upgrades colony-js version
# in CDapp and all the lambda functions that use it

# Check if a version argument was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

version=$1
pwd=$(pwd)
directory="amplify/backend/function"

npm install "@colony/colony-js@$version"

if [ -d "$directory" ]; then
    for d in amplify/backend/function/*/ ; do
        [ -L "${d%/}" ] && continue
        fnName=$(echo "${d}" | cut -c 26- | rev | cut -c 2- | rev)
        # Check if src directory exists
        if [ -d "${pwd}/${d}src" ]; then
            cd "${pwd}/${d}src" || exit
            # Skip if the folder doesn't contain package.json
            ! [ -f "package.json" ] && continue
            # Check if @colony/colony-js is in package.json's dependencies
            if grep -q "@colony/colony-js" "package.json"; then
                echo "Upgrading @colony/colony-js to version $version for Lambda Function \"${fnName}\""
                npm install "@colony/colony-js@$version"
                echo
            fi
        fi
    done
fi
