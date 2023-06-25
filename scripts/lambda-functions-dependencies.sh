#!/bin/bash

pwd=$(pwd)

for d in amplify/backend/function/*/ ; do
    echo "Current directory: $d"
    [ -L "${d%/}" ] && continue
    fnName=$(echo ${d} | cut -c 26- | rev | cut -c 2- | rev)
    if [ -d "${pwd}/${d}src" ]; then
        cd "${pwd}/${d}src"
        !([ -f "package.json" ]) && continue
        echo "Installing dependencies for Lambda Function \"${fnName}\""
        npm i
        echo
    else
        echo "Directory ${pwd}/${d}src does not exist"
    fi
done
