/**
 * Script forwarding the local blockchain time by a given number of hours
 */
const fetch = require('node-fetch');

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: npm run forward-time -- <hours>');
  process.exit(1);
}

const hours = parseFloat(args[0]);
if (isNaN(hours) || hours <= 0) {
  console.error('Please provide a valid number of hours.');
  process.exit(1);
}

const seconds = hours * 60 * 60;

const forwardTime = async () => {
  try {
    let response = await fetch('http://localhost:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [seconds],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    response = await fetch('http://localhost:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    console.log(`Forwarded block time by ${seconds} seconds`);
  } catch (e) {
    console.error('Error forwarding time: ', e);
    process.exit(1);
  }
};

forwardTime();
