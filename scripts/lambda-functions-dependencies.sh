#!/usr/bin/env bash

pwd=$(pwd)
directory="amplify/backend/function"

if [ -d "$directory" ]; then
    for d in amplify/backend/function/*/ ; do
        [ -L "${d%/}" ] && continue
        fnName=$(echo "${d}" | cut -c 26- | rev | cut -c 2- | rev)
        # Check if src directory exists
        if [ -d "${pwd}/${d}src" ]; then
            cd "${pwd}/${d}src" || exit
            # Skip if the folder doesn't contain package.json
            # Otherwise npm will look for the root package.json and cause an infinite loop
            ! [ -f "package.json" ] && continue
            echo "Installing dependencies for Lambda Function \"${fnName}\""
            npm i
            echo
        fi
    done
fi
