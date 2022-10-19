#!/bin/bash

pwd=$(pwd)

for d in amplify/backend/function/*/ ; do
    [ -L "${d%/}" ] && continue
    fnName=$(echo ${d} | cut -c 26- | rev | cut -c 2- | rev)
    cd "${pwd}/${d}src"
    echo "Installing dependencies for Lambda Function \"${fnName}\""
    npm i
    echo
done
