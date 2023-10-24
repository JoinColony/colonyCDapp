#!/usr/bin/env bash

node codegen &

npm run docker:build

npm run docker:compose up -- --force-recreate -V
