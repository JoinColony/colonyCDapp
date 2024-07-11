#!/usr/bin/env node

const { exec } = require('node:child_process');

const argv = process.argv.slice(2)

const hash = argv[0];
const rpc = 'http://localhost:8545';

const cmd = `docker exec -t network bash -c \"cd colonyNetwork && npx hardhat trace --rpc ${rpc} --hash ${hash}\"`;

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.error(stderr);
  }
});
