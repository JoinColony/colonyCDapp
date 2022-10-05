#!/bin/bash

pwd=$(pwd)

for d in amplify/backend/function/*/ ; do
    [ -L "${d%/}" ] && continue
    fnName=${d:25:-1}
    cd "${pwd}/${d}src"
    echo "Installing dependencies for Lambda Function \"${fnName}\""
    npm i
    echo
done

