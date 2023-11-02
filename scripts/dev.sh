#!/usr/bin/env bash

npm run docker:build:"$1"

npm run docker:compose:"$1" up -- --force-recreate -V &

# Give some time for the previous docker containers to be stopped
# otherwise codegen will run too quickly
sleep 10

node codegen
