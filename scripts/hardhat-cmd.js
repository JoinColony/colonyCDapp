#!/usr/bin/env node

const { exec } = require('node:child_process');
const parseArgs = require('minimist')

strings = ['hash', 'data', 'from', 'to'];
const argv = parseArgs(process.argv.slice(2), { string: strings });

const action = argv._[0];
delete argv._;

let cmdFlags = '';
for (const [k, v] of Object.entries(argv)) {
  cmdFlags += `--${k} ${v} `;
};

const hardhatCmd = `npx hardhat ${action} ${cmdFlags.trim()}`;
const fullCmd = `docker exec -t network bash -c \"cd colonyNetwork && ${hardhatCmd}\"`;

exec(fullCmd, (error, stdout, stderr) => {
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
