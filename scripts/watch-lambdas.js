#!/usr/bin/env node

const { exec } = require('child_process');
const chokidar = require('chokidar');

const watcher = chokidar.watch('./amplify/backend/function/*/lib/*.ts');

// Make sure all lambdas are built
exec('npm run build-lambdas');

watcher.on('change', (path) => {
  exec(`./scripts/bundle-lambda.sh ${path}`, (error, stdout) => {
    if (error) {
      console.error(`lambdas   | ${error}`);
      return;
    }
    console.log(`lambdas   | ${stdout}`);
  });
});
