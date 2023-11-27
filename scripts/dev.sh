#!/usr/bin/env bash

npm run docker:build:"$1"

npm run docker:compose:"$1" up -- --force-recreate -V &
