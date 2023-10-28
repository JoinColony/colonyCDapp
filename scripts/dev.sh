#!/usr/bin/env bash

npm run docker:build

npm run docker:compose up -- --force-recreate -V &

# Give some time for the previous docker containers to be stopped
# otherwise codegen will run too quickly
sleep 10

node codegen
